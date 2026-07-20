<script>
  import { onMount, onDestroy } from "svelte";

  /** @type {string} ISO datetime, e.g. "2026-07-31T23:59:59-05:00" */
  export let endsAt;
  export let compact = false;

  $: endMs = new Date(endsAt).getTime();

  let mounted = false;
  let expired = false;
  let d = 0, h = 0, m = 0, s = 0;
  /** @type {ReturnType<typeof setInterval> | null} */
  let timer = null;

  function tick() {
    const now = Date.now();
    const diff = endMs - now;
    if (diff <= 0) {
      expired = true;
      d = h = m = s = 0;
      if (timer) { clearInterval(timer); timer = null; }
      return;
    }
    const sec = Math.floor(diff / 1000);
    d = Math.floor(sec / 86400);
    h = Math.floor((sec % 86400) / 3600);
    m = Math.floor((sec % 3600) / 60);
    s = sec % 60;
  }

  onMount(() => {
    mounted = true;
    tick();
    timer = setInterval(tick, 1000);
  });
  onDestroy(() => { if (timer) clearInterval(timer); });

  /** @param {number} n */
  const pad = (n) => String(n).padStart(2, "0");
</script>

{#if !expired}
  <div class="countdown" class:compact aria-label="Tiempo restante para la oferta">
    <div class="unit">
      <span class="num">{mounted ? d : "--"}</span>
      <span class="lbl">días</span>
    </div>
    <span class="sep" aria-hidden="true">:</span>
    <div class="unit">
      <span class="num">{mounted ? pad(h) : "--"}</span>
      <span class="lbl">hrs</span>
    </div>
    <span class="sep" aria-hidden="true">:</span>
    <div class="unit">
      <span class="num">{mounted ? pad(m) : "--"}</span>
      <span class="lbl">min</span>
    </div>
    <span class="sep" aria-hidden="true">:</span>
    <div class="unit">
      <span class="num">{mounted ? pad(s) : "--"}</span>
      <span class="lbl">seg</span>
    </div>
  </div>
{/if}

<style>
  .countdown {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-variant-numeric: tabular-nums;
  }
  .unit {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 3.25rem;
    padding: 0.5rem 0.55rem 0.4rem;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
    border: 0.5px solid rgba(255,255,255,0.14);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
  }
  .num {
    font-family: 'Epoch', 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .lbl {
    font-size: 0.55rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.55);
    margin-top: 0.25rem;
  }
  .sep {
    color: rgba(255,255,255,0.28);
    font-weight: 700;
    font-size: 1.1rem;
    margin: 0 -0.05rem 0.4rem;
  }

  .countdown.compact .unit {
    min-width: 2.4rem;
    padding: 0.3rem 0.4rem 0.25rem;
    border-radius: 8px;
  }
  .countdown.compact .num { font-size: 1rem; }
  .countdown.compact .lbl { font-size: 0.48rem; margin-top: 0.15rem; }
  .countdown.compact .sep { font-size: 0.8rem; margin-bottom: 0.25rem; }

  @media (max-width: 640px) {
    .countdown { gap: 0.25rem; }
    .unit { min-width: 2.6rem; padding: 0.4rem 0.4rem 0.3rem; }
    .num { font-size: 1.15rem; }
    .lbl { font-size: 0.5rem; letter-spacing: 0.06em; }
    .sep { font-size: 0.9rem; }
  }
</style>
