<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import { faqMainEntity } from '$lib/seo/faqSchema';

  // Se renderiza desde el mismo listado que el JSON-LD FAQPage: lo que lee
  // Google y lo que ve la persona nunca se desincronizan.
</script>

<section id="faq" class="wrap faq" aria-labelledby="faq-title">
  <div use:reveal>
    <p class="eyebrow">Preguntas</p>
    <h2 id="faq-title" class="sec-title">Lo que nos preguntan antes de empezar.</h2>
  </div>
  <div>
    {#each faqMainEntity as item, i (item.name)}
      <details open={i === 0}>
        <summary>{item.name}</summary>
        <p>{item.acceptedAnswer.text}</p>
      </details>
    {/each}
  </div>
</section>

<style>
  .faq { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 48px; }
  .faq .sec-title { font-size: clamp(32px, 4vw, 46px); }
  details { border-bottom: 1px solid var(--line); padding-block: 20px; }
  summary {
    cursor: pointer;
    font-weight: 600;
    font-size: 17px;
    list-style: none;
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }
  summary::-webkit-details-marker { display: none; }
  summary::after { content: '+'; color: var(--accent-text); font-size: 22px; line-height: 1; }
  details[open] summary::after { content: '–'; }
  details p { color: var(--fg-2); margin-top: 12px; max-width: 62ch; }
  @media (max-width: 900px) {
    .faq { grid-template-columns: 1fr; gap: 24px; }
  }
</style>
