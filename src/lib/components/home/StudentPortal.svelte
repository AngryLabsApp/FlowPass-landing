<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import portalInicio from '$lib/assets/images/home/portal-inicio.webp';
  import portalPase from '$lib/assets/images/home/portal-pase.webp';
</script>

<!-- Portal del alumno (nuevo). Capturas reales del portal de FlowDance. -->
<section class="portal" aria-labelledby="portal-title">
  <div class="wrap grid">
    <div use:reveal>
      <span class="new">NUEVO</span>
      <h2 id="portal-title" class="sec-title">Un portal para tus clientes.</h2>
      <p class="lead">Con tu marca, y lo compartes con un solo clic.</p>
      <dl>
        <div><dt>Marca su asistencia</dt><dd>Un toque al llegar a clase y queda registrada.</dd></div>
        <div><dt>Ve su plan</dt><dd>Clases usadas, fecha de fin y estado, sin preguntarte.</dd></div>
        <div><dt>Su pase de acceso</dt><dd>Con su foto, su código y un QR que escanea en recepción.</dd></div>
        <div><dt>Con tu marca</dt><dd>Tu negocio al frente. FlowPass queda atrás.</dd></div>
      </dl>
    </div>
    <div class="phones" use:reveal={60}>
      <div class="phone"><img src={portalInicio} width="710" height="1538" loading="lazy" alt="Portal del alumno: tarjeta del alumno, pase de acceso y botón para marcar asistencia" /></div>
      <div class="phone"><img src={portalPase} width="710" height="1538" loading="lazy" alt="Pase de acceso del alumno con su foto, código y QR para registrar asistencia" /></div>
    </div>
  </div>
</section>

<style>
  .portal { background: var(--bg-2); margin-inline: -20px; padding-inline: 20px; border-block: 1px solid var(--line); }
  .grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 56px; align-items: center; }
  .new {
    display: inline-block;
    margin-bottom: 4px;
    background: #531dd8;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 4px 10px;
    border-radius: 999px;
  }
  .lead { margin-top: 18px; }
  dl { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 28px; margin: 34px 0 0; }
  dt { font-weight: 700; font-size: 15px; }
  dd { margin: 4px 0 0; color: var(--fg-2); font-size: 14px; }
  .phones { display: flex; justify-content: center; gap: 22px; padding-bottom: 40px; }
  /* Marco de celular fino, con isla arriba. La captura se muestra completa. */
  .phone {
    position: relative;
    width: min(230px, 44%);
    border-radius: 40px;
    padding: 6px;
    background: #111117;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06) inset, 0 30px 60px -28px rgba(9, 9, 15, 0.55);
  }
  .phone::before {
    content: '';
    position: absolute;
    top: 13px;
    left: 50%;
    width: 28%;
    height: 14px;
    border-radius: 999px;
    background: #111117;
    transform: translateX(-50%);
    z-index: 1;
  }
  .phone img { display: block; width: 100%; height: auto; border-radius: 34px; }
  .phone:nth-child(2) { transform: translateY(40px); }
  @media (max-width: 900px) {
    .grid { grid-template-columns: 1fr; gap: 36px; }
  }
  @media (max-width: 560px) {
    .grid { gap: 28px; }
    .phone { border-radius: 30px; padding: 4px; }
    .phone img { border-radius: 26px; }
    .phone::before { top: 9px; height: 9px; }
    .lead { margin-top: 10px; }
    dl { gap: 14px 16px; margin-top: 20px; }
    dt { font-size: 13.5px; }
    dd { font-size: 12.5px; line-height: 1.4; }
    .phone:nth-child(2) { transform: translateY(24px); }
  }
</style>
