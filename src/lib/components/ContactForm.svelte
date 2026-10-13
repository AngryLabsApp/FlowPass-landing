<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';

  /**
   * Formulario de soporte y reclamos, distinto del de agenda: nombre, correo, WhatsApp,
   * academia, país, rol (dueño / trabajador / alumno) y mensaje.
   * Lo pide dLocal Go: un canal para que cualquier persona, sobre todo un cliente que ya
   * pagó, pueda escribir un problema o reclamo.
   * Va a su propio webhook de n8n (PUBLIC_N8N_SUPPORT_WEBHOOK) y a su propia tabla
   * (`support_tickets`, ver docs/sql/support-tickets.sql): no se mezcla con los leads.
   * Se lee con $env/dynamic/public dentro del envío para que la compilación no falle
   * si la variable aún no está definida en el deploy.
   */
  let nombre = $state('');
  let email = $state('');
  let telefono = $state('');
  let mensaje = $state('');
  let academia = $state('');
  let pais = $state('');
  let rol = $state('');
  let empresa = $state(''); // honeypot: los humanos no lo ven
  let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
  let errorMsg = $state('');
  let touched = $state(false);

  const emailOk = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()));
  const PAISES = [
    { id: 'PE', label: 'Perú' },
    { id: 'MX', label: 'México' },
    { id: 'OTRO', label: 'Otro país' }
  ];
  const ROLES = ['Dueño o administrador', 'Trabajador o profesor', 'Alumno o cliente'];
  // Sin "+" se asume el país elegido (Perú por defecto); con "+" acepta cualquiera
  const phone = $derived(parsePhoneNumberFromString(telefono.trim(), (pais === 'MX' ? 'MX' : 'PE') as CountryCode));
  // Obligatorio: es el canal para devolverle la llamada
  const phoneOk = $derived(!!phone?.isValid());
  const valid = $derived(
    nombre.trim().length >= 2 && emailOk && phoneOk && academia.trim().length >= 2 && !!pais && !!rol && mensaje.trim().length >= 5
  );

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
      const webhook = env.PUBLIC_N8N_SUPPORT_WEBHOOK;
      if (!webhook) throw new Error('El formulario no está disponible. Escríbenos a soporte@flow-pass.com.');
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: phone!.format('E.164'),
          academia: academia.trim(),
          pais: PAISES.find((p) => p.id === pais)?.label ?? pais,
          rol,
          mensaje: mensaje.trim(),
          pagina: location.pathname,
          referrer: document.referrer,
          created_at: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error(`No pudimos enviar tu mensaje (código ${res.status}). Intenta de nuevo.`);
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
    <button type="button" class="link" onclick={() => ((status = 'idle'), (nombre = email = telefono = mensaje = academia = pais = rol = ''), (touched = false))}>Enviar otro mensaje</button>
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
      <span>WhatsApp <i aria-hidden="true">*</i></span>
      <input name="telefono" type="tel" autocomplete="tel" inputmode="tel" required bind:value={telefono} aria-invalid={touched && !phoneOk} placeholder="+51 999 888 777" />
    </label>
    <label>
      <span>Nombre de la academia o negocio <i aria-hidden="true">*</i></span>
      <input name="academia" autocomplete="organization" required bind:value={academia} aria-invalid={touched && academia.trim().length < 2} placeholder="Ej. Academia Ritmo" />
    </label>
    <div class="row">
      <label>
        <span>País <i aria-hidden="true">*</i></span>
        <select name="pais" required bind:value={pais} aria-invalid={touched && !pais}>
          <option value="" disabled>Elige</option>
          {#each PAISES as p (p.id)}<option value={p.id}>{p.label}</option>{/each}
        </select>
      </label>
      <label>
        <span>Tú eres <i aria-hidden="true">*</i></span>
        <select name="rol" required bind:value={rol} aria-invalid={touched && !rol}>
          <option value="" disabled>Elige</option>
          {#each ROLES as r (r)}<option value={r}>{r}</option>{/each}
        </select>
      </label>
    </div>
    <label>
      <span>Mensaje <i aria-hidden="true">*</i></span>
      <textarea name="mensaje" rows="5" required bind:value={mensaje} aria-invalid={touched && mensaje.trim().length < 5} placeholder="Cuéntanos qué pasó o en qué te podemos ayudar"></textarea>
    </label>
    <!-- Honeypot anti-spam -->
    <label class="hp" aria-hidden="true">Empresa <input tabindex="-1" autocomplete="off" bind:value={empresa} /></label>

    {#if touched && !valid}<p class="err" role="alert">Completa todos los campos. Si tu WhatsApp no es de Perú ni México, escríbelo con su código (ej. +57).</p>{/if}
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
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 480px) {
    .row { grid-template-columns: 1fr; }
  }
  input,
  select,
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
  select:focus,
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
