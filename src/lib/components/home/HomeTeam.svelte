<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import { siteConfig } from '$lib/config/site';

  // Las personas detrás de FlowPass. Avatares recortados de las fotos de /about
  // (static/team/*.webp, ~3 KB c/u; las originales pesan ~1.2 MB).
  const avatars: Record<string, string> = {
    'Grecia Delgado': '/team/grecia.webp',
    'Angel Valenzuela': '/team/angel.webp',
    'Piero Varillas': '/team/piero.webp'
  };
  const team = siteConfig.founders;
</script>

<section class="wrap team" aria-labelledby="team-title">
  <div class="box" use:reveal>
    <div class="faces" aria-hidden="true">
      {#each team as f (f.name)}
        {#if avatars[f.name]}<img src={avatars[f.name]} alt="" width="64" height="64" loading="lazy" decoding="async" />{/if}
      {/each}
    </div>
    <div class="copy">
      <h2 id="team-title">Detrás de FlowPass hay personas, <span>no un bot.</span></h2>
      <p>
        {#each team as f, i (f.name)}<b>{f.name.split(' ')[0]}</b>{i < team.length - 2 ? ', ' : i === team.length - 2 ? ' y ' : ''}{/each}
        responden tu WhatsApp y te acompañan desde el primer día.
      </p>
    </div>
    <a class="link" href="/about#equipo">Conoce al equipo →</a>
  </div>
</section>

<style>
  .box {
    display: flex;
    align-items: center;
    gap: 22px;
    padding: 22px 26px;
    border: 1px solid var(--line);
    border-radius: 22px;
    background: var(--panel);
  }
  .faces { display: flex; flex: none; }
  .faces img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    background: #c6f7e2;
    border: 3px solid var(--panel);
    margin-left: -16px;
  }
  .faces img:first-child { margin-left: 0; }
  .copy { flex: 1; min-width: 0; }
  h2 { font-size: clamp(20px, 2.2vw, 26px); }
  h2 span { color: var(--accent-text); }
  .copy p { margin-top: 6px !important; color: var(--fg-2); font-size: 15px; }
  .copy b { color: var(--fg); font-weight: 600; }
  .link { flex: none; font-weight: 600; font-size: 14.5px; color: var(--accent-text); text-decoration: none; white-space: nowrap; }
  .link:hover { text-decoration: underline; }
  @media (max-width: 760px) {
    .box { flex-wrap: wrap; gap: 14px; padding: 18px; }
    .faces img { width: 52px; height: 52px; margin-left: -12px; }
    .copy { flex-basis: 100%; }
    h2 { font-size: 19px; }
    .copy p { font-size: 14px; }
  }
</style>
