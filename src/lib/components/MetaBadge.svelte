<!-- Sello "Meta Tech Provider" (FlowPass es proveedor tecnológico de Meta para WhatsApp Business).
     Hereda el color del texto: sirve sobre fondo negro (footer) y sobre los paneles del home. -->
<script lang="ts">
  // inline: versión mínima (logo chico + texto en una línea) para el hero.
  let { class: cls = '', inline = false }: { class?: string; inline?: boolean } = $props();
</script>

<div class="meta-badge {cls}" class:inline role="img" aria-label="FlowPass es Meta Tech Provider">
  <svg class="meta-logo" viewBox="0 0 24 24" width={inline ? 14 : 26} height={inline ? 14 : 26} aria-hidden="true">
    <path
      fill="#0081FB"
      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.930-4.716-2.930-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.020 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.810 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.130-.464-2.046 0-2.221.630-4.535 1.660-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
    />
  </svg>
  <span class="meta-text" aria-hidden="true">
    {#if !inline}<span class="meta-small">Somos</span>{/if}
    <span class="meta-big">Meta Tech Provider</span>
  </span>
</div>

<style>
  .meta-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    min-height: 48px;
    padding: 0.4rem 1rem 0.4rem 0.75rem;
    border-radius: 10px;
    border: 1px solid currentColor;
    border-color: color-mix(in srgb, currentColor 35%, transparent);
    color: inherit;
  }
  .meta-logo { flex-shrink: 0; }
  .meta-text { display: flex; flex-direction: column; line-height: 1.1; }
  .meta-small { font-size: 0.625rem; letter-spacing: 0.04em; text-transform: uppercase; opacity: 0.75; }
  .meta-big { font-size: 1.05rem; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; }
  /* Inline: sin borde ni caja, del tamaño del texto que lo rodea. */
  .inline { min-height: 0; padding: 0; gap: 6px; border: 0; border-radius: 0; }
  .inline .meta-big { font-size: inherit; font-weight: 500; letter-spacing: 0; }
</style>
