<script lang="ts">
  import { PUBLIC_N8N_LEADS_WEBHOOK } from '$env/static/public';
  import { trackLead } from '$lib/tracking/track';

  /**
   * Formulario de contacto general (nombre, correo, mensaje).
   * Usa el mismo webhook de n8n que el formulario de agenda, con `origen: "contact_form"`
   * y los mismos campos por defecto, para que el CRM lo guarde como un lead más.
   */
  let nombre = $state('');
  let email = $state('');
  let telefono = $state('');
  let mensaje = $state('');
  let empresa = $state(''); // honeypot: los humanos no lo ven
  let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let errorMsg = $state('');
  let touched = $state(false);

  const emailOk = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()));
  const valid = $derived(nombre.trim().length >= 2 && emailOk && mensaje.trim().length >= 5);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    touched = true;
    if (!valid || status === 'loading') return;
    if (empresa) {
      // Bot: fingimos éxito y no enviamos nada
      status = 'success';
      return;
    }
    status = 'loading';
    errorMsg = '';
    try {
      if (!PUBLIC_N8N_LEADS_WEBHOOK) throw new Error('El formulario no está configurado. Escríbenos a contacto@flow-pass.com.');
      const [first, ...rest] = nombre.trim().split(/\s+/);
      const res = await fetch(PUBLIC_N8N_LEADS_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: first,
          apellido: rest.join(' '),
          email: email.trim(),
          telefono: telefono.trim(),
          mensaje: mensaje.trim(),
          negocio: 'No especificado',
          pais: 'No especificado',
          rol: 'No especificado',
          fuente: 'Formulario de contacto',
          origen: 'contact_form',
          created_at: new Date().toISOString(),
          referrer: document.referrer
        })
      });
      if (!res.ok) throw new Error(`No pudimos enviar tu mensaje (código ${res.status}). Intenta de nuevo.`);
      trackLead('contact_form', { fuente: 'Formulario de contacto' });
      status = 'success';
    } catch (err) {
      status = 'error';
      errorMsg = err instanceof Error ? err.message : 'No pudimos enviar tu mensaje. Intenta de nuevo.';
    }
  }
</script>

{#if status === 'success'}
  <div class="done" role="status">
    <b>¡Mensaje enviado!</b>
    <p>Te respondemos en menos de 24 horas hábiles, por correo o WhatsApp.</p>
    <button type="button" class="link" onclick={() => ((status = 'idle'), (nombre = email = telefono = mensaje = ''), (touched = false))}>Enviar otro mensaje</button>
  </div>
{:else}
  <form class="cf" onsubmit={submit} novalidate>
    <label>
      <span>Nombre <i aria-hidden="true">*</i></span>
      <input name="nombre" autocomplete="name" required bind:value={nombre} aria-invalid={touched && nombre.trim().length < 2} placeholder="Tu nombre" />
    </label>
    <label>
      <span>Correo electrónico <i aria-hidden="true">*</i></span>
      <input name="email" type="email" autocomplete="email" inputmode="email" required bind:value={email} aria-invalid={touched && !emailOk} placeholder="tu@correo.com" />
    </label>
    <label>
      <span>WhatsApp <small>(opcional)</small></span>
      <input name="telefono" type="tel" autocomplete="tel" inputmode="tel" bind:value={telefono} placeholder="+51 999 888 777" />
    </label>
    <label>
      <span>Mensaje <i aria-hidden="true">*</i></span>
      <textarea name="mensaje" rows="5" required bind:value={mensaje} aria-invalid={touched && mensaje.trim().length < 5} placeholder="Cuéntanos en qué te podemos ayudar"></textarea>
    </label>
    <!-- Honeypot anti-spam -->
    <label class="hp" aria-hidden="true">Empresa <input tabindex="-1" autocomplete="off" bind:value={empresa} /></label>

    {#if touched && !valid}<p class="err" role="alert">Completa tu nombre, un correo válido y tu mensaje.</p>{/if}
    {#if status === 'error'}<p class="err" role="alert">{errorMsg}</p>{/if}

    <button type="submit" class="btn send" disabled={status === 'loading'}>
      {status === 'loading' ? 'Enviando…' : 'Enviar mensaje'}
    </button>
  </form>
{/if}

<style>
  .cf { display: grid; gap: 14px; }
  label { display: grid; gap: 6px; font-size: 14px; font-weight: 600; color: var(--fg); }
  label i { color: #531dd8; font-style: normal; }
  label small { font-weight: 400; color: var(--fg-3); }
  input,
  textarea {
    width: 100%;
    font: 400 15px var(--body);
    color: var(--fg);
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 12px 14px;
    resize: vertical;
  }
  input:focus,
  textarea:focus { outline: 2px solid #531dd8; outline-offset: 1px; border-color: transparent; }
  [aria-invalid='true'] { border-color: #e5484d; }
  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
  .err { color: #d93a3a; font-size: 13.5px; }
  .send { justify-content: center; background: #01f59e; color: #04150e; border-radius: 999px; margin-top: 4px; }
  .send:disabled { opacity: 0.6; cursor: wait; }
  .done { display: grid; gap: 8px; padding: 22px; border-radius: 16px; background: color-mix(in srgb, #01f59e 14%, var(--panel)); }
  .done b { font-size: 18px; }
  .done p { color: var(--fg-2); }
  .link { justify-self: start; background: none; border: 0; padding: 0; color: var(--accent-text); font: 600 14px var(--body); text-decoration: underline; cursor: pointer; }
</style>
