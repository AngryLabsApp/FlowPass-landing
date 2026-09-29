<script lang="ts">
  import { studentTermsSEO } from "$lib/config/seo";
  import LegalLayout from "$lib/components/legal/LegalLayout.svelte";
  import LegalContact from "$lib/components/legal/LegalContact.svelte";

  const sections = [
    { id: "aceptacion", num: "1", title: "Aceptación" },
    { id: "portal", num: "2", title: "Qué es el portal" },
    { id: "academia", num: "3", title: "Tu relación con tu academia" },
    { id: "cuenta", num: "4", title: "Tu cuenta" },
    { id: "uso", num: "5", title: "Uso adecuado" },
    { id: "contenido", num: "6", title: "Contenido del portal" },
    { id: "privacidad", num: "7", title: "Tus datos" },
    { id: "disponibilidad", num: "8", title: "Disponibilidad" },
    { id: "responsabilidad", num: "9", title: "Limitación de responsabilidad" },
    { id: "suspension", num: "10", title: "Suspensión del acceso" },
    { id: "modificaciones", num: "11", title: "Modificaciones" },
    { id: "ley", num: "12", title: "Ley aplicable" },
    { id: "contacto", num: "13", title: "Contacto" },
  ];
</script>

<LegalLayout
  seo={studentTermsSEO}
  path="/alumnos/terminos"
  eyebrow="Legal · Alumnos"
  title="Términos para"
  titleGrad="alumnos"
  subtitle="Condiciones de uso del portal y la app de alumnos de FlowPass."
  lastUpdate="28 de septiembre de 2026"
  lastUpdateISO="2026-09-28"
  {sections}
>
  <section id="aceptacion">
    <h2 class="terms-h2 font-epoch"><span class="num">01</span> Aceptación</h2>
    <p>
      Al ingresar al portal o a la app de alumnos de <strong>FlowPass</strong> (en adelante, "el
      portal"), aceptas estos términos. Si no estás de acuerdo, no uses el portal. Si eres menor de
      edad, tu padre, madre o tutor debe aceptarlos por ti.
    </p>
  </section>

  <section id="portal">
    <h2 class="terms-h2 font-epoch"><span class="num">02</span> Qué es el portal</h2>
    <p>
      El portal te permite ver, en un solo lugar, tu información en las academias que usan FlowPass:
      tu credencial de acceso, tus planes, tus clases y las comunicaciones de tu academia. Si
      entrenas en más de una academia, puedes ver todas desde la misma cuenta.
    </p>
    <p>El uso del portal es gratuito para los alumnos.</p>
  </section>

  <section id="academia">
    <h2 class="terms-h2 font-epoch"><span class="num">03</span> Tu relación con tu academia</h2>
    <div class="callout">
      <strong>FlowPass es la plataforma puente entre tú y tu academia.</strong> Tu plan, tus pagos y
      tus clases los contratas directamente con tu academia, no con FlowPass.
    </div>
    <ul class="terms-list">
      <li>Los precios, horarios, cupos, reglas de asistencia, cobros y devoluciones los define tu academia.</li>
      <li>La información que ves en el portal (plan, clases, pagos) la registra tu academia. Si algo no es correcto, pídele que lo actualice.</li>
      <li>Los reclamos sobre el servicio de la academia se atienden directamente con ella.</li>
      <li>FlowPass no es parte de ese acuerdo y no responde por el servicio que presta cada academia.</li>
    </ul>
  </section>

  <section id="cuenta">
    <h2 class="terms-h2 font-epoch"><span class="num">04</span> Tu cuenta</h2>
    <ul class="terms-list">
      <li>Ingresas con tu número de WhatsApp. Es tu responsabilidad que ese número sea tuyo o de tu tutor.</li>
      <li>Mantén en secreto tu contraseña y los códigos que te enviamos. Nadie de FlowPass ni de tu academia te los pedirá.</li>
      <li>
        Un mismo número puede tener varios perfiles (por ejemplo, un padre con dos hijos inscritos).
        Quien usa ese número es responsable del uso de todos sus perfiles.
      </li>
      <li>Si crees que alguien entró a tu cuenta, cambia tu contraseña y avísanos.</li>
    </ul>
  </section>

  <section id="uso">
    <h2 class="terms-h2 font-epoch"><span class="num">05</span> Uso adecuado</h2>
    <p>Al usar el portal te comprometes a:</p>
    <ul class="terms-list">
      <li>No intentar acceder a cuentas o datos de otras personas.</li>
      <li>No compartir ni alterar tu credencial de acceso para que la use otra persona.</li>
      <li>No intentar vulnerar la seguridad del portal ni interferir con su funcionamiento.</li>
      <li>Usarlo de acuerdo con la ley y con estos términos.</li>
    </ul>
  </section>

  <section id="contenido">
    <h2 class="terms-h2 font-epoch"><span class="num">06</span> Contenido del portal</h2>
    <p>
      El logo, los colores, la portada y los mensajes de cada academia son responsabilidad de esa
      academia. Algunas portadas provienen de <strong>Unsplash</strong> y muestran el crédito de su
      autor.
    </p>
    <p>
      El software, el diseño y la marca FlowPass pertenecen a FlowPass y no pueden copiarse ni usarse
      sin autorización.
    </p>
  </section>

  <section id="privacidad">
    <h2 class="terms-h2 font-epoch"><span class="num">07</span> Tus datos</h2>
    <p>
      Tu academia es la responsable de tus datos personales, y FlowPass los procesa por encargo de
      ella. No guardamos datos de tarjetas ni bancarios. Puedes ver el detalle, y cómo pedir que se
      corrijan o eliminen, en nuestra <a href="/privacidad">Política de privacidad</a>.
    </p>
  </section>

  <section id="disponibilidad">
    <h2 class="terms-h2 font-epoch"><span class="num">08</span> Disponibilidad</h2>
    <p>
      Trabajamos para que el portal esté siempre disponible, pero puede haber interrupciones por
      mantenimiento, fallas o causas ajenas a nosotros. El portal se ofrece "tal cual" y podemos
      mejorarlo, cambiarlo o dejar de ofrecer alguna función.
    </p>
  </section>

  <section id="responsabilidad">
    <h2 class="terms-h2 font-epoch"><span class="num">09</span> Limitación de responsabilidad</h2>
    <p>En la medida en que la ley lo permita, FlowPass no es responsable por:</p>
    <ul class="terms-list">
      <li>El servicio, los cobros o las decisiones de tu academia.</li>
      <li>Información incorrecta o desactualizada que haya registrado tu academia.</li>
      <li>El uso que tu academia haga de tus datos fuera de la plataforma.</li>
      <li>Daños indirectos derivados del uso o de la imposibilidad de usar el portal.</li>
    </ul>
  </section>

  <section id="suspension">
    <h2 class="terms-h2 font-epoch"><span class="num">10</span> Suspensión del acceso</h2>
    <p>
      Podemos suspender el acceso de una cuenta si detectamos un uso indebido o que incumple estos
      términos. Además, si tu academia deja de usar FlowPass o da de baja tu inscripción, dejarás de
      ver su información en el portal.
    </p>
  </section>

  <section id="modificaciones">
    <h2 class="terms-h2 font-epoch"><span class="num">11</span> Modificaciones</h2>
    <p>
      Podemos actualizar estos términos. Publicaremos la nueva versión en esta página con su fecha y,
      si el cambio es importante, lo avisaremos en el portal. Seguir usándolo después de un cambio
      significa que lo aceptas.
    </p>
  </section>

  <section id="ley">
    <h2 class="terms-h2 font-epoch"><span class="num">12</span> Ley aplicable</h2>
    <p>
      Estos términos se rigen por las leyes de la República del Perú, sin perjuicio de los derechos
      que te otorgan las normas de protección al consumidor.
    </p>
  </section>

  <section id="contacto">
    <h2 class="terms-h2 font-epoch"><span class="num">13</span> Contacto</h2>
    <p>
      Para dudas sobre tu plan, tus pagos o tus clases, escribe a tu academia. Para dudas sobre el
      portal o estos términos, escríbenos:
    </p>
    <LegalContact />
  </section>
</LegalLayout>
