<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import { trackAgendaClick } from '$lib/tracking/track';

  // Cómo empezar: 3 pasos cortos, justo antes de precios.
  const steps = [
    { n: '1', title: 'Habla con un asesor', text: 'Una llamada de 15 minutos para ver tu negocio en FlowPass.' },
    { n: '2', title: 'Elige tu plan', text: 'Según cuántos alumnos activos tienes. Sin permanencia.' },
    { n: '3', title: 'Empieza en 15 minutos', text: 'Te dejamos la plataforma 100% lista para usar.' }
  ];
</script>

<section class="wrap steps" aria-labelledby="steps-title">
  <div class="head" use:reveal>
    <p class="eyebrow">Cómo empezar</p>
    <h2 id="steps-title" class="sec-title">Empieza en 3 pasos.</h2>
  </div>

  <ol class="list" use:reveal={60}>
    {#each steps as s, i (s.n)}
      <li style={`--i:${i}`}>
        <span class="num" aria-hidden="true">{s.n}</span>
        <h3>{s.title}</h3>
        <p>{s.text}</p>
      </li>
    {/each}
  </ol>

  <div class="cta" use:reveal={120}>
    <a class="btn pill-green" href="/agenda" onclick={() => trackAgendaClick('steps_section')}>
      Empezar con el paso 1
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </a>
  </div>
</section>

<style>
  .head { text-align: center; }
  .list {
    list-style: none;
    padding: 0;
    margin: 36px 0 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    counter-reset: none;
  }
  li {
    position: relative;
    padding: 26px 24px;
    border: 1px solid var(--line);
    border-radius: 20px;
    background: var(--panel);
  }
  /* Línea que une los pasos: se lee como un recorrido rápido */
  li:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 46px;
    right: -17px;
    width: 18px;
    height: 2px;
    background: linear-gradient(90deg, #531dd8, #01f59e);
  }
  .num {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font: 700 17px var(--display);
    color: #fff;
    background: linear-gradient(135deg, #531dd8, #3b14a8);
    box-shadow: 0 8px 18px -8px rgba(83, 29, 216, 0.7);
  }
  li:last-child .num { background: linear-gradient(135deg, #01f59e, #00c27e); color: #04150e; box-shadow: 0 8px 18px -8px rgba(1, 245, 158, 0.8); }
  h3 { font-size: 19px; margin-top: 16px !important; }
  li p { margin-top: 6px !important; font-size: 14.5px; color: var(--fg-2); }
  .cta { display: flex; justify-content: center; margin-top: 26px; }
  .cta .btn { border-radius: 999px; }

  @media (max-width: 760px) {
    .list { grid-template-columns: 1fr; gap: 10px; margin-top: 24px; }
    li { display: grid; grid-template-columns: auto 1fr; column-gap: 14px; padding: 16px 18px; align-items: center; }
    .num { grid-row: span 2; width: 36px; height: 36px; font-size: 15px; }
    h3 { margin-top: 0 !important; font-size: 16px; }
    li p { margin-top: 2px !important; font-size: 13.5px; }
    li:not(:last-child)::after { top: auto; bottom: -11px; right: auto; left: 35px; width: 2px; height: 12px; background: linear-gradient(#531dd8, #01f59e); }
    .cta .btn { width: 100%; justify-content: center; }
  }
</style>
