<script lang="ts">
  import whatsappIcon from "$lib/assets/icons/whatsapp-icon.svg";

  export let phone = "51977854515";
  export let message =
    "Hola FlowPass, quiero saber más sobre la plataforma";
  export let ariaLabel = "Contáctanos por WhatsApp";
  export let className = "";

  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(
    message
  )}`;
</script>

<a
  href={whatsappLink}
  target="_blank"
  rel="noopener noreferrer"
  class={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 rounded-full bg-brand-400 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.45)] hover:scale-105 transition-transform duration-300 z-[9999] ${className}`}
  aria-label={ariaLabel}
>
  <img src={whatsappIcon} alt="Logo de WhatsApp" class="w-7 h-7" decoding="async" />
  <span class="sr-only">Escríbenos por WhatsApp</span>
</a>
