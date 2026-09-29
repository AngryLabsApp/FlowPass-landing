<script lang="ts">
  import { termsSEO } from "$lib/config/seo";
  import LegalLayout from "$lib/components/legal/LegalLayout.svelte";
  import LegalContact from "$lib/components/legal/LegalContact.svelte";

  const sections = [
    { id: "aceptacion", num: "1", title: "Aceptación de los términos" },
    { id: "servicio", num: "2", title: "Descripción del servicio" },
    { id: "responsabilidades", num: "3", title: "Responsabilidades del usuario" },
    { id: "datos", num: "4", title: "Propiedad y tratamiento de los datos" },
    { id: "pagos", num: "5", title: "Pagos y suscripciones" },
    { id: "cancelacion", num: "6", title: "Cancelación y suspensión" },
    { id: "responsabilidad", num: "7", title: "Limitación de responsabilidad" },
    { id: "modificaciones", num: "8", title: "Modificaciones" },
    { id: "ley", num: "9", title: "Ley aplicable" },
    { id: "contacto", num: "10", title: "Contacto" },
  ];
</script>

<LegalLayout
  seo={termsSEO}
  path="/terminos"
  eyebrow="Legal · Academias"
  title="Términos y"
  titleGrad="condiciones"
  subtitle="Para academias y negocios que contratan FlowPass."
  lastUpdate="28 de septiembre de 2026"
  lastUpdateISO="2026-09-28"
  {sections}
>
  <section id="aceptacion">
    <h2 class="terms-h2 font-epoch"><span class="num">01</span> Aceptación de los términos</h2>
    <p>
      Al acceder y utilizar los servicios de <strong>FlowPass</strong> (en adelante, "la Plataforma"),
      usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte,
      no debe utilizar nuestros servicios.
    </p>
    <p>
      Si eres alumno de una academia que usa FlowPass, revisa los
      <a href="/alumnos/terminos">Términos para alumnos</a>.
    </p>
  </section>

  <section id="servicio">
    <h2 class="terms-h2 font-epoch"><span class="num">02</span> Descripción del servicio</h2>
    <p>
      FlowPass es un <strong>software como servicio (SaaS)</strong> diseñado para negocios que venden
      clases, planes o membresías. Permite gestionar alumnos, controlar pagos, registrar asistencias
      y automatizar comunicación por WhatsApp.
    </p>
    <p>
      La Plataforma se proporciona "tal cual". Nos esforzamos por mantenerla disponible y funcionando
      correctamente, pero no garantizamos disponibilidad ininterrumpida o libre de errores.
    </p>
  </section>

  <section id="responsabilidades">
    <h2 class="terms-h2 font-epoch"><span class="num">03</span> Responsabilidades del usuario</h2>
    <ul class="terms-list">
      <li>Proporcionar información veraz y actualizada al registrarse.</li>
      <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
      <li>Utilizar la Plataforma de acuerdo a la ley y estos términos.</li>
      <li>No intentar acceder a datos de otros usuarios o vulnerar la seguridad del sistema.</li>
    </ul>
  </section>

  <section id="datos">
    <h2 class="terms-h2 font-epoch"><span class="num">04</span> Propiedad y tratamiento de los datos</h2>
    <div class="callout">
      <strong>Los datos que usted ingresa en FlowPass son de su exclusiva propiedad.</strong>
    </div>
    <p>
      FlowPass actúa como <strong>plataforma puente</strong> y como <strong>encargado del
      tratamiento</strong> en los términos de la Ley N.º 29733: procesamos los datos de sus alumnos
      por su cuenta y solo para prestarle el servicio.
    </p>
    <p>
      Como <strong>titular del banco de datos</strong> de sus alumnos, usted es responsable de:
    </p>
    <ul class="terms-list">
      <li>Contar con la autorización de sus alumnos (o de sus padres o tutores, si son menores) para registrar y usar sus datos.</li>
      <li>Registrar solo los datos necesarios y usarlos para los fines informados, en especial la información de salud.</li>
      <li>Atender las solicitudes de acceso, rectificación, cancelación u oposición de sus alumnos. Si un alumno nos contacta, coordinaremos la solicitud con usted.</li>
      <li>El uso que su negocio haga de los datos fuera de la Plataforma.</li>
    </ul>
    <p>
      No vendemos ni alquilamos sus datos. Solo los compartimos con los proveedores que necesitamos
      para operar el servicio, bajo obligaciones de confidencialidad, o cuando sea requerido por ley.
      Firmamos un <strong>acuerdo de confidencialidad</strong> con cada negocio para garantizar la
      protección de su información. El detalle está en nuestra
      <a href="/privacidad">Política de privacidad</a>.
    </p>
  </section>

  <section id="pagos">
    <h2 class="terms-h2 font-epoch"><span class="num">05</span> Pagos y suscripciones</h2>
    <p>
      FlowPass opera bajo un modelo de <strong>suscripción mensual</strong>. El precio se determina
      según la cantidad de alumnos activos. Los pagos se procesan de forma segura a través de
      nuestros proveedores de pago.
    </p>
    <p>
      Puede cancelar su suscripción en cualquier momento. <strong>No hay contratos de permanencia
      ni penalizaciones por cancelación.</strong> Al cancelar, seguirá teniendo acceso hasta el
      final del período pagado.
    </p>
  </section>

  <section id="cancelacion">
    <h2 class="terms-h2 font-epoch"><span class="num">06</span> Cancelación y suspensión</h2>
    <p>Nos reservamos el derecho de suspender o cancelar el acceso a la Plataforma si detectamos:</p>
    <ul class="terms-list">
      <li>Uso inapropiado o fraudulento del servicio.</li>
      <li>Incumplimiento de estos términos.</li>
      <li>Falta de pago después de los períodos establecidos.</li>
    </ul>
  </section>

  <section id="responsabilidad">
    <h2 class="terms-h2 font-epoch"><span class="num">07</span> Limitación de responsabilidad</h2>
    <p>
      FlowPass no será responsable por daños indirectos, pérdida de datos o lucro cesante derivados
      del uso o imposibilidad de uso de la Plataforma. Nuestra responsabilidad máxima estará limitada
      al monto pagado por el servicio en los últimos 12 meses.
    </p>
  </section>

  <section id="modificaciones">
    <h2 class="terms-h2 font-epoch"><span class="num">08</span> Modificaciones</h2>
    <p>
      Podemos actualizar estos términos ocasionalmente. Notificaremos cambios significativos a través
      de la Plataforma o por correo electrónico. El uso continuado del servicio después de los cambios
      constituye aceptación de los nuevos términos.
    </p>
  </section>

  <section id="ley">
    <h2 class="terms-h2 font-epoch"><span class="num">09</span> Ley aplicable</h2>
    <p>
      Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa será resuelta
      en los tribunales de Lima, Perú.
    </p>
  </section>

  <section id="contacto">
    <h2 class="terms-h2 font-epoch"><span class="num">10</span> Contacto</h2>
    <p>Si tiene preguntas sobre estos términos, contáctenos:</p>
    <LegalContact />
  </section>
</LegalLayout>
