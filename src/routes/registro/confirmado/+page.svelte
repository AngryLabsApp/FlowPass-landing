<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { getSupabase, signupRedirectUrl } from "$lib/supabase";

  // Destino PROVISIONAL del enlace del correo (fase 1). Cuando llega aquí, Supabase ya
  // confirmó el correo en su servidor. La URL trae tokens en el #hash (flujo implícito)
  // que la landing NO usa: se borran sin guardarlos. En la fase 2 el enlace va al SaaS.

  let view = $state<"checking" | "ok" | "expired">("checking");
  let email = $state("");
  let resendIn = $state(0);
  let resendMsg = $state("");
  let timer: ReturnType<typeof setInterval> | undefined;

  onMount(() => {
    const hash = new URLSearchParams(location.hash.slice(1));
    const query = new URLSearchParams(location.search);
    const errorCode = hash.get("error_code") || query.get("error_code") || hash.get("error") || query.get("error");
    // Limpiar la URL: no dejar tokens visibles ni en el historial.
    history.replaceState(null, "", location.pathname);
    view = errorCode ? "expired" : "ok";
  });
  onDestroy(() => clearInterval(timer));

  async function resend(e: Event) {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase || resendIn > 0 || !email.trim()) return;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: signupRedirectUrl() },
    });
    resendMsg = error ? "No pudimos reenviar el correo. Inténtalo en un momento." : "Si el correo es válido, te enviamos un nuevo enlace.";
    resendIn = 60;
    clearInterval(timer);
    timer = setInterval(() => {
      resendIn -= 1;
      if (resendIn <= 0) clearInterval(timer);
    }, 1000);
  }
</script>

<svelte:head>
  <title>Cuenta confirmada | FlowPass</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="confirm-page">
  <section class="card">
    {#if view === "checking"}
      <p class="muted">Confirmando…</p>
    {:else if view === "ok"}
      <span class="icon ok" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7" /></svg>
      </span>
      <h1>¡Cuenta confirmada!</h1>
      <!-- Texto provisional de la fase 1 (decidir el definitivo). -->
      <p>Tu correo quedó verificado. Muy pronto podrás crear tu academia en FlowPass; te avisaremos por correo.</p>
      <a class="btn-green" href="/agenda">¿Quieres empezar ya? Agenda 15 minutos</a>
    {:else}
      <span class="icon warn" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
      </span>
      <h1>El enlace venció</h1>
      <p>El enlace de confirmación ya no es válido (vence en 24 horas y sirve una sola vez). Pide uno nuevo:</p>
      <form onsubmit={resend}>
        <label class="field">
          <span>Correo electrónico</span>
          <input type="email" autocomplete="email" bind:value={email} required />
        </label>
        <button type="submit" class="btn-green" disabled={resendIn > 0}>
          {resendIn > 0 ? `Reenviar enlace (${resendIn} s)` : "Reenviar enlace"}
        </button>
        {#if resendMsg}<p class="muted" role="status">{resendMsg}</p>{/if}
      </form>
      <p class="muted">¿Ya confirmaste antes? Tu cuenta está lista.</p>
    {/if}
  </section>
</div>

<style>
  .confirm-page { min-height: 100vh; padding: 140px 20px 48px; display: flex; justify-content: center; color: #f5f5f5; }
  .card {
    width: 100%;
    max-width: 540px;
    height: fit-content;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 44px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }
  h1 { margin: 0; font-size: 32px; color: #fff; }
  p { margin: 0; color: #a1a1aa; line-height: 1.6; }
  .muted { font-size: 14px; color: #a1a1aa; }
  .icon { width: 72px; height: 72px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; }
  .ok { background: rgba(1, 245, 158, 0.12); border: 1px solid rgba(1, 245, 158, 0.4); color: #01f59e; }
  .warn { background: rgba(251, 191, 36, 0.12); border: 1px solid rgba(251, 191, 36, 0.4); color: #fbbf24; }
  form { width: 100%; display: flex; flex-direction: column; gap: 12px; text-align: left; }
  .field { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: #d4d4d8; }
  input { font: inherit; color: #f5f5f5; background: #0e0e14; padding: 12px 14px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; }
  input:focus-visible { outline: 2px solid #01f59e; outline-offset: 1px; }
  .btn-green { display: inline-flex; justify-content: center; align-items: center; padding: 14px 22px; border-radius: 999px; border: 0; font: inherit; font-weight: 600; font-size: 15px; background: #01f59e; color: #04150e; text-decoration: none; cursor: pointer; }
  .btn-green:disabled { opacity: 0.6; cursor: default; }
  @media (max-width: 560px) { .confirm-page { padding-top: 112px; } .card { padding: 32px 22px; } h1 { font-size: 26px; } }
</style>
