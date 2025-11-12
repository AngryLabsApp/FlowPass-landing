<script lang="ts">
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
        href="https://www.tiktok.com/@flowpass.pe"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-brand-400 transition-colors"
        aria-label="TikTok"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          class="w-6 h-6"
        >
          <path
            d="M16.5 3.75a4.5 4.5 0 0 0 4.5 4.5v3a7.5 7.5 0 0 1-4.5-1.5v5.25a6.75 6.75 0 1 1-6.75-6.75 6.64 6.64 0 0 1 1.5.172V12a3.75 3.75 0 1 0 2.25 3.422V3.75h3Z"
          />
        </svg>
      </a>

      <!-- Facebook -->
      <a
        href="https://www.facebook.com/flowpass.pe"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-brand-400 transition-colors"
        aria-label="Facebook"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          class="w-6 h-6"
        >
          <path
            d="M9 8H7v4h2v12h5V12h3.642l.358-4H14V6.708C14 5.789 14.184 5 15.708 5H17V1h-2.473C11.86 1 9 2.79 9 6.316V8Z"
          />
        </svg>
      </a>

      <!-- Instagram -->
      <a
        href="https://www.instagram.com/flowpass.pe"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-brand-400 transition-colors"
        aria-label="Instagram"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 2.25h9a5.25 5.25 0 0 1 5.25 5.25v9a5.25 5.25 0 0 1-5.25 5.25h-9A5.25 5.25 0 0 1 2.25 16.5v-9A5.25 5.25 0 0 1 7.5 2.25Zm9.75 5.25h.008v.008h-.008V7.5Zm-4.5 1.5a3.75 3.75 0 1 1-3.75 3.75A3.75 3.75 0 0 1 12.75 9Z"
          />
        </svg>
      </a>

      <!-- WhatsApp -->
      <a
        href="https://wa.me/51987654321"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-brand-400 transition-colors"
        aria-label="WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12c0 2.727 2.003 5.167 5.25 6.38V21l4.038-2.423A9.06 9.06 0 0 0 12 18.75c5.108 0 9.25-3.806 9.25-6.75S17.108 5.25 12 5.25 2.25 8.694 2.25 12Z"
          />
        </svg>
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
