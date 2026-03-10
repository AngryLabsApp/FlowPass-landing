<script lang="ts">
  import whatsappIcon from "$lib/assets/icons/whatsapp-icon.svg";
  import { siteConfig } from "$lib/config/site";

  export let phone = siteConfig.phone;
  export let message = "Hola FlowPass, quiero saber más sobre la plataforma para mi academia";
  export let ariaLabel = "Contactar a FlowPass por WhatsApp para consultar sobre el software de gestión";
  export let className = "";

  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
</script>

<a
  href={whatsappLink}
  target="_blank"
  rel="noopener noreferrer nofollow"
  class={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 rounded-full bg-brand-400 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.45)] hover:scale-105 transition-transform duration-300 z-[9999] ${className}`}
  aria-label={ariaLabel}
>
  <img 
    src={whatsappIcon} 
    alt="" 
    class="w-7 h-7" 
    decoding="async"
    width="28"
    height="28"
    aria-hidden="true"
  />
  <span class="sr-only">Escríbenos por WhatsApp para conocer más sobre FlowPass</span>
</a>