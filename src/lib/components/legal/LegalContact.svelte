<script lang="ts">
  import { siteConfig } from "$lib/config/site";

  // En /terminos se muestra también el representante legal.
  let { showRepresentative = false }: { showRepresentative?: boolean } = $props();
</script>

<address class="contact-block">
  <a href={`mailto:${siteConfig.email}`} class="contact-row">
    <span class="contact-label">Correo</span>
    <span class="contact-value">{siteConfig.email}</span>
  </a>
  <a href={`https://wa.me/${siteConfig.phone}`} target="_blank" rel="noopener noreferrer" class="contact-row">
    <span class="contact-label">WhatsApp</span>
    <span class="contact-value">{siteConfig.phoneFormatted}</span>
  </a>
  <div class="contact-row static">
    <span class="contact-label">Razón social</span>
    <span class="contact-value">{siteConfig.legal.name}</span>
  </div>
  <div class="contact-row static">
    <span class="contact-label">RUC</span>
    <span class="contact-value">{siteConfig.legal.ruc}</span>
  </div>
  <div class="contact-row static">
    <span class="contact-label">Domicilio fiscal</span>
    <span class="contact-value">{siteConfig.legal.address}</span>
  </div>
  {#if showRepresentative}
    <div class="contact-row static">
      <span class="contact-label">Representante legal</span>
      <span class="contact-value">{siteConfig.legal.representative}</span>
    </div>
    <a href={`mailto:${siteConfig.legal.representativeEmail}`} class="contact-row">
      <span class="contact-label">Correo del representante</span>
      <span class="contact-value">{siteConfig.legal.representativeEmail}</span>
    </a>
  {/if}
</address>
