<script lang="ts">
  import { PUBLIC_N8N_LEADS_WEBHOOK } from "$env/static/public";
  import { onMount } from "svelte";
  import { z } from "zod";
  import {
    parsePhoneNumberFromString,
    type CountryCode,
  } from "libphonenumber-js";

  type Props = {
    calLink?: string;
  };

  let { calLink = "" }: Props = $props();

  function flag(code: string): string {
    return code
      .toUpperCase()
      .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  }

  const countries = [
    { code: "PE", name: "Perú", dial: "+51" },
    { code: "MX", name: "México", dial: "+52" },
    { code: "CL", name: "Chile", dial: "+56" },
    { code: "CO", name: "Colombia", dial: "+57" },
    { code: "AR", name: "Argentina", dial: "+54" },
    { code: "EC", name: "Ecuador", dial: "+593" },
    { code: "BO", name: "Bolivia", dial: "+591" },
  ] as const;

  const tiposAcademia = [
    "Gimnasio",
    "Pilates / Yoga / Barre",
    "CrossFit",
    "Entrenamiento funcional",
    "Indoor cycling",
    "Box",
    "Artes marciales",
    "Academia de baile",
    "Academia deportiva (fútbol, vóley, etc.)",
    "Natación",
    "Escuela de música / arte",
    "Escuela de teatro",
    "Escuela de idiomas",
    "Centro de capacitación / formación",
    "Centro de estimulación temprana",
    "Coach deportivo / personal trainer",
    "Otros",
  ];

  const situaciones = [
    "Sí, ya tengo una",
    "No, pero abriré en menos de 3 meses",
    "No, pero estoy pensando en abrir una",
    "No, solo busco dónde entrenar/estudiar",
  ];

  const roles = [
    "Dueño/Propietario/Gerente",
    "Coach/Instructor",
    "Staff de la academia",
    "Alumno",
  ];

  let nombre = $state("");
  let apellido = $state("");
  let countryCode = $state("PE");
  let telefono = $state("");
  let email = $state("");
  let negocio = $state("");
  let tipoAcademia = $state("");
  let situacion = $state("");
  let rol = $state("");

  let status = $state<"idle" | "loading" | "success" | "error">("idle");
  let errorMsg = $state("");
  let fieldErrors = $state<Record<string, string>>({});

  // Autodetect país por IP (ipapi.co — gratis, sin key). Cae a 'PE' si falla.
  onMount(async () => {
    if (telefono) return; // si el user ya empezó a escribir, no lo cambies
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 2500);
      const res = await fetch("https://ipapi.co/json/", {
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) return;
      const data = await res.json();
      const cc = String(data?.country_code ?? "").toUpperCase();
      if (countries.some((c) => c.code === cc)) {
        countryCode = cc;
      }
    } catch {
      // silencio: no afecta UX
    }
  });
  let touched = $state<Record<string, boolean>>({});

  const tiposAcademiaValues = tiposAcademia as readonly string[];
  const situacionesValues = situaciones as readonly string[];
  const rolesValues = roles as readonly string[];

  // Solo letras (incluye acentos, ñ), espacios, apóstrofes y guiones.
  const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿÑñ' -]+$/;

  const baseSchema = z.object({
    nombre: z
      .string()
      .trim()
      .min(2, "Ingresa tu nombre.")
      .regex(NAME_REGEX, "El nombre solo debe contener letras."),
    apellido: z
      .string()
      .trim()
      .min(2, "Ingresa tu apellido.")
      .regex(NAME_REGEX, "El apellido solo debe contener letras."),
    email: z
      .string()
      .trim()
      .optional()
      .refine(
        (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        "Ingresa un correo válido.",
      ),
    negocio: z.string().trim().min(2, "Ingresa el nombre de tu academia."),
    tipoAcademia: z
      .string()
      .refine((v) => tiposAcademiaValues.includes(v), "Selecciona una opción."),
    situacion: z
      .string()
      .refine((v) => situacionesValues.includes(v), "Selecciona una opción."),
    rol: z
      .string()
      .refine((v) => rolesValues.includes(v), "Selecciona una opción."),
  });

  function validatePhone(raw: string, country: CountryCode): string | null {
    if (!raw.trim()) return "Ingresa tu número de WhatsApp.";
    const parsed = parsePhoneNumberFromString(raw, country);
    if (!parsed || !parsed.isValid()) {
      return "Número inválido para el país seleccionado.";
    }
    return null;
  }

  function valueOf(field: string): unknown {
    switch (field) {
      case "nombre":
        return nombre;
      case "apellido":
        return apellido;
      case "email":
        return email;
      case "negocio":
        return negocio;
      case "tipoAcademia":
        return tipoAcademia;
      case "situacion":
        return situacion;
      case "rol":
        return rol;
      default:
        return "";
    }
  }

  function validateField(field: string, mode: "live" | "full" = "full") {
    if (field === "telefono") {
      // En live, ignora si todavía no escribió números reales
      if (mode === "live" && telefono.replace(/\D/g, "").length < 3) {
        const next = { ...fieldErrors };
        delete next.telefono;
        fieldErrors = next;
        return;
      }
      const err = validatePhone(telefono, countryCode as CountryCode);
      const next = { ...fieldErrors };
      if (err) next.telefono = err;
      else delete next.telefono;
      fieldErrors = next;
      return;
    }
    const shape = (baseSchema.shape as Record<string, z.ZodTypeAny>)[field];
    if (!shape) return;
    const value = valueOf(field);
    const result = shape.safeParse(value);
    let msg = "";
    if (!result.success) {
      let issues = result.error.issues;
      // En live: ignora "muy corto" si todavía está escribiendo. Mantén errores de formato (regex/email).
      if (mode === "live" && typeof value === "string" && value.length > 0) {
        issues = issues.filter((i) => i.code !== "too_small");
      }
      // En live con valor vacío: no grites todavía.
      if (mode === "live" && typeof value === "string" && value.length === 0) {
        issues = [];
      }
      msg = issues[0]?.message ?? "";
    }
    const next = { ...fieldErrors };
    if (msg) next[field] = msg;
    else delete next[field];
    fieldErrors = next;
  }

  function markTouched(field: string) {
    touched = { ...touched, [field]: true };
    validateField(field, "full");
  }

  // Valida en vivo desde la 1a tecla — sólo errores de formato, no de longitud.
  function liveValidate(field: string) {
    validateField(field, touched[field] ? "full" : "live");
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (status === "loading") return;

    const errs: Record<string, string> = {};

    const parsedFields = baseSchema.safeParse({
      nombre,
      apellido,
      email,
      negocio,
      tipoAcademia,
      situacion,
      rol,
    });

    if (!parsedFields.success) {
      for (const issue of parsedFields.error.issues) {
        const key = issue.path[0] as string;
        if (key && !errs[key]) errs[key] = issue.message;
      }
    }

    const phoneErr = validatePhone(telefono, countryCode as CountryCode);
    if (phoneErr) errs.telefono = phoneErr;

    fieldErrors = errs;

    if (Object.keys(errs).length > 0) {
      errorMsg = "Revisa los campos marcados.";
      status = "error";
      return;
    }

    const country = countries.find((c) => c.code === countryCode)!;
    const phone = parsePhoneNumberFromString(
      telefono,
      countryCode as CountryCode,
    )!;
    const data = parsedFields.data!;

    const payload = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email ?? "",
      telefono: phone.format("E.164"),
      pais: country.name,
      negocio: data.negocio,
      tipo_academia: data.tipoAcademia,
      situacion: data.situacion,
      rol: data.rol,
      origen: "n8n_form",
    };

    status = "loading";
    errorMsg = "";

    try {
      if (!PUBLIC_N8N_LEADS_WEBHOOK) {
        throw new Error("Webhook no configurado. Avisa al equipo.");
      }

      const res = await fetch(PUBLIC_N8N_LEADS_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(
          `No pudimos enviar tu información (código ${res.status}). Intenta de nuevo.`,
        );
      }

      if (
        typeof window !== "undefined" &&
        typeof (window as any).fbq === "function"
      ) {
        (window as any).fbq("track", "Lead");
      }

      status = "success";

      if (calLink) {
        setTimeout(() => {
          window.location.href = calLink;
        }, 1000);
      }
    } catch (err) {
      status = "error";
      errorMsg =
        err instanceof Error
          ? err.message
          : "No pudimos enviar tu información. Intenta de nuevo.";
    }
  }
</script>

<div class="lead-card">
  {#if status === "success"}
    <div class="success" role="status" aria-live="polite">
      <h2>¡Gracias, {nombre}!</h2>
      <p>
        Recibimos tu información. Un asesor de FlowPass te contactará muy
        pronto.
      </p>
      {#if calLink}
        <p class="muted">Te llevamos a agendar tu demo…</p>
      {/if}
    </div>
  {:else}
    <form onsubmit={handleSubmit} novalidate>
      <div class="grid">
        <div class="field">
          <label for="nombre"
            >Nombre <span class="req" aria-hidden="true">*</span></label
          >
          <input
            id="nombre"
            type="text"
            autocomplete="given-name"
            placeholder="Ej. María"
            bind:value={nombre}
            oninput={() => liveValidate("nombre")}
            onblur={() => markTouched("nombre")}
            aria-invalid={!!fieldErrors.nombre}
            aria-describedby={fieldErrors.nombre ? "err-nombre" : undefined}
            required
          />
          {#if fieldErrors.nombre}
            <span id="err-nombre" class="err">{fieldErrors.nombre}</span>
          {/if}
        </div>

        <div class="field">
          <label for="apellido"
            >Apellido <span class="req" aria-hidden="true">*</span></label
          >
          <input
            id="apellido"
            type="text"
            autocomplete="family-name"
            placeholder="Ej. Gómez"
            bind:value={apellido}
            oninput={() => liveValidate("apellido")}
            onblur={() => markTouched("apellido")}
            aria-invalid={!!fieldErrors.apellido}
            aria-describedby={fieldErrors.apellido ? "err-apellido" : undefined}
            required
          />
          {#if fieldErrors.apellido}
            <span id="err-apellido" class="err">{fieldErrors.apellido}</span>
          {/if}
        </div>

        <div class="field">
          <label for="telefono"
            >WhatsApp <span class="req" aria-hidden="true">*</span></label
          >
          <div class="phone">
            <select
              id="country"
              aria-label="Código de país"
              bind:value={countryCode}
              onchange={() => liveValidate("telefono")}
            >
              {#each countries as c}
                <option value={c.code}>{flag(c.code)} {c.dial}</option>
              {/each}
            </select>
            <input
              id="telefono"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              placeholder="999 888 777"
              bind:value={telefono}
              oninput={() => liveValidate("telefono")}
              onblur={() => markTouched("telefono")}
              aria-invalid={!!fieldErrors.telefono}
              aria-describedby={fieldErrors.telefono
                ? "err-telefono"
                : undefined}
              required
            />
          </div>
          {#if fieldErrors.telefono}
            <span id="err-telefono" class="err">{fieldErrors.telefono}</span>
          {/if}
        </div>

        <div class="field">
          <label for="email">Mail <span class="opt">(opcional)</span></label>
          <input
            id="email"
            type="email"
            autocomplete="email"
            placeholder="tu@correo.com"
            bind:value={email}
            oninput={() => liveValidate("email")}
            onblur={() => markTouched("email")}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "err-email" : undefined}
          />
          {#if fieldErrors.email}
            <span id="err-email" class="err">{fieldErrors.email}</span>
          {/if}
        </div>

        <div class="field">
          <label for="negocio">
            Nombre de tu (academia/centro/club/escuela) 
            <span
              class="req"
              aria-hidden="true">*</span
            >
          </label>
          <input
            id="negocio"
            type="text"
            autocomplete="organization"
            placeholder="Ej. Estudio Flow"
            bind:value={negocio}
            oninput={() => liveValidate("negocio")}
            onblur={() => markTouched("negocio")}
            aria-invalid={!!fieldErrors.negocio}
            aria-describedby={fieldErrors.negocio ? "err-negocio" : undefined}
            required
          />
          {#if fieldErrors.negocio}
            <span id="err-negocio" class="err">{fieldErrors.negocio}</span>
          {/if}
        </div>

        <div class="field">
          <label for="tipo"
            >Tipo de academia <span class="req" aria-hidden="true">*</span
            ></label
          >
          <select
            id="tipo"
            bind:value={tipoAcademia}
            onchange={() => markTouched("tipoAcademia")}
            onblur={() => markTouched("tipoAcademia")}
            aria-invalid={!!fieldErrors.tipoAcademia}
            aria-describedby={fieldErrors.tipoAcademia ? "err-tipo" : undefined}
            required
          >
            <option value="" disabled>Selecciona</option>
            {#each tiposAcademia as t}
              <option value={t}>{t}</option>
            {/each}
          </select>
          {#if fieldErrors.tipoAcademia}
            <span id="err-tipo" class="err">{fieldErrors.tipoAcademia}</span>
          {/if}
        </div>

        <fieldset class="field radios">
          <legend
            >¿Ya tienes tu academia? <span class="req" aria-hidden="true"
              >*</span
            ></legend
          >
          <div class="radio-group">
            {#each situaciones as opt, i}
              <label class="radio">
                <input
                  type="radio"
                  name="situacion"
                  value={opt}
                  bind:group={situacion}
                  onchange={() => markTouched("situacion")}
                  required={i === 0}
                />
                <span class="dot" aria-hidden="true"></span>
                <span>{opt}</span>
              </label>
            {/each}
          </div>
          {#if fieldErrors.situacion}
            <span class="err">{fieldErrors.situacion}</span>
          {/if}
        </fieldset>

        <fieldset class="field radios">
          <legend
            >¿Qué función cumples en la academia? <span
              class="req"
              aria-hidden="true">*</span
            ></legend
          >
          <div class="radio-group">
            {#each roles as opt, i}
              <label class="radio">
                <input
                  type="radio"
                  name="rol"
                  value={opt}
                  bind:group={rol}
                  onchange={() => markTouched("rol")}
                  required={i === 0}
                />
                <span class="dot" aria-hidden="true"></span>
                <span>{opt}</span>
              </label>
            {/each}
          </div>
          {#if fieldErrors.rol}
            <span class="err">{fieldErrors.rol}</span>
          {/if}
        </fieldset>
      </div>

      {#if status === "error" && errorMsg}
        <div class="alert" role="alert">{errorMsg}</div>
      {/if}

      <p class="legal">
        Al continuar, acepto los
        <a href="/terminos" target="_blank" rel="noopener"
          >Términos y condiciones</a
        >.
      </p>

      <button type="submit" class="cta" disabled={status === "loading"}>
        {#if status === "loading"}
          Enviando…
        {:else}
          Agenda una demo
          <span class="cta-arrow" aria-hidden="true">→</span>
        {/if}
      </button>

      <ul class="trust" aria-hidden="true">
        <li>Gratuito</li>
        <li>Sin compromiso</li>
        <li>15 min</li>
      </ul>
    </form>
  {/if}
</div>

<style>
  .lead-card {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    box-shadow:
      0 0 0 1px rgba(83, 29, 216, 0.18),
      0 18px 48px rgba(83, 29, 216, 0.28),
      0 4px 18px rgba(17, 17, 38, 0.18);
    padding: 16px;
    color: #111122;
    font-family: "Oktah Neue", system-ui, sans-serif;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 10px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  .field.full {
    grid-column: 1 / -1;
  }

  label,
  legend {
    font-size: 0.78rem;
    font-weight: 600;
    color: #14142b;
    letter-spacing: 0.005em;
  }

  legend {
    padding: 0;
    margin-bottom: 4px;
  }

  .opt {
    color: #8a8aa0;
    font-weight: 400;
    font-size: 0.68rem;
    margin-left: 2px;
  }

  input[type="text"],
  input[type="email"],
  input[type="tel"],
  select {
    width: 100%;
    height: 36px;
    padding: 0 10px;
    font-size: 16px;
    font-family: inherit;
    color: #111122;
    background: #f6f6f9;
    border: 1px solid rgba(17, 17, 38, 0.08);
    border-radius: 7px;
    outline: none;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      background 0.15s ease;
    box-sizing: border-box;
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23531DD8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 34px;
  }

  input::placeholder {
    color: #7d7d93;
  }

  /* Select sin valor (placeholder) gris como inputs */
  select:has(option[value=""]:checked) {
    color: #7d7d93;
  }

  input:focus,
  select:focus {
    border-color: #531dd8;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(83, 29, 216, 0.14);
  }

  input[aria-invalid="true"],
  select[aria-invalid="true"] {
    border-color: #e44a5b;
    background: #fff7f8;
  }

  .phone {
    display: grid;
    grid-template-columns: 96px 1fr;
    gap: 6px;
  }

  .phone select {
    padding: 0 22px 0 8px;
    background-position: right 6px center;
  }

  .radios {
    border: none;
    padding: 0;
    margin: 0;
  }

  .radio-group {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .radio {
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 30px;
    padding: 4px 9px;
    background: #f6f6f9;
    border: 1px solid rgba(17, 17, 38, 0.08);
    border-radius: 7px;
    cursor: pointer;
    font-weight: 500;
    color: #2a2a3c;
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
  }

  .radio:hover {
    background: #efeff5;
  }

  .radio:has(input:checked) {
    border-color: #531dd8;
    background: #f1edff;
    color: #1d1d2e;
  }

  .radio:has(input:focus-visible) {
    box-shadow: 0 0 0 3px rgba(83, 29, 216, 0.14);
  }

  /* Radio nativo oculto; el dot visible lo dibuja .dot */
  .radio input[type="radio"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  .radio .dot {
    width: 16px;
    height: 16px;
    border: 1.5px solid rgba(83, 29, 216, 0.4);
    border-radius: 50%;
    background: #ffffff;
    flex-shrink: 0;
    transition:
      border-color 0.15s ease,
      background 0.15s ease,
      box-shadow 0.15s ease;
  }

  .radio:hover .dot {
    border-color: #531dd8;
  }

  .radio:has(input:checked) .dot {
    border-color: #3b148f;
    background: #3b148f;
    box-shadow: inset 0 0 0 3px #ffffff;
  }

  .radio:has(input:focus-visible) .dot {
    box-shadow: 0 0 0 3px rgba(83, 29, 216, 0.25);
  }

  .radio:has(input:focus-visible:checked) .dot {
    box-shadow:
      inset 0 0 0 3px #ffffff,
      0 0 0 3px rgba(83, 29, 216, 0.25);
  }

  .radio span {
    font-size: 0.74rem;
    line-height: 1.2;
  }

  .req {
    color: #531dd8;
    margin-left: 2px;
    font-weight: 700;
  }

  .err {
    color: #c0263a;
    font-size: 0.68rem;
    line-height: 1.3;
  }

  .alert {
    margin-top: 8px;
    padding: 6px 9px;
    background: #fff0f2;
    border: 1px solid #f3b5bd;
    border-radius: 7px;
    color: #9a1f31;
    font-size: 0.74rem;
  }

  .legal {
    margin: 8px 0 6px;
    font-size: 0.66rem;
    color: #5a5a70;
    line-height: 1.4;
  }

  .legal a {
    color: #531dd8;
    text-decoration: underline;
  }

  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 42px;
    background: #01f59e;
    color: #0a0a1a;
    font-family: "Epoch", "Oktah Neue", system-ui, sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      background 0.15s ease;
  }

  .cta-arrow {
    display: inline-block;
    transition: transform 0.18s ease;
  }

  .cta:hover:not(:disabled) .cta-arrow {
    transform: translateX(3px);
  }

  .trust {
    list-style: none;
    margin: 10px 0 0;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 14px;
    color: #2a2a40;
    font-size: 0.74rem;
    font-weight: 600;
  }

  .trust li {
    position: relative;
  }

  .trust li + li::before {
    content: "·";
    position: absolute;
    left: -10px;
    color: #b8b8c8;
  }

  .cta:hover:not(:disabled) {
    background: #00dd8d;
    box-shadow: 0 6px 18px rgba(1, 245, 158, 0.3);
    transform: translateY(-1px);
  }

  .cta:focus-visible {
    outline: 3px solid #531dd8;
    outline-offset: 2px;
  }

  .cta:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .success {
    text-align: center;
    padding: 12px 4px;
  }

  .success p {
    color: #5a5a70;
    margin: 6px 0;
    font-size: 0.9rem;
  }

  .success .muted {
    color: #9a9aae;
    font-size: 0.82rem;
  }

  @media (min-width: 640px) {
    .lead-card {
      max-width: 720px;
      padding: 22px 24px;
      border-radius: 14px;
    }

    .grid {
      gap: 9px 12px;
    }

    .radio {
      min-height: 32px;
      padding: 5px 9px;
    }

    .radio span {
      font-size: 0.72rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    input,
    select,
    .radio,
    .cta {
      transition: none;
    }
  }
</style>
