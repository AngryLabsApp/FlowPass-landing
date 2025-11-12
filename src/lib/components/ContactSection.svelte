<script lang="ts">
  // Datos de contacto
  const whatsappNumber = "51987654321"; // sin + ni espacios
  const email = "hola@flowpass.pe";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=¡Hola!%20Quisiera%20más%20información%20sobre%20FlowPass.`;
  const mailtoLink = `mailto:${email}?subject=Consulta%20sobre%20FlowPass`;
</script>

<section
  id="contacto"
  class="relative bg-gradient-to-b from-white via-brand-50/30 to-white py-24 text-center text-neutral-700"
>
  <div class="max-w-4xl mx-auto px-6">
    <h2 class="text-4xl font-bold text-dark-200 mb-4">Contáctanos 💬</h2>
    <p class="text-lg text-neutral-600 mb-10">
      Si tienes dudas, necesitas soporte o simplemente quieres conocer más sobre
      FlowPass, puedes escribirnos directamente por WhatsApp o correo
      electrónico.
    </p>

    <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
      <!-- WhatsApp -->
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <!-- Heroicon: chat-bubble-left-right -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12c0 2.727 2.003 5.167 5.25 6.38V21l4.038-2.423A9.06 9.06 0 0 0 12 18.75c5.108 0 9.25-3.806 9.25-6.75S17.108 5.25 12 5.25 2.25 8.694 2.25 12Z"
          />
        </svg>
        Escríbenos por WhatsApp
      </a>

      <!-- Correo -->
      <a
        href={mailtoLink}
        class="flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-600 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <!-- Heroicon: envelope -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 17.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5A2.25 2.25 0 0 0 2.25 6.75m19.5 0L12 13.5 2.25 6.75"
          />
        </svg>
        Envíanos un correo
      </a>
    </div>

    <div class="mt-10 text-sm text-neutral-500 space-y-1">
      <p>
        📞 WhatsApp:
        <a
          href={whatsappLink}
          target="_blank"
          class="text-brand-600 hover:underline"
        >
          +{whatsappNumber}
        </a>
      </p>
      <p>
        📧 Correo:
        <a href={mailtoLink} class="text-brand-600 hover:underline">
          {email}
        </a>
      </p>
    </div>
  </div>
</section>
