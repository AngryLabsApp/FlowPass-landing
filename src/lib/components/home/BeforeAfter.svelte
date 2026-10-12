<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import BookFlip from './BookFlip.svelte';
</script>

<!-- Antes y después: el caos de Excel/chats frente al panel. Datos de la cuenta demo FlowDance. -->
<section class="wrap" aria-labelledby="ba-title">
  <div use:reveal>
    <p class="eyebrow">Antes y después de FlowPass</p>
    <h2 id="ba-title" class="sec-title">Te devolvemos el tiempo que hoy se lleva la operación.</h2>
  </div>

  <div use:reveal={60}>
    <BookFlip labels={['Antes', 'Con FlowPass']} groupLabel="Ver antes o después" class="ba-vs">
      {#snippet front()}
        <div class="side before">
          <p class="label">Antes de FlowPass</p>
          <h3>Cinco archivos, tres chats y nadie sabe quién debe.</h3>
          <div class="mess" aria-hidden="true">
            <div class="file f1"><span class="xl">X</span>alumnos_FINAL_v3.xlsx</div>
            <div class="file f2"><span class="xl">X</span>pagos octubre (2).xlsx</div>
            <div class="file f3"><span class="xl">X</span>asistencia_copia_NO TOCAR.xlsx</div>
            <div class="file f4"><span class="xl">X</span>caja_sede2.xlsx</div>
            <div class="sticky">¿Gretta pagó<br />o era Teresa?</div>
            <div class="chat c1"><b>Tú</b>Hola Piero, tu plan vence mañana 🙏</div>
            <div class="chat c2"><b>Tú</b>Hola Ángel, ¿pudiste ver lo del pago?</div>
          </div>
          <ul class="pains list-bad">
            <li>Cuadrar la caja es una tarde entera cruzando hojas.</li>
            <li>Los recordatorios salen uno por uno, cuando te acuerdas.</li>
            <li>Te enteras de que alguien dejó de venir cuando ya se fue.</li>
          </ul>
        </div>
      {/snippet}
      {#snippet back()}
        <div class="side after">
          <p class="label">Con FlowPass</p>
          <h3>Todo cuadra en minutos, y el sistema te avisa.</h3>
          <div class="board">
            <div class="tile ok-t"><span>Caja del mes</span><b>Cuadrada</b><small>Ingresos, gastos y balance al día</small></div>
            <div class="tile ok-t"><span>Recordatorios</span><b>Automáticos</b><small>Salen solos 3 días antes del vencimiento</small></div>
            <div class="tile"><span>Alumnos</span><b>25 activos</b><small>Los inactivos se marcan solos, en rojo</small></div>
            <div class="tile">
              <span>¿A quién llamo?</span>
              <div class="row"><i class="dot ok"></i>Piero V.<em>8/10 clases</em></div>
              <div class="row"><i class="dot warn"></i>Gretta T.<em>0/4 · no viene</em></div>
              <div class="row"><i class="dot ok"></i>Ángel V.<em>2/4 clases</em></div>
            </div>
          </div>
          <ul class="wins list-good">
            <li>Ves activos e inactivos sin abrir un solo Excel.</li>
            <li>Detectas quién sigue viniendo a clases y quién se está alejando.</li>
            <li>Tu tiempo vuelve a tu negocio.</li>
          </ul>
        </div>
      {/snippet}
    </BookFlip>
  </div>
</section>

<style>
  /* El contenedor lo renderiza BookFlip; en escritorio las dos páginas son sus columnas */
  :global(.ba-vs) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 48px;
    border: 1px solid var(--line);
    border-radius: 20px;
    overflow: hidden;
  }
  .side { padding: 36px; display: flex; flex-direction: column; gap: 18px; min-width: 0; }
  .before { background: var(--bg-2); }
  .after { background: var(--panel); position: relative; }
  .after::before { content: ''; position: absolute; inset: 0; background: var(--glow); opacity: 0.6; pointer-events: none; }
  .after > * { position: relative; }
  .label { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; color: var(--fg-3); }
  .after .label { color: var(--accent-text); }
  h3 { font-size: 26px; max-width: 20ch; }
  .mess { position: relative; height: 290px; margin-block: 6px; }
  .file {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    border-radius: 8px;
    background: var(--panel);
    border: 1px solid var(--line);
    font-size: 13px;
    color: var(--fg-2);
    box-shadow: 0 8px 20px -12px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    max-width: 92%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .xl { flex: none; width: 20px; height: 20px; border-radius: 4px; background: #1d6f42; color: #fff; font: 700 11px/20px var(--body); text-align: center; }
  .f1 { top: 0; left: 2%; transform: rotate(-3deg); }
  .f2 { top: 46px; left: 24%; transform: rotate(2.5deg); }
  .f3 { top: 96px; left: 4%; transform: rotate(-1.5deg); }
  .f4 { top: 146px; left: 30%; transform: rotate(3deg); }
  .sticky {
    position: absolute;
    right: 2%;
    top: 8px;
    width: 132px;
    padding: 14px;
    background: #ffe27a;
    color: #3b2f00;
    font-size: 14px;
    line-height: 1.3;
    font-weight: 600;
    transform: rotate(5deg);
    box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.5);
  }
  .chat {
    position: absolute;
    padding: 8px 12px;
    border-radius: 12px 12px 2px 12px;
    background: #d9fdd3;
    color: #0b2e13;
    font-size: 12.5px;
    max-width: 240px;
    box-shadow: 0 8px 18px -12px rgba(0, 0, 0, 0.5);
  }
  .chat b { display: block; font-size: 11px; opacity: 0.6; }
  .c1 { right: 2%; top: 196px; transform: rotate(-2deg); }
  .c2 { left: 4%; top: 236px; transform: rotate(1.5deg); }
  .pains, .wins { font-size: 15px; }
  .board { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-block: 6px; }
  .tile { background: var(--bg); border: 1px solid var(--line); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .tile > span { font-size: 12px; color: var(--fg-3); }
  .tile b { font-family: var(--display); font-size: 22px; letter-spacing: -0.01em; }
  .ok-t b { color: var(--accent-text); }
  .tile small { font-size: 12px; color: var(--fg-2); }
  .row { display: flex; align-items: center; gap: 8px; font-size: 13px; padding-block: 3px; }
  .row em { margin-left: auto; font-style: normal; font-size: 12px; color: var(--fg-3); font-variant-numeric: tabular-nums; }
  .dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
  .dot.ok { background: #01f59e; }
  .dot.warn { background: #ff8a4c; }
  @media (max-width: 900px) {
    /* En celular BookFlip apila las páginas como un libro; cada página es su propia tarjeta */
    :global(.ba-vs) { grid-template-columns: 1fr; margin-top: 12px; border: 0; border-radius: 0; overflow: visible; }
    .side { padding: 26px; border: 1px solid var(--line); border-radius: 20px; }
    .after { overflow: hidden; }

    /* El desorden "flota" mientras esperas */
    :global(.book:not(.flipped)) :is(.file, .sticky, .chat) { animation: bob 2.8s ease-in-out infinite alternate; }
    .f2, .c1 { animation-delay: -0.9s !important; }
    .f3, .sticky { animation-delay: -1.6s !important; }
    .f4, .c2 { animation-delay: -2.2s !important; }

    /* Al llegar a "Con FlowPass", todo entra en orden, uno tras otro */
    :global(.book.flipped) :is(.after .label, .after h3, .tile, .wins li) { animation: settle 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
    :global(.book.flipped) .after .label { animation-delay: 0.42s; }
    :global(.book.flipped) .after h3 { animation-delay: 0.5s; }
    :global(.book.flipped) .tile:nth-child(1) { animation-delay: 0.62s; }
    :global(.book.flipped) .tile:nth-child(2) { animation-delay: 0.7s; }
    :global(.book.flipped) .tile:nth-child(3) { animation-delay: 0.78s; }
    :global(.book.flipped) .tile:nth-child(4) { animation-delay: 0.86s; }
    :global(.book.flipped) .wins li:nth-child(1) { animation-delay: 0.98s; }
    :global(.book.flipped) .wins li:nth-child(2) { animation-delay: 1.06s; }
    :global(.book.flipped) .wins li:nth-child(3) { animation-delay: 1.14s; }
    :global(.book.flipped) .ok-t b { animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.1s both; }
  }
  @keyframes bob { to { translate: 0 -5px; } }
  @keyframes settle { from { opacity: 0; translate: 0 14px; } }
  @keyframes pop { 0% { scale: 0.85; } 100% { scale: 1; } }
  @media (prefers-reduced-motion: reduce) {
    .file, .sticky, .chat, .tile, .wins li, .after h3, .after .label, .ok-t b { animation: none !important; }
  }
  @media (max-width: 560px) {
    .side { padding: 20px 16px; gap: 14px; }
    h3 { font-size: 20px; }
    .board { gap: 8px; }
    .tile { padding: 11px; gap: 2px; border-radius: 10px; }
    .tile > span { font-size: 11px; }
    .tile b { font-size: 16px; }
    .tile small { font-size: 11px; line-height: 1.35; }
    .tile:nth-child(n + 3) { grid-column: 1 / -1; }
    .row { font-size: 12.5px; }
    .pains, .wins { font-size: 14px; gap: 8px; }
    .mess { height: 330px; }
    .c1 { top: 200px; }
    .c2 { top: 270px; }
    .sticky { width: 116px; font-size: 13px; }
    .f2, .f4 { left: 12%; }
  }
</style>
