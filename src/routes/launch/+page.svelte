<script lang="ts">
  import { onMount } from 'svelte';

  const LOGIN_URL = 'https://app.flow-pass.com/login';

  onMount(() => {
    window.location.replace(LOGIN_URL);
  });
</script>

<svelte:head>
  <title>Abriendo FlowPass…</title>
  <meta name="robots" content="noindex" />
  <meta http-equiv="refresh" content={`0; url=${LOGIN_URL}`} />
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-[#09090f] text-white">
  <div class="flex flex-col items-center gap-4">
    <img src="/web-app-manifest-192x192.png" alt="FlowPass" width="96" height="96" class="rounded-2xl" />
    <p class="text-sm text-white/70">Abriendo FlowPass…</p>
    <noscript>
      <a href={LOGIN_URL} class="text-[#07F49D] underline">Ir al login</a>
    </noscript>
  </div>
</main>
