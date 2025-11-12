<script lang="ts">
  import { Accordion, AccordionItem } from "flowbite-svelte";
</script>

<section id="faq" class="bg-light-100 py-24 px-6">
  <div class="max-w-4xl mx-auto text-center mb-10">
    <h2
      class="font-jakarta text-3xl md:text-5xl font-extrabold text-dark-200 mb-4"
    >
      Preguntas frecuentes
    </h2>
    <p class="text-neutral-600 text-lg">
      Respondemos las dudas más comunes sobre FlowPass 💚
    </p>
  </div>

  <div class="max-w-3xl mx-auto text-left">
    <Accordion
      multiple
      activeClass="bg-light-300 text-brand-700 focus:ring-4 focus:ring-brand-200"
      inactiveClass="text-neutral-700 hover:bg-light-200"
      class="rounded-2xl shadow-sm"
    >
      <!-- ¿Qué es FlowPass? -->
      <AccordionItem>
        {#snippet header()}🤔 ¿Qué es FlowPass?{/snippet}
        <p class="text-neutral-600">
          FlowPass es una herramienta que te ayuda a <strong
            >llevar el control de tu academia sin complicarte</strong
          >. Desde un solo lugar puedes ver tus alumnos, sus pagos y
          asistencias, todo de manera digital.
        </p>
      </AccordionItem>

      <!-- ¿Tengo que instalar algo? -->
      <AccordionItem>
        {#snippet header()}📱 ¿Tengo que instalar algo?{/snippet}
        <p class="text-neutral-600">
          No 😊 FlowPass funciona directo desde internet. Puedes usarlo desde tu
          celular, tablet o computadora, sin descargar nada.
        </p>
      </AccordionItem>

      <!-- ¿Puedo registrar los pagos? -->
      <AccordionItem>
        {#snippet header()}💳 ¿Puedo registrar los pagos de mis alumnos?{/snippet}
        <p class="text-neutral-600">
          Sí 💚 Podrás ver quién pagó, cuándo vence su plan y cuánto dinero
          ingresó a tu academia. Todo queda guardado automáticamente.
        </p>
      </AccordionItem>

      <!-- ¿Qué tipo de academias? -->
      <AccordionItem>
        {#snippet header()}🧍‍♀️ ¿Qué tipo de academias pueden usar FlowPass?{/snippet}
        <p class="text-neutral-600">
          Funciona para <strong>todo tipo de academias</strong>: danza, karate,
          fútbol, gimnasio, yoga, básquet, natación o cualquier otra que trabaje
          con alumnos y cobros mensuales.
        </p>
      </AccordionItem>

      <!-- WhatsApp -->
      <AccordionItem>
        {#snippet header()}💬 ¿Puedo mandar recordatorios por WhatsApp?{/snippet}
        <p class="text-neutral-600">
          Sí ✅ FlowPass puede <strong>enviar recordatorios automáticos</strong>
          a tus alumnos, por ejemplo cuando se acerca la fecha de pago o al darles
          la bienvenida.
        </p>
      </AccordionItem>

      <!-- Seguridad -->
      <AccordionItem>
        {#snippet header()}🔐 ¿Mis datos están seguros?{/snippet}
        <p class="text-neutral-600">
          Sí, completamente. En FlowPass utilizamos <strong
            >servicios en la nube con altos estándares de seguridad</strong
          >
          para proteger toda la información de tu academia y de tus alumnos.
          <br /><br />
          Además, <strong>firmamos un acuerdo de confidencialidad</strong> con
          cada academia para garantizar que tus datos se mantengan privados.
          Recuerda: <strong>la información siempre es tuya</strong>; FlowPass
          solo te ayuda a gestionarla de forma segura y eficiente.
        </p>
      </AccordionItem>

      <!-- Modelo de negocio -->
      <AccordionItem>
        {#snippet header()}💚 ¿Cómo funciona FlowPass? ¿Se compra o se paga cada
          mes?{/snippet}
        <p class="text-neutral-600">
          FlowPass funciona con un modelo de <strong>suscripción mensual</strong
          >, al igual que Netflix o Spotify. Pagas una pequeña cuota al mes y
          obtienes acceso completo a la plataforma, soporte personalizado y
          todas las actualizaciones.
          <br /><br />
          Además, si en algún momento no deseas usar FlowPass,
          <strong>puedes pausar tu cuenta cuando lo necesites</strong> y retomarla
          más adelante. No hay contratos ni compromisos — tú decides cuándo usar
          FlowPass.
        </p>
      </AccordionItem>

      <!-- Precios -->
      <AccordionItem>
        {#snippet header()}💰 ¿Cuánto cuesta FlowPass?{/snippet}
        <p class="text-neutral-600">
          El precio depende del <strong>número de alumnos</strong> que tenga tu academia.
          Antes de activarlo, conversamos contigo para conocer tu caso y ofrecerte
          un precio justo según el tamaño de tu academia. Así pagas solo por lo que
          realmente necesitas.
        </p>
      </AccordionItem>

      <!-- Demo -->
      <AccordionItem>
        {#snippet header()}🧾 ¿Puedo probar FlowPass antes?{/snippet}
        <p class="text-neutral-600">
          ¡Claro que sí! 🙌 Puedes agendar una <strong>demo gratuita</strong> donde
          te mostramos cómo funciona y cómo podrías usarlo en tu academia.
        </p>
      </AccordionItem>
    </Accordion>

    <p class="text-center text-neutral-600 mt-10">
      ¿Tienes otra duda? Escríbenos por WhatsApp 💬 Estamos listos para ayudarte
      a digitalizar tu academia sin complicarte 💚
    </p>
  </div>
</section>
