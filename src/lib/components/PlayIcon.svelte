<!-- Triangulito de colores de Google Play (badge del footer, portada y portal de alumnos). -->
<script lang="ts">
  let { size = 12 }: { size?: number } = $props();
</script>

<svg viewBox="0 0 24 26" width={size} height={Math.round((size * 26) / 24)} aria-hidden="true">
  <path d="M1 1l12.2 12L1 25c-.6-.3-1-.9-1-1.7V2.7C0 1.9.4 1.3 1 1z" fill="#00d7fe" />
  <path d="M17.3 8.9L13.2 13 1 1c.2-.1.4-.2.7-.2.3 0 .6.1.9.2l14.7 7.9z" fill="#00f076" />
  <path d="M17.3 17.1L2.6 25c-.3.2-.6.2-.9.2-.3 0-.5-.1-.7-.2l12.2-12 4.1 4.1z" fill="#ff3a44" />
  <path d="M22 14.6l-4.7 2.5-4.1-4.1 4.1-4.1L22 11.4c.6.3 1 .9 1 1.6s-.4 1.3-1 1.6z" fill="#ffd400" />
</svg>
