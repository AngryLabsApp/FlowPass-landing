<script lang="ts">
  import { onMount } from 'svelte';
  import closePhoto from '$lib/assets/images/home/cierre.webp';
  import { trackContact, trackSchedule } from '$lib/tracking/track';
  import { waCountry } from '$lib/stores/waCountry.svelte';

  const waMsg = '?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20negocio.';
  onMount(() => waCountry.init());
</script>

<!-- Cierre: la misma persona, ahora termina temprano. -->
<section id="contacto" class="close" aria-labelledby="close-title">
  <div class="card" style={`--photo:url(${closePhoto})`}>
    <div class="media" role="img" aria-label="Una mano toma el celular y las llaves junto a la laptop abierta, al atardecer"></div>
    <div class="copy">
      <h2 id="close-title">FlowPass resuelve tu operación. <span>Y tú recuperas tu tiempo.</span></h2>
      <p class="sub">Mira tu negocio en FlowPass en una llamada de 20 minutos, con tus planes y tus precios reales.</p>
      <div class="ctas">
        <a class="btn pill-green" href="/agenda" onclick={() => trackSchedule('closing_section')}>
          Agenda 20 minutos
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
        <a
          class="btn pill-white"
          href={`${waCountry.phone.whatsapp}${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          onclick={() => trackContact('closing_section')}>Escríbenos por WhatsApp</a>
      </div>
    </div>
  </div>
</section>

<style>
  .close { padding-block: var(--section-y) calc(var(--section-y) * 1.4); }
  .card {
    position: relative;
    max-width: 1280px;
    margin-inline: auto;
    border-radius: 24px;
    overflow: hidden;
    min-height: clamp(480px, 70vh, 680px);
    display: flex;
    align-items: flex-end;
    isolation: isolate;
    background: #09090f;
  }
  .media {
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      radial-gradient(50% 70% at 40% 30%, rgba(83, 29, 216, 0.8), transparent 75%),
      linear-gradient(rgba(83, 29, 216, 0.5), rgba(83, 29, 216, 0.5)),
      var(--photo) 70% center / cover no-repeat;
    background-blend-mode: soft-light, soft-light, normal;
  }
  .card::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(180deg, rgba(9, 9, 15, 0.05) 30%, rgba(9, 9, 15, 0.82) 100%),
      linear-gradient(90deg, rgba(9, 9, 15, 0.6), transparent 65%),
      linear-gradient(rgba(83, 29, 216, 0.18), rgba(83, 29, 216, 0.18));
  }
  .copy { padding: clamp(24px, 4vw, 48px); max-width: 760px; color: #fff; }
  h2 { font-size: clamp(28px, 5vw, 68px); color: #fff; max-width: 15ch; }
  h2 span { display: block; color: #01f59e; }
  .sub { margin-top: 18px; font-size: 18px; max-width: 46ch; color: rgba(255, 255, 255, 0.86); }
  .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
  @media (max-width: 560px) {
    .card { display: block; min-height: 0; border-radius: 18px; }
    .media {
      position: relative;
      height: 240px;
      background-position: 0 0, 0 0, 75% center;
      -webkit-mask-image: linear-gradient(#000 55%, transparent);
      mask-image: linear-gradient(#000 55%, transparent);
    }
    .card::after { display: none; }
    .copy { padding: 0 22px 26px; margin-top: -30px; position: relative; }
    h2 { font-size: clamp(26px, 7.8vw, 34px); }
    .sub { font-size: 15.5px; }
    .ctas { gap: 8px; }
    .ctas .btn { flex: 1 1 100%; justify-content: center; padding: 11px 16px; font-size: 14px; line-height: 1.2; }
    .ctas .btn svg { width: 15px; height: 15px; }
  }
</style>
