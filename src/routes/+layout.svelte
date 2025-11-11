<script lang="ts">
  import flowPassIcon from "$lib/assets/icons/logo-icon.svg";

  let { children } = $props();
  import "../app.css";
</script>

<svelte:head>
  <link rel="icon" href={flowPassIcon} />
</svelte:head>

{@render children()}
