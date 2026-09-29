<script lang="ts">
  import { siteConfig } from "$lib/config/site";
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
    <span class="contact-label">Ubicación</span>
    <span class="contact-value">Lima, Perú</span>
  </div>
</address>
