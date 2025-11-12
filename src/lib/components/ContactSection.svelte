<script lang="ts">
  import { ChatBubbleOvalLeftEllipsis, AtSymbol } from "svelte-heros-v2";
  // Datos de contacto
  const whatsappNumber = "51977854515"; // sin + ni espacios
  const email = "contacto@flow-pass.com";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20academia.`;
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
        <ChatBubbleOvalLeftEllipsis />
        Escríbenos por WhatsApp
      </a>

      <!-- Correo -->
      <a
        href={mailtoLink}
        class="flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-600 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <!-- Heroicon: envelope -->
        <AtSymbol />
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
