<script lang="ts">
  import { reveal } from '$lib/actions/reveal';

  // Solo afirmaciones que ya son ciertas en la plataforma. No agregar respaldos,
  // certificaciones ni porcentajes sin confirmarlos con el equipo técnico.
  const items = [
    { t: 'Solo tú ves tus datos', d: 'Cada negocio tiene su espacio separado. Nadie más accede a tus alumnos ni a tus pagos.' },
    { t: 'Tú decides quién entra', d: 'Cada persona de tu equipo tiene su propio usuario, y lo quitas cuando quieras.' },
    { t: 'Conexión cifrada', d: 'Todo viaja por HTTPS, desde el panel y desde el portal de tus alumnos.' },
    { t: 'Ley de datos personales', d: 'Tratamos los datos según la Ley 29733 de Perú. Lo detallamos en nuestra política de privacidad.' }
  ];
</script>

<section class="wrap sec" aria-labelledby="sec-title">
  <div class="head" use:reveal>
    <p class="eyebrow">Seguridad</p>
    <h2 id="sec-title" class="sec-title">Tus datos y los de tus alumnos, protegidos.</h2>
  </div>
  <ul class="grid" use:reveal={60}>
    {#each items as it (it.t)}
      <li>
        <span class="ic" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
        </span>
        <b>{it.t}</b>
        <p>{it.d}</p>
      </li>
    {/each}
  </ul>
  <a class="more" href="/privacidad">Lee nuestra política de privacidad →</a>
</section>

<style>
  .head { max-width: 720px; }
  .grid { list-style: none; padding: 0; margin: 28px 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
  li { padding: 20px; border: 1px solid var(--line); border-radius: 18px; background: var(--panel); display: grid; gap: 6px; align-content: start; }
  .ic { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; color: #531dd8; background: color-mix(in srgb, #531dd8 12%, var(--panel)); margin-bottom: 6px; }
  b { font-size: 16px; }
  li p { color: var(--fg-2); font-size: 14px; }
  .more { display: inline-block; margin-top: 18px; font-size: 14.5px; font-weight: 600; color: var(--accent-text); text-decoration: none; }
  .more:hover { text-decoration: underline; }
  @media (max-width: 900px) {
    .grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 560px) {
    .grid { grid-template-columns: 1fr; gap: 10px; margin-top: 20px; }
    li { padding: 16px; grid-template-columns: auto 1fr; column-gap: 12px; }
    .ic { grid-row: span 2; margin: 0; }
    b { font-size: 15px; }
    li p { font-size: 13.5px; }
  }
</style>
