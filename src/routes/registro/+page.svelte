<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { page } from "$app/stores";
  import { z } from "zod";
  import { siteConfig } from "$lib/config/site";
  import { getSupabase, signupLandingPlanId, signupRedirectUrl, signupTrialDays } from "$lib/supabase";
  import { plans } from "$lib/data/pricingData.js";
  import { detectCountry } from "$lib/utils/country";
  import { trackSignup, trackFormStart } from "$lib/tracking/track";
  import { metaCookies, newEventId } from "$lib/tracking/meta";
  import heroPhoto from "$lib/assets/images/home/hero.webp";

  // Registro self-service (fase 1): crea el usuario en Supabase Auth y Supabase manda el
  // correo de confirmación. La academia se crea después, en el SaaS (fase 2).
  // Los botones que llevan aquí (precios, menú) solo aparecen con PUBLIC_SIGNUP; noindex y fuera del sitemap.

  // Misma regla que la API (users.controller.ts PASSWORD_REGEX) y que Supabase Auth.
  const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  const PASSWORD_HINT = "Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo";
  const RESEND_COOLDOWN_S = 60;
  const MIN_FILL_MS = 3000;
  const THROTTLE_KEY = "last_signup_submit";

  const schema = z.object({
    email: z.string().trim().email("Revisa el correo"),
    password: z.string().regex(PASSWORD_RULE, PASSWORD_HINT),
    acepta: z.literal(true, { message: "Acepta los términos para continuar" }),
  });

  let email = $state("");
  let password = $state("");
  let acepta = $state(false);
  let showPassword = $state(false);
  let website = $state(""); // honeypot — debe quedar vacío

  const trialDays = signupTrialDays();
  // La página se prerenderiza (sin query string): el plan de ?plan= se lee recién en el navegador.
  let chosenPlanName = $state<string | null>(null);

  let status = $state<"idle" | "loading" | "sent" | "error">("idle");
  let errorMsg = $state("");
  let fieldErrors = $state<Record<string, string>>({});
  let resendIn = $state(0);
  let resendMsg = $state("");
  let formLoadedAt = 0;
  let formStarted = false;
  let timer: ReturnType<typeof setInterval> | undefined;

  onMount(() => {
    formLoadedAt = Date.now();
    const landingId = signupLandingPlanId($page.url.searchParams.get("plan") ?? "");
    chosenPlanName = plans.find((p) => p.id === landingId)?.name ?? null;
  });
  onDestroy(() => clearInterval(timer));

  function markFormStarted() {
    if (formStarted) return;
    formStarted = true;
    trackFormStart("registro_form");
  }

  function startCooldown() {
    resendIn = RESEND_COOLDOWN_S;
    clearInterval(timer);
    timer = setInterval(() => {
      resendIn -= 1;
      if (resendIn <= 0) clearInterval(timer);
    }, 1000);
  }

  function signupCountry(pais: string | null): string {
    const code = (pais || detectCountry()).toUpperCase();
    return /^[A-Z]{2}$/.test(code) && code !== "US" ? code : "";
  }

  // Datos de origen (sin permisos): quedan en user_metadata del usuario para medir campañas.
  function signupMetadata() {
    const q = $page.url.searchParams;
    return {
      signup_source: "landing",
      // Aceptó los términos (casilla obligatoria): el API los copia al crear su negocio.
      terms_version: siteConfig.legal.termsVersion,
      utm_source: q.get("utm_source") || "",
      utm_medium: q.get("utm_medium") || "",
      utm_campaign: q.get("utm_campaign") || "",
      utm_content: q.get("utm_content") || "",
      promo_code: (q.get("promo") || q.get("promo_code") || "").toUpperCase().trim(),
      // Plan elegido en los precios (tier_key del catálogo). El SaaS lo muestra en la bienvenida; el API decide si aplica.
      signup_plan: /^[a-z0-9_-]{1,64}$/.test(q.get("plan") ?? "") ? q.get("plan") : "",
      signup_cycle: ["mensual", "trimestral", "anual"].includes(q.get("ciclo") ?? "") ? q.get("ciclo") : "",
      // País de los precios que vio (o el de su zona horaria). "US" = "Otros": que lo elija en la bienvenida.
      signup_country: signupCountry(q.get("pais")),
      ...metaCookies(),
    };
  }

  /** Errores de Supabase Auth → mensaje para la persona. Nunca revela si el correo ya existe. */
  function messageFor(code: string | undefined): string {
    switch (code) {
      case "weak_password":
        return PASSWORD_HINT;
      case "email_address_invalid":
      case "validation_failed":
        return "Revisa el correo";
      case "over_email_send_rate_limit":
      case "over_request_rate_limit":
        return "Demasiados intentos. Espera un momento y vuelve a intentar.";
      default:
        return "No pudimos crear tu cuenta. Inténtalo de nuevo o escríbenos por WhatsApp.";
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (status === "loading") return;

    // Primero validar: el formulario nunca se "salta" por el antibot.
    const parsed = schema.safeParse({ email, password, acepta });
    if (!parsed.success) {
      fieldErrors = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message]));
      return;
    }
    fieldErrors = {};

    // Antibot (mismo criterio que LeadForm), solo con datos válidos: fingir éxito sin llamar a Supabase.
    const lastSubmit = Number(localStorage.getItem(THROTTLE_KEY) || 0);
    if (website.trim() !== "" || (formLoadedAt && Date.now() - formLoadedAt < MIN_FILL_MS) || Date.now() - lastSubmit < 60_000) {
      status = "sent";
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      status = "error";
      errorMsg = "El registro no está disponible en este momento.";
      return;
    }

    status = "loading";
    errorMsg = "";
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: signupRedirectUrl(), data: signupMetadata() },
    });

    if (error) {
      status = "error";
      errorMsg = messageFor(error.code);
      return;
    }

    // OK, o el correo ya existía (Supabase responde igual): mismo mensaje en los dos casos.
    localStorage.setItem(THROTTLE_KEY, String(Date.now()));
    trackSignup("registro", newEventId());
    status = "sent";
    startCooldown();
  }

  async function resend() {
    const supabase = getSupabase();
    if (!supabase || resendIn > 0) return;
    resendMsg = "";
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: signupRedirectUrl() },
    });
    resendMsg = error ? messageFor(error.code) : "Te enviamos un nuevo enlace.";
    startCooldown();
  }

  function changeEmail() {
    status = "idle";
    password = "";
    resendMsg = "";
  }
</script>

<svelte:head>
  <title>Crea tu cuenta gratis | FlowPass</title>
  <meta name="description" content="Crea tu cuenta de FlowPass y prueba la plataforma para academias, gimnasios y estudios." />
  <!-- Oculta hasta el lanzamiento: no indexar (tampoco está en el sitemap). -->
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="signup-page">
  <div class="shell">
    <aside class="photo" style={`--photo:url(${heroPhoto})`}>
      <div class="media" role="img" aria-label="Dueña de un estudio de danza haciendo las cuentas del mes"></div>
      <div class="photo-copy">
        <!-- Con plan elegido en los precios: ese plan (días gratis y cobro se ven en la bienvenida). Sin plan: la prueba. -->
        {#if chosenPlanName}
          <h2>Empieza con <span>{chosenPlanName}</span></h2>
          <ul>
            <li>Tu academia lista en 2 minutos</li>
            <li>Sin tarjeta para crear tu cuenta</li>
            <li>Confirmas tu plan antes de pagar</li>
          </ul>
        {:else}
          <h2>Prueba FlowPass <span>{trialDays ? `${trialDays} días gratis` : "gratis"}</span></h2>
          <ul>
            <li>Sin tarjeta ni compromiso</li>
            <li>Tu academia lista en 2 minutos</li>
            <li>Al terminar, eliges el plan que te acomode</li>
          </ul>
        {/if}
      </div>
    </aside>

    <section class="card" aria-labelledby="signup-title">
      {#if status === "sent"}
        <div class="sent">
          <span class="mail-icon" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
          </span>
          <h1 id="signup-title">Revisa tu correo</h1>
          <p>
            Si <strong>{email.trim()}</strong> es válido, te enviamos un enlace para confirmar tu cuenta. Ábrelo desde este u otro dispositivo.
          </p>
          <p class="hint">¿No lo ves? Revisa <strong>Spam</strong> o <strong>Promociones</strong>. El enlace vence en 24 horas.</p>
          <!-- Supabase no avisa si el correo ya tenía cuenta (no revela qué correos existen): se explica sin confirmarlo. -->
          <p class="hint">
            ¿Ya tenías cuenta con este correo? No te llegará nada: <a href="https://app.flow-pass.com/login">ingresa aquí</a>.
            Si no recuerdas tu contraseña, ahí mismo puedes recuperarla.
          </p>
          <button type="button" class="btn-white" onclick={resend} disabled={resendIn > 0}>
            {resendIn > 0 ? `Reenviar correo (${resendIn} s)` : "Reenviar correo"}
          </button>
          {#if resendMsg}<p class="note" role="status">{resendMsg}</p>{/if}
          <p class="small">
            ¿Te equivocaste de correo? <button type="button" class="link" onclick={changeEmail}>Cambiar correo</button>
          </p>
          <p class="small">¿Ya tienes cuenta? <a href="https://app.flow-pass.com/login">Ingresar</a></p>
        </div>
      {:else}
        <p class="eyebrow">Paso 1 de 2 · Tu cuenta</p>
        <h1 id="signup-title">Crea tu cuenta gratis</h1>
        <p class="small">¿Ya tienes cuenta? <a href="https://app.flow-pass.com/login">Ingresar</a></p>

        <form onsubmit={handleSubmit} novalidate>
          <label class="field">
            <span>Correo electrónico</span>
            <input
              type="email"
              autocomplete="email"
              inputmode="email"
              bind:value={email}
              onfocus={markFormStarted}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "err-email" : undefined}
            />
            {#if fieldErrors.email}<small id="err-email" class="err">{fieldErrors.email}</small>{/if}
          </label>

          <label class="field">
            <span>Contraseña</span>
            <div class="pw">
              <input
                type={showPassword ? "text" : "password"}
                autocomplete="new-password"
                bind:value={password}
                onfocus={markFormStarted}
                aria-invalid={!!fieldErrors.password}
                aria-describedby="hint-password"
              />
              <button type="button" class="toggle" onclick={() => (showPassword = !showPassword)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
            <small id="hint-password" class={fieldErrors.password ? "err" : "muted"}>{PASSWORD_HINT}</small>
          </label>

          <!-- Honeypot: invisible para personas, los bots lo llenan -->
          <div class="honeypot" aria-hidden="true">
            <label>Sitio web <input type="text" tabindex="-1" autocomplete="off" bind:value={website} /></label>
          </div>

          <label class="check">
            <input type="checkbox" bind:checked={acepta} aria-invalid={!!fieldErrors.acepta} />
            <span>Acepto los <a href="/terminos" target="_blank" rel="noopener">Términos</a> y la <a href="/privacidad" target="_blank" rel="noopener">Política de privacidad</a></span>
          </label>
          {#if fieldErrors.acepta}<small class="err">{fieldErrors.acepta}</small>{/if}

          {#if status === "error"}
            <p class="form-error" role="alert">
              {errorMsg}
              {#if errorMsg.includes("WhatsApp")}<a href={siteConfig.social.whatsapp} target="_blank" rel="noopener">Escribir por WhatsApp</a>{/if}
            </p>
          {/if}

          <button type="submit" class="btn-green" disabled={status === "loading"}>
            {status === "loading" ? "Creando tu cuenta…" : "Crear cuenta"}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </button>
          <p class="small center">¿Prefieres que te guiemos? <a href="/agenda">Agenda 15 minutos</a></p>
        </form>
      {/if}
    </section>
  </div>
</div>

<style>
  .signup-page {
    min-height: 100vh;
    padding: 104px 20px 48px;
    color: #f5f5f5;
  }
  .shell {
    max-width: 1280px;
    margin-inline: auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    min-height: min(680px, calc(100vh - 152px));
  }
  /* Panel con la foto del hero y la misma gradación de marca */
  .photo { position: relative; border-radius: 24px; overflow: hidden; display: flex; align-items: flex-end; isolation: isolate; background: #09090f; }
  .media {
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      radial-gradient(45% 60% at 52% 30%, rgba(83, 29, 216, 0.85), transparent 75%),
      linear-gradient(rgba(83, 29, 216, 0.55), rgba(83, 29, 216, 0.55)),
      var(--photo) 72% center / cover no-repeat;
    background-blend-mode: soft-light, soft-light, normal;
  }
  .photo::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(9, 9, 15, 0.1) 25%, rgba(9, 9, 15, 0.88) 100%); }
  .photo-copy { padding: 40px; }
  .photo-copy h2 { margin: 0; font-size: clamp(30px, 3.4vw, 44px); line-height: 1.04; color: #fff; }
  .photo-copy h2 span { display: block; color: #01f59e; }
  .photo-copy ul { list-style: none; padding: 0; margin: 20px 0 0; display: grid; gap: 12px; color: rgba(255, 255, 255, 0.86); }
  .photo-copy li { display: flex; gap: 12px; align-items: center; }
  .photo-copy li::before { content: "✓"; color: #01f59e; font-weight: 700; }

  .card {
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 36px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 14px;
  }
  .eyebrow { margin: 0; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255, 255, 255, 0.6); }
  h1 { margin: 0; font-size: 32px; color: #fff; }
  form { display: flex; flex-direction: column; gap: 14px; margin-top: 6px; }
  .field { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: #d4d4d8; }
  input[type="email"], input[type="text"], input[type="password"] {
    font: inherit;
    color: #f5f5f5;
    background: #0e0e14;
    padding: 12px 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    width: 100%;
    box-sizing: border-box;
  }
  input:focus-visible { outline: 2px solid #01f59e; outline-offset: 1px; }
  input[aria-invalid="true"] { border-color: #f87171; }
  .pw { position: relative; }
  .pw input { padding-right: 72px; }
  .toggle { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: 0; color: #01f59e; font: inherit; font-size: 13px; cursor: pointer; padding: 8px; }
  .check { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: #d4d4d8; line-height: 1.5; }
  .check input { margin-top: 3px; width: 16px; height: 16px; accent-color: #01f59e; }
  .muted { font-size: 12px; color: #a1a1aa; }
  .err { font-size: 12px; color: #fca5a5; }
  .form-error { margin: 0; padding: 12px 14px; border-radius: 12px; background: rgba(248, 113, 113, 0.1); border: 1px solid rgba(248, 113, 113, 0.35); color: #fecaca; font-size: 14px; display: flex; flex-direction: column; gap: 6px; }
  .small { margin: 0; font-size: 14px; color: #a1a1aa; }
  .center { text-align: center; font-size: 13px; }
  a, .link { color: #01f59e; }
  .link { background: none; border: 0; font: inherit; cursor: pointer; padding: 0; text-decoration: underline; }
  .btn-green, .btn-white {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 14px;
    border-radius: 999px;
    border: 0;
    font: inherit;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
  }
  .btn-green { background: #01f59e; color: #04150e; }
  .btn-white { background: #fff; color: #09090f; }
  .btn-green:disabled, .btn-white:disabled { opacity: 0.6; cursor: default; }
  .honeypot { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }

  .sent { display: flex; flex-direction: column; gap: 14px; text-align: center; align-items: center; }
  .sent p { margin: 0; color: #a1a1aa; line-height: 1.6; }
  .sent strong { color: #f5f5f5; }
  .sent .btn-white { width: 100%; }
  .hint { width: 100%; box-sizing: border-box; background: #0e0e14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 12px 14px; text-align: left; font-size: 14px; }
  .note { font-size: 13px; }
  .mail-icon { width: 72px; height: 72px; border-radius: 999px; background: rgba(1, 245, 158, 0.12); border: 1px solid rgba(1, 245, 158, 0.4); color: #01f59e; display: inline-flex; align-items: center; justify-content: center; }

  /* Celular: sin la foto, solo el formulario */
  @media (max-width: 820px) {
    .shell { grid-template-columns: minmax(0, 1fr); min-height: 0; }
    .photo { display: none; }
    .card { padding: 28px 22px; }
    h1 { font-size: 28px; }
  }
</style>
