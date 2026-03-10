<script lang="ts">
  import { ChatBubbleOvalLeftEllipsis, AtSymbol } from "svelte-heros-v2";
  import { siteConfig } from "$lib/config/site";

  const whatsappLink = `https://wa.me/${siteConfig.phone}?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20academia.`;
  const mailtoLink = `mailto:${siteConfig.email}?subject=Consulta%20sobre%20FlowPass%20para%20academias`;
</script>

<section
  id="contacto"
  class="relative bg-gradient-to-b from-white via-brand-50/30 to-white py-24 text-center"
  aria-labelledby="contact-heading"
>
  <div class="max-w-4xl mx-auto px-6">
    <h2 id="contact-heading" class="text-4xl font-bold text-dark-200 mb-4">
      Contáctanos y prueba FlowPass 💬
    </h2>
    <p class="text-lg text-neutral-600 mb-10">
      ¿Tienes dudas? ¿Quieres una <strong>demo personalizada</strong>? 
      Escríbenos directamente y descubre cómo FlowPass puede ayudar a tu academia.
    </p>

    <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        aria-label="Contactar a FlowPass por WhatsApp (se abre en nueva ventana)"
      >
        <ChatBubbleOvalLeftEllipsis aria-hidden="true" />
        <span>Escríbenos por WhatsApp</span>
      </a>

      <a
        href={mailtoLink}
        class="flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-600 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        aria-label="Enviar un correo electrónico a FlowPass"
      >
        <AtSymbol aria-hidden="true" />
        <span>Envíanos un correo</span>
      </a>
    </div>

    <div class="mt-10 text-sm text-neutral-500 space-y-1">
      <p>
        <span class="font-semibold">📞 WhatsApp:</span>
        <a
          href={whatsappLink}
          target="_blank"
          class="text-brand-600 hover:underline"
          aria-label={`WhatsApp: ${siteConfig.phoneFormatted}`}
        >
          {siteConfig.phoneFormatted}
        </a>
      </p>
      <p>
        <span class="font-semibold">📧 Correo:</span>
        <a
          href={mailtoLink}
          class="text-brand-600 hover:underline"
          aria-label={`Correo electrónico: ${siteConfig.email}`}
        >
          {siteConfig.email}
        </a>
      </p>
    </div>
  </div>
</section>