<script lang="ts">
  import tiktokIcon from "$lib/assets/icons/tiktok-icon.svg";
  import facebookIcon from "$lib/assets/icons/facebook-icon.svg";
  import instagramIcon from "$lib/assets/icons/instagram-icon.svg";
  import whatsappIcon from "$lib/assets/icons/whatsapp-icon.svg";

  const year = new Date().getFullYear();
</script>

<footer class="bg-black text-white mt-20">
  <div
    class="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left"
  >
    <!-- Logo y descripción -->
    <div>
      <h3 class="text-2xl font-bold text-brand-400">FlowPass</h3>
      <p class="text-sm text-neutral-400 mt-2 max-w-xs">
        La forma moderna de gestionar tu academia. Todo en un solo lugar:
        alumnos, pagos y asistencias 💚
      </p>
    </div>

    <!-- Enlaces -->
    <nav
      class="flex flex-col sm:flex-row items-center gap-4 text-sm text-neutral-300"
    >
      <a href="#features" class="hover:text-brand-400 transition-colors"
        >Características</a
      >
      <a href="#planes" class="hover:text-brand-400 transition-colors">Planes</a
      >
      <a href="#contacto" class="hover:text-brand-400 transition-colors"
        >Contacto</a
      >
      <a href="/terminos" class="hover:text-brand-400 transition-colors"
        >Términos y Condiciones</a
      >
    </nav>

    <!-- Redes sociales -->
    <div class="flex items-center gap-5 text-neutral-400">
      <!-- TikTok -->
      <a
        href="https://www.tiktok.com/@flowpass.app?_r=1&_t=ZS-91Ld3dK3yMx"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-brand-400 transition-colors"
        aria-label="TikTok"
      >
        <img
          src={tiktokIcon}
          alt="FlowPass en TikTok"
          class="w-6 h-6 brightness-0 invert"
          loading="lazy"
        />
      </a>

      <!-- Facebook -->
      <a
        href="https://www.facebook.com/share/17fy2RKRvB/"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-brand-400 transition-colors"
        aria-label="Facebook"
      >
        <img
          src={facebookIcon}
          alt="FlowPass en Facebook"
          class="w-6 h-6 brightness-0 invert"
          loading="lazy"
        />
      </a>

      <!-- Instagram -->
      <a
        href="https://www.instagram.com/flowpass.app?igsh=a2NzOGljaTE4eDlj"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-brand-400 transition-colors"
        aria-label="Instagram"
      >
        <img
          src={instagramIcon}
          alt="FlowPass en Instagram"
          class="w-6 h-6 brightness-0 invert"
          loading="lazy"
        />
      </a>

      <!-- WhatsApp -->
      <a
        href="https://wa.me/51977854515"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-brand-400 transition-colors"
        aria-label="WhatsApp"
      >
        <img
          src={whatsappIcon}
          alt="WhatsApp de FlowPass"
          class="w-6 h-6 brightness-0 invert"
          loading="lazy"
        />
      </a>
    </div>
  </div>

  <!-- Línea inferior con slogan -->
  <div
    class="border-t border-neutral-800 py-6 text-center text-sm text-neutral-400 space-y-2"
  >
    <p>© {year} FlowPass — Todos los derechos reservados 💚</p>
    <p class="italic text-neutral-500">
      “Digitaliza tu academia y deja que todo fluya con FlowPass.”
    </p>
  </div>
</footer>
