<script lang="ts">
  import { onMount } from 'svelte';
  import { reveal } from '$lib/actions/reveal';
  import ranking from '$lib/assets/images/home/ranking.webp';
  import checkin from '$lib/assets/images/home/checkin.webp';
  import alumnos from '$lib/assets/images/home/alumnos.webp';
  import membresias from '$lib/assets/images/home/membresias.webp';
  import analitica from '$lib/assets/images/home/analitica.webp';
  import flowy from '$lib/assets/images/home/flowy.webp';

  // Capturas reales de la cuenta demo FlowDance (datos ficticios).
  // Orden: de lo más importante para el negocio a lo menos.
  const tabs = [
    {
      id: 'alumnos', name: 'Alumnos', title: 'Alumnos',
      text: 'Cada alumno con su plan, sus clases y su estado de pago.',
      points: ['Renovaciones y cumpleaños a un clic', 'Varios planes por alumno', 'Filtros por estado y plan'],
      url: 'app.flow-pass.com/alumnos', img: alumnos, w: 1440, h: 723,
      alt: 'Lista de alumnos con plan, clases realizadas, fin de plan, precio, estado y estado de pago'
    },
    {
      id: 'membresias', name: 'Membresías', title: 'Membresías',
      text: 'Quién vence hoy, esta semana o ya venció. De un vistazo.',
      points: ['Vigentes, históricas o todas', 'Colores según días para vencer', 'Precio y pago de cada una'],
      url: 'app.flow-pass.com/membresias', img: membresias, w: 1440, h: 723,
      alt: 'Tabla de membresías con plan, fechas, precio y estado'
    },
    {
      id: 'checkin', name: 'Check-in', title: 'Check-in en la entrada',
      text: 'Llega, marca con código o QR, y la clase se descuenta sola.',
      points: ['Código de 4 dígitos o QR', 'Clases del día y grupos restringidos', 'También desde el portal del alumno'],
      url: 'app.flow-pass.com/asistencias', img: checkin, w: 1483, h: 812,
      alt: 'Pantalla de check-in con teclado para ingresar el código de acceso del alumno'
    },
    {
      id: 'asistencia', name: 'Asistencia', title: 'Asistencia de cada alumno',
      text: 'Quién viene, quién falta y a quién llamar antes de que se vaya.',
      points: ['En riesgo, irregular o viniendo', 'Días sin venir y última asistencia', '"¿A quién premio?" a los más constantes'],
      url: 'app.flow-pass.com/asistencias/ranking', img: ranking, w: 1483, h: 812,
      alt: 'Ranking de asistencia por alumno: 14 en riesgo, 8 irregulares, días sin venir y uso del plan de cada alumno'
    },
    {
      id: 'analitica', name: 'Analítica', title: 'Analítica',
      text: 'Activos, planes y ventas del mes. Sin armar nada a mano.',
      points: ['Ventas por mes: planes y productos', 'Distribución de alumnos por plan', 'Ranking de asistencia'],
      url: 'app.flow-pass.com/analytics', img: analitica, w: 1440, h: 723,
      alt: 'Panel de analítica con alumnos activos, distribución por plan y ventas por mes'
    },
    {
      id: 'flowy', name: 'Flowy IA', title: 'Flowy, tu asistente de IA',
      text: 'Pregúntale "¿cuánto cobré hoy?" y te responde con tus datos.',
      points: ['Consulta pagos, alumnos y gastos', 'Te guía dentro de la plataforma', 'Créditos de IA incluidos'],
      url: 'app.flow-pass.com/agentes', img: flowy, w: 1440, h: 723,
      alt: 'Pantalla de Flowy, el asistente de IA de FlowPass, con un ejemplo de conversación'
    }
  ];

  let active = $state(0);
  let zoomDlg = $state<HTMLDialogElement>();
  const t = $derived(tabs[active]);

  // Cambio automático entre pestañas: avanza cuando termina la barra de progreso.
  // Se pausa fuera de pantalla o con la captura ampliada,
  // y se apaga en cuanto el visitante elige una pestaña.
  let auto = $state(true);
  let inView = $state(false);
  let zoomed = $state(false);
  let sectionEl = $state<HTMLElement>();
  let tabsEl = $state<HTMLElement>();
  const paused = $derived(!inView || zoomed);

  const openZoom = () => {
    zoomed = true;
    zoomDlg?.showModal();
  };
  const pick = (i: number) => {
    auto = false;
    active = i;
  };
  const next = () => (active = (active + 1) % tabs.length);

  onMount(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) auto = false;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting), { rootMargin: '-25% 0px' });
    if (sectionEl) io.observe(sectionEl);
    return () => io.disconnect();
  });

  // En celular la fila de pestañas se desliza para que la activa siempre se vea.
  $effect(() => {
    const btn = tabsEl?.querySelector<HTMLElement>(`#tab-${tabs[active].id}`);
    if (tabsEl && btn && tabsEl.scrollWidth > tabsEl.clientWidth) {
      tabsEl.scrollTo({ left: btn.offsetLeft - 14, behavior: 'smooth' });
    }
  });

  function onKey(e: KeyboardEvent) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    auto = false;
    active = (active + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    (document.getElementById(`tab-${tabs[active].id}`) as HTMLElement | null)?.focus();
  }
</script>

<section id="features" class="wrap" aria-labelledby="pf-title" bind:this={sectionEl}>
  <div class="head" use:reveal>
    <div>
      <p class="eyebrow">La plataforma</p>
      <h2 id="pf-title" class="sec-title">Todo lo que necesitas en tu operación diaria.</h2>
    </div>
    <p class="lead">Asistencia, alumnos, cobros y reportes. En un solo lugar.</p>
  </div>

  <div class="tabs" role="tablist" aria-label="Funciones" tabindex="-1" onkeydown={onKey} bind:this={tabsEl}>
    {#each tabs as tab, i (tab.id)}
      <button
        role="tab"
        id={`tab-${tab.id}`}
        aria-controls="pf-panel"
        aria-selected={i === active}
        tabindex={i === active ? 0 : -1}
        onclick={() => pick(i)}
        >{tab.name}{#if auto && i === active}<span class="progress" class:paused onanimationend={next}></span>{/if}</button>
    {/each}
  </div>

  {#key t.id}
  <div class="panel" id="pf-panel" role="tabpanel" tabindex="0" aria-labelledby={`tab-${t.id}`}>
    <div>
      <h3>{t.title}</h3>
      <p class="text">{t.text}</p>
      <ul>
        {#each t.points as p (p)}
          <li>{p}</li>
        {/each}
      </ul>
    </div>
    <figure>
      <div class="shot">
        <div class="shot-bar"><i></i><i></i><i></i><em>{t.url}</em></div>
        <button type="button" class="zoom" onclick={openZoom} aria-label="Ampliar captura">
          <img src={t.img} width={t.w} height={t.h} alt={t.alt} loading="lazy" />
          <span class="zoom-ic" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M11 8v6M8 11h6" /></svg></span>
        </button>
      </div>
    </figure>
  </div>
  {/key}

  <!-- Celular: la captura en grande, se desliza de lado -->
  <dialog class="lightbox" bind:this={zoomDlg} onclose={() => (zoomed = false)} onclick={(e) => (e.target === zoomDlg || (e.target as HTMLElement).closest('.lb-close')) && zoomDlg?.close()}>
    <button type="button" class="lb-close" aria-label="Cerrar">✕</button>
    <div class="lb-scroll"><img src={t.img} width={t.w} height={t.h} alt={t.alt} /></div>
    <p class="swipe">Desliza para ver toda la pantalla</p>
  </dialog>
</section>

<style>
  .head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 24px; }
  .head .sec-title { max-width: 16ch; }
  .head .lead { max-width: 36ch; }
  .tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 36px; border-bottom: 1px solid var(--line); }
  .tabs button {
    appearance: none;
    background: none;
    border: 0;
    border-bottom: 2px solid transparent;
    color: var(--fg-2);
    font: 600 15px var(--body);
    padding: 12px 14px;
    margin-bottom: -1px;
    cursor: pointer;
  }
  .tabs button { position: relative; }
  .tabs button[aria-selected='true'] { color: var(--fg); border-color: var(--accent); }
  /* Mientras corre el automático, la línea de la pestaña activa se llena */
  .tabs button[aria-selected='true']:has(.progress) { border-color: transparent; }
  .progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    border-radius: 3px;
    width: 100%;
    background: var(--accent);
    transform-origin: left;
    animation: fill 5s linear forwards;
  }
  .progress.paused { animation-play-state: paused; }
  @keyframes fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  .panel { animation: swap 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
  @keyframes swap { from { opacity: 0; transform: translateY(10px); } }
  @media (prefers-reduced-motion: reduce) {
    .panel { animation: none; }
  }
  .panel { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 44px; align-items: start; margin-top: 36px; }
  h3 { font-size: 28px; }
  .text { color: var(--fg-2); margin-top: 14px; font-size: 17px; }
  ul { list-style: none; padding: 0; margin: 22px 0 0; display: grid; gap: 10px; }
  li { display: flex; gap: 10px; font-size: 15px; }
  li::before { content: '✓'; flex: none; color: var(--accent-text); font-weight: 700; }
  figure { margin: 0; }
  @media (max-width: 900px) {
    .panel { grid-template-columns: 1fr; gap: 28px; }
    .tabs { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
    .tabs button { white-space: nowrap; }
  }
  .swipe { display: none; }
  .zoom { all: unset; position: relative; display: block; width: 100%; cursor: zoom-in; }
  .zoom-ic {
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(9, 9, 15, 0.78);
    color: #fff;
  }
  /* Misma proporción en todas las pestañas: al cambiar no salta el contenido de abajo */
  .zoom img { display: block; width: 100%; height: auto; aspect-ratio: 1440 / 723; object-fit: cover; object-position: left top; }
  .lightbox {
    width: 100vw;
    max-width: none;
    height: 100dvh;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: #09090f;
    color: #fff;
  }
  .lightbox::backdrop { background: rgba(9, 9, 15, 0.9); }
  .lightbox[open] { display: flex; flex-direction: column; justify-content: center; gap: 14px; }
  .lb-scroll { overflow-x: auto; padding-inline: 12px; }
  .lb-scroll img { display: block; width: min(1480px, 100%); max-width: none; height: auto; margin-inline: auto; border-radius: 8px; }
  .lightbox p { text-align: center; font-size: 13px; color: rgba(255, 255, 255, 0.7); }
  .lb-close {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    font-size: 16px;
  }
  /* Celular: captura primero y a tamaño legible (se desliza de lado). */
  @media (max-width: 560px) {
    .tabs {
      margin-inline: -20px;
      padding-inline: 14px;
      -webkit-mask-image: linear-gradient(90deg, #000 85%, transparent);
      mask-image: linear-gradient(90deg, #000 85%, transparent);
    }
    .tabs button { padding: 12px 10px; font-size: 14px; }
    .head { gap: 10px; }
    .tabs { margin-top: 18px; }
    .panel { margin-top: 16px; gap: 16px; }
    figure { order: -1; }
    .lb-scroll img { width: 900px; }
    .lightbox p.swipe { display: block; }
    h3 { font-size: 19px; }
    .text { font-size: 14.5px; margin-top: 8px; }
    ul { margin-top: 12px; gap: 7px; }
    li { font-size: 13.5px; }
  }
</style>
