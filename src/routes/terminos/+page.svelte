<script lang="ts">
  import { siteConfig } from "$lib/config/site";
  import { termsSEO } from "$lib/config/seo";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  
  const lastUpdate = "15 de marzo de 2024";
</script>

<svelte:head>
  <title>{termsSEO.title}</title>
  <meta name="description" content={termsSEO.description} />
  <meta name="keywords" content={termsSEO.keywords} />
  
  <link rel="canonical" href={`${siteConfig.url}/terminos`} />
  
  <meta property="og:title" content={termsSEO.title} />
  <meta property="og:description" content={termsSEO.description} />
  <meta property="og:url" content={`${siteConfig.url}/terminos`} />
  <meta property="og:type" content="website" />
  
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": termsSEO.title,
      "description": termsSEO.description,
      "url": `${siteConfig.url}/terminos`,
      "isPartOf": {
        "@type": "WebSite",
        "name": siteConfig.name,
        "url": siteConfig.url
      },
      "dateModified": lastUpdate
    })}
  </script>
</svelte:head>

<Navbar />

<main class="pt-24 pb-16 px-6 max-w-4xl mx-auto">
  <header class="mb-12 text-center">
    <h1 class="text-4xl md:text-5xl font-bold text-dark-200 mb-4">
      Términos y Condiciones
    </h1>
    <p class="text-neutral-600 text-lg">
      Última actualización: <time datetime="2024-03-15">{lastUpdate}</time>
    </p>
  </header>

  <div class="prose prose-lg max-w-none space-y-8 text-neutral-700">
    <section>
      <h2 class="text-2xl font-bold text-dark-200 mb-4">1. Aceptación de los términos</h2>
      <p>
        Al acceder y utilizar los servicios de <strong>FlowPass</strong> (en adelante, "la Plataforma"), 
        usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte, 
        no debe utilizar nuestros servicios.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-dark-200 mb-4">2. Descripción del servicio</h2>
      <p>
        FlowPass es un <strong>software como servicio (SaaS)</strong> diseñado para academias y centros de entrenamiento, 
        que permite la gestión de alumnos, control de pagos, registro de asistencias y comunicación automatizada por WhatsApp.
      </p>
      <p class="mt-2">
        La Plataforma se proporciona "tal cual" y nos esforzamos por mantenerla disponible y funcionando correctamente, 
        pero no garantizamos disponibilidad ininterrumpida o libre de errores.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-dark-200 mb-4">3. Responsabilidades del usuario</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>Proporcionar información veraz y actualizada al registrarse.</li>
        <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
        <li>Utilizar la Plataforma de acuerdo a la ley y estos términos.</li>
        <li>No intentar acceder a datos de otros usuarios o vulnerar la seguridad del sistema.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-dark-200 mb-4">4. Propiedad de los datos</h2>
      <p>
        <strong>Los datos que usted ingresa en FlowPass son de su exclusiva propiedad.</strong> 
        Nosotros solo actuamos como procesadores de datos, proporcionando las herramientas para su gestión. 
        No vendemos, alquilamos ni compartimos sus datos con terceros sin su consentimiento explícito, 
        excepto cuando sea requerido por ley.
      </p>
      <p class="mt-2">
        Firmamos un <strong>acuerdo de confidencialidad</strong> con cada academia para garantizar 
        la protección de su información.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-dark-200 mb-4">5. Pagos y suscripciones</h2>
      <p>
        FlowPass opera bajo un modelo de suscripción mensual. El precio se determina según la cantidad 
        de alumnos activos. Los pagos se procesan de forma segura a través de nuestros proveedores de pago.
      </p>
      <p class="mt-2">
        Puede cancelar su suscripción en cualquier momento. No hay contratos de permanencia ni penalizaciones 
        por cancelación. Al cancelar, seguirá teniendo acceso hasta el final del período pagado.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-dark-200 mb-4">6. Cancelación y suspensión</h2>
      <p>
        Nos reservamos el derecho de suspender o cancelar el acceso a la Plataforma si detectamos:
      </p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Uso inapropiado o fraudulento del servicio.</li>
        <li>Incumplimiento de estos términos.</li>
        <li>Falta de pago después de los períodos establecidos.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-dark-200 mb-4">7. Limitación de responsabilidad</h2>
      <p>
        FlowPass no será responsable por daños indirectos, pérdida de datos o lucro cesante derivados 
        del uso o imposibilidad de uso de la Plataforma. Nuestra responsabilidad máxima estará limitada 
        al monto pagado por el servicio en los últimos 12 meses.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-dark-200 mb-4">8. Modificaciones</h2>
      <p>
        Podemos actualizar estos términos ocasionalmente. Notificaremos cambios significativos a través 
        de la Plataforma o por correo electrónico. El uso continuado del servicio después de los cambios 
        constituye aceptación de los nuevos términos.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-dark-200 mb-4">9. Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa será resuelta 
        en los tribunales de Lima, Perú.
      </p>
    </section>

    <section>
      <h2 class="text-2xl font-bold text-dark-200 mb-4">10. Contacto</h2>
      <p>
        Si tiene preguntas sobre estos términos, contáctenos:
      </p>
      <address class="not-italic mt-2">
        <p>📧 <a href={`mailto:${siteConfig.email}`} class="text-brand-600 hover:underline">{siteConfig.email}</a></p>
        <p>📞 <a href={`https://wa.me/${siteConfig.phone}`} class="text-brand-600 hover:underline">{siteConfig.phoneFormatted}</a></p>
        <p>🏢 Lima, Perú</p>
      </address>
    </section>
  </div>
</main>

<Footer />