<script lang="ts">
  import tiktokIcon from "$lib/assets/icons/tiktok-icon.svg";
  import facebookIcon from "$lib/assets/icons/facebook-icon.svg";
  import instagramIcon from "$lib/assets/icons/instagram-icon.svg";
  import whatsappIcon from "$lib/assets/icons/whatsapp-icon.svg";
  import { siteConfig } from "$lib/config/site";

  const year = new Date().getFullYear();
</script>

<footer class="bg-black text-white mt-20" aria-labelledby="footer-heading">
  <h2 id="footer-heading" class="sr-only">Información de FlowPass</h2>
  
  <div
    class="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left"
  >
    <div>
      <h3 class="text-2xl font-bold text-brand-400">FlowPass</h3>
      <p class="text-sm text-neutral-400 mt-2 max-w-xs">
        <strong>Software para academias y gimnasios</strong> que simplifica la gestión de alumnos, pagos y asistencias. Todo en un solo lugar 💚
      </p>
    </div>

    <nav class="flex flex-col sm:flex-row items-center gap-4 text-sm text-neutral-300" aria-label="Enlaces del footer">
      <a href="/#features" class="hover:text-brand-400 transition-colors"
        >Características</a
      >
      <a href="/#contacto" class="hover:text-brand-400 transition-colors"
        >Contacto</a
      >
      <a href="/terminos" class="hover:text-brand-400 transition-colors"
        >Términos y Condiciones</a
      >
    </nav>

    <div class="flex items-center gap-5 text-neutral-400">
      <a
        href={siteConfig.social.tiktok}
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="hover:text-brand-400 transition-colors"
        aria-label="FlowPass en TikTok (se abre en nueva ventana)"
      >
        <img
          src={tiktokIcon}
          alt=""
          class="w-6 h-6 brightness-0 invert"
          loading="lazy"
          width="24"
          height="24"
          aria-hidden="true"
        />
        <span class="sr-only">TikTok</span>
      </a>

      <a
        href={siteConfig.social.facebook}
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="hover:text-brand-400 transition-colors"
        aria-label="FlowPass en Facebook (se abre en nueva ventana)"
      >
        <img
          src={facebookIcon}
          alt=""
          class="w-6 h-6 brightness-0 invert"
          loading="lazy"
          width="24"
          height="24"
          aria-hidden="true"
        />
        <span class="sr-only">Facebook</span>
      </a>

      <a
        href={siteConfig.social.instagram}
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="hover:text-brand-400 transition-colors"
        aria-label="FlowPass en Instagram (se abre en nueva ventana)"
      >
        <img
          src={instagramIcon}
          alt=""
          class="w-6 h-6 brightness-0 invert"
          loading="lazy"
          width="24"
          height="24"
          aria-hidden="true"
        />
        <span class="sr-only">Instagram</span>
      </a>

      <a
        href={siteConfig.social.whatsapp}
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="hover:text-brand-400 transition-colors"
        aria-label="Contactar a FlowPass por WhatsApp (se abre en nueva ventana)"
      >
        <img
          src={whatsappIcon}
          alt=""
          class="w-6 h-6 brightness-0 invert"
          loading="lazy"
          width="24"
          height="24"
          aria-hidden="true"
        />
        <span class="sr-only">WhatsApp</span>
      </a>
    </div>
  </div>

  <div class="border-t border-neutral-800 py-6 text-center text-sm text-neutral-400 space-y-2">
    <p>© {year} FlowPass. Todos los derechos reservados. Empresa registrada en Lima, Perú.</p>
    <p class="italic text-neutral-500">
      “Digitaliza tu academia y deja que todo fluya con FlowPass.”
    </p>
  </div>
</footer>