<script lang="ts">
  import { privacySEO } from "$lib/config/seo";
  import LegalLayout from "$lib/components/legal/LegalLayout.svelte";
  import LegalContact from "$lib/components/legal/LegalContact.svelte";

  const sections = [
    { id: "alcance", num: "1", title: "A quién aplica" },
    { id: "roles", num: "2", title: "Quién es responsable de tus datos" },
    { id: "datos", num: "3", title: "Qué datos tratamos" },
    { id: "salud", num: "4", title: "Información de salud" },
    { id: "finalidades", num: "5", title: "Para qué usamos los datos" },
    { id: "terceros", num: "6", title: "Con quién los compartimos" },
    { id: "seguridad", num: "7", title: "Cómo protegemos los datos" },
    { id: "conservacion", num: "8", title: "Cuánto tiempo los guardamos" },
    { id: "derechos", num: "9", title: "Tus derechos" },
    { id: "menores", num: "10", title: "Menores de edad" },
    { id: "almacenamiento", num: "11", title: "Cookies y almacenamiento local" },
    { id: "cambios", num: "12", title: "Cambios a esta política" },
    { id: "contacto", num: "13", title: "Contacto" },
  ];
</script>

<LegalLayout
  seo={privacySEO}
  path="/privacidad"
  title="Política de"
  titleGrad="privacidad"
  subtitle="Para academias que usan FlowPass y para sus alumnos."
  lastUpdate="28 de septiembre de 2026"
  lastUpdateISO="2026-09-28"
  {sections}
>
  <section id="alcance">
    <h2 class="terms-h2 font-epoch"><span class="num">01</span> A quién aplica</h2>
    <p>
      <strong>FlowPass</strong> es una plataforma de gestión para negocios que venden clases, planes
      o membresías (en adelante, "la academia"). Funciona como <strong>plataforma puente</strong>:
      la academia administra a sus alumnos en el panel de FlowPass, y cada alumno puede ver su
      información en el <strong>portal de alumnos</strong>.
    </p>
    <p>Esta política explica cómo se tratan los datos personales en:</p>
    <ul class="terms-list">
      <li>El panel de gestión que usan las academias y su personal.</li>
      <li>El portal y la app de alumnos.</li>
    </ul>
  </section>

  <section id="roles">
    <h2 class="terms-h2 font-epoch"><span class="num">02</span> Quién es responsable de tus datos</h2>
    <div class="callout">
      <strong>Tu academia es la responsable de tus datos.</strong> FlowPass los procesa por encargo
      de ella, para darle la plataforma.
    </div>
    <p>
      En los términos de la Ley N.º 29733, Ley de Protección de Datos Personales del Perú, y su
      reglamento:
    </p>
    <ul class="terms-list">
      <li>
        <strong>La academia</strong> es la titular del banco de datos de sus alumnos. Decide qué
        datos registra, para qué los usa y con quién los comparte, y es responsable de contar con la
        autorización de sus alumnos para hacerlo.
      </li>
      <li>
        <strong>FlowPass</strong> es el encargado del tratamiento: guarda y procesa esos datos
        siguiendo las instrucciones de la academia y solo para prestarle el servicio.
      </li>
    </ul>
    <p>
      FlowPass pone a disposición herramientas seguras, pero <strong>no controla ni puede garantizar
      el uso que cada academia haga de los datos de sus alumnos</strong> fuera de la plataforma.
      Si tienes dudas sobre cómo tu academia usa tu información, te recomendamos consultarle
      directamente.
    </p>
    <p>
      Para los datos de las propias academias (por ejemplo, el dueño o el personal que usa el
      panel), FlowPass es el responsable.
    </p>
  </section>

  <section id="datos">
    <h2 class="terms-h2 font-epoch"><span class="num">03</span> Qué datos tratamos</h2>
    <h3>De los alumnos</h3>
    <p>Los datos que la academia registra, o que tú ingresas en el portal:</p>
    <ul class="terms-list">
      <li><strong>Identificación y contacto:</strong> nombre, apellidos, número de WhatsApp, correo, documento de identidad, dirección, fecha de nacimiento y foto de perfil, según lo que registre tu academia.</li>
      <li><strong>Tu membresía:</strong> la academia o academias donde estás inscrito, sede, plan, clases, asistencias y fechas de vencimiento.</li>
      <li><strong>Pagos registrados:</strong> montos, fechas y medio de pago que la academia anota.</li>
      <li><strong>Campos adicionales</strong> que cada academia decide pedir.</li>
      <li><strong>Datos de acceso:</strong> tus credenciales para ingresar al portal, que se guardan cifradas.</li>
      <li><strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo y navegador, necesarios para que el servicio funcione y sea seguro.</li>
    </ul>
    <h3>De las academias y su personal</h3>
    <ul class="terms-list">
      <li>Nombre, correo, teléfono, rol dentro de la academia y actividad en el panel.</li>
      <li>Datos del negocio y de facturación de la suscripción a FlowPass.</li>
    </ul>
    <h3>Lo que no guardamos</h3>
    <p>
      <strong>FlowPass no guarda números de tarjetas ni datos bancarios</strong> de los alumnos.
      Cuando la academia registra un pago, solo queda anotado el monto, la fecha y el medio usado.
    </p>
  </section>

  <section id="salud">
    <h2 class="terms-h2 font-epoch"><span class="num">04</span> Información de salud</h2>
    <p>
      Algunas academias registran, de forma opcional, condiciones de salud de sus alumnos (por
      ejemplo, una lesión o una alergia) para cuidar su seguridad durante las clases. La ley
      considera esta información un <strong>dato sensible</strong>.
    </p>
    <p>
      Si tu academia la registra, es ella quien debe pedirte tu consentimiento y usarla solo para
      ese fin. En FlowPass esta información solo es visible para el personal de tu academia y nunca
      se muestra a otras academias.
    </p>
  </section>

  <section id="finalidades">
    <h2 class="terms-h2 font-epoch"><span class="num">05</span> Para qué usamos los datos</h2>
    <ul class="terms-list">
      <li>Prestar el servicio: que la academia gestione alumnos, planes, pagos y asistencias, y que cada alumno vea su información.</li>
      <li>Permitirte ingresar al portal, por ejemplo enviándote un código de verificación por WhatsApp.</li>
      <li>Enviar las comunicaciones que la academia decida mandar, como recordatorios de vencimiento.</li>
      <li>Dar soporte técnico cuando la academia o tú lo solicitan.</li>
      <li>Mantener la plataforma segura, prevenir fraudes y corregir errores.</li>
      <li>Mejorar el servicio con información agregada que no identifica a nadie.</li>
    </ul>
    <p>
      <strong>No vendemos datos personales</strong> ni los usamos para publicidad de terceros.
    </p>
  </section>

  <section id="terceros">
    <h2 class="terms-h2 font-epoch"><span class="num">06</span> Con quién los compartimos</h2>
    <p>Solo con quien hace falta para que el servicio funcione:</p>
    <ul class="terms-list">
      <li><strong>Tu academia</strong>, que es la dueña de la relación contigo.</li>
      <li>
        <strong>Proveedores que nos ayudan a operar</strong>, bajo obligaciones de confidencialidad:
        alojamiento y base de datos en la nube, mensajería (WhatsApp) y envío de correos.
      </li>
      <li>
        <strong>Unsplash</strong>, si tu academia usa una foto de su biblioteca como portada. La imagen
        se carga desde los servidores de Unsplash, que reciben datos técnicos como la dirección IP
        del dispositivo. Más información en la
        <a href="https://unsplash.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidad de Unsplash</a>.
      </li>
      <li><strong>Autoridades</strong>, cuando la ley lo exija.</li>
    </ul>
    <p>
      Algunos de estos proveedores pueden almacenar datos fuera del Perú. En esos casos exigimos
      niveles de protección adecuados, conforme a la normativa aplicable.
    </p>
  </section>

  <section id="seguridad">
    <h2 class="terms-h2 font-epoch"><span class="num">07</span> Cómo protegemos los datos</h2>
    <ul class="terms-list">
      <li>La información viaja cifrada entre tu dispositivo y nuestros servidores.</li>
      <li>Cada academia solo puede ver los datos de sus propios alumnos.</li>
      <li>Dentro de FlowPass, solo el equipo esencial tiene acceso, y únicamente para dar soporte técnico o resolver incidencias.</li>
      <li>Las credenciales de acceso se guardan cifradas; nadie de nuestro equipo puede ver tu contraseña.</li>
    </ul>
    <p>
      Ningún sistema es infalible, pero trabajamos de forma continua para proteger la información y
      actuar rápido ante cualquier incidente.
    </p>
  </section>

  <section id="conservacion">
    <h2 class="terms-h2 font-epoch"><span class="num">08</span> Cuánto tiempo los guardamos</h2>
    <p>
      Guardamos los datos mientras la academia mantenga su cuenta en FlowPass y los necesite para su
      relación contigo. Si pides que se eliminen tus datos, la academia puede solicitarlo o podemos
      ayudarla a hacerlo. Cuando una academia deja FlowPass, sus datos se eliminan o anonimizan en un
      plazo razonable, salvo que la ley exija conservarlos por más tiempo.
    </p>
  </section>

  <section id="derechos">
    <h2 class="terms-h2 font-epoch"><span class="num">09</span> Tus derechos</h2>
    <p>
      Puedes solicitar el <strong>acceso, rectificación, cancelación u oposición</strong> al
      tratamiento de tus datos (derechos ARCO), así como retirar tu consentimiento.
    </p>
    <ul class="terms-list">
      <li>
        <strong>Si eres alumno:</strong> escribe primero a tu academia, que es la responsable de tus
        datos. Si prefieres, puedes contactarnos a nosotros: te ayudaremos y coordinaremos tu
        solicitud con la academia.
      </li>
      <li>
        <strong>Si eres una academia o parte de su personal:</strong> escríbenos directamente.
      </li>
    </ul>
    <p>
      Si consideras que no se atendió tu solicitud, puedes acudir a la Autoridad Nacional de
      Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos.
    </p>
  </section>

  <section id="menores">
    <h2 class="terms-h2 font-epoch"><span class="num">10</span> Menores de edad</h2>
    <p>
      Muchas academias tienen alumnos menores de edad. En esos casos, sus datos los registra la
      academia o su padre, madre o tutor, quien debe haber dado su autorización. Un mismo número de
      WhatsApp puede tener varios perfiles (por ejemplo, un padre con dos hijos inscritos).
    </p>
  </section>

  <section id="almacenamiento">
    <h2 class="terms-h2 font-epoch"><span class="num">11</span> Cookies y almacenamiento local</h2>
    <p>
      El portal guarda en tu dispositivo lo necesario para funcionar: tu sesión y la marca de tu
      academia (logo y colores), para que cargue rápido. No usamos cookies publicitarias.
    </p>
  </section>

  <section id="cambios">
    <h2 class="terms-h2 font-epoch"><span class="num">12</span> Cambios a esta política</h2>
    <p>
      Podemos actualizar esta política cuando cambie el servicio o la ley. Publicaremos la nueva
      versión en esta página con su fecha de actualización y, si el cambio es importante, lo
      avisaremos a través de la plataforma.
    </p>
  </section>

  <section id="contacto">
    <h2 class="terms-h2 font-epoch"><span class="num">13</span> Contacto</h2>
    <p>Para consultas sobre privacidad o para ejercer tus derechos, escríbenos:</p>
    <LegalContact />
  </section>
</LegalLayout>
