<script lang="ts">
  import { termsSEO } from "$lib/config/seo";
  import LegalLayout from "$lib/components/legal/LegalLayout.svelte";
  import LegalContact from "$lib/components/legal/LegalContact.svelte";
  import { siteConfig } from "$lib/config/site";

  const sections = [
    { id: "aceptacion", num: "1", title: "Aceptación de los términos" },
    { id: "servicio", num: "2", title: "Descripción del servicio" },
    { id: "contratacion", num: "3", title: "Cómo se contrata" },
    { id: "planes", num: "4", title: "Planes y límites" },
    { id: "pagos", num: "5", title: "Pagos, renovación y reembolsos" },
    { id: "vacaciones", num: "6", title: "Temporada vacacional (solo Perú)" },
    { id: "adicionales", num: "7", title: "Servicios adicionales" },
    { id: "responsabilidades", num: "8", title: "Responsabilidades del usuario" },
    { id: "propiedad-intelectual", num: "9", title: "Propiedad intelectual" },
    { id: "datos", num: "10", title: "Propiedad y tratamiento de los datos" },
    { id: "cancelacion", num: "11", title: "Cancelación y suspensión" },
    { id: "responsabilidad", num: "12", title: "Limitación de responsabilidad" },
    { id: "modificaciones", num: "13", title: "Cambios en precios, planes y términos" },
    { id: "ley", num: "14", title: "Ley aplicable" },
    { id: "contacto", num: "15", title: "Contacto" },
  ];

  // Accesos del equipo: los mismos de pricingData.js (teamSeats).
  const limites = [
    { plan: "Flow Pocket", limite: 30, extra: 10, maximo: 40, registrados: "400", mensajes: 100, accesos: 5 },
    { plan: "Flow Lite", limite: 80, extra: 20, maximo: 100, registrados: "1,000", mensajes: 200, accesos: 10 },
    { plan: "Flow Full", limite: 200, extra: 30, maximo: 230, registrados: "2,000", mensajes: 400, accesos: 15 },
    { plan: "Flow Ultra", limite: 350, extra: 50, maximo: 400, registrados: "3,500", mensajes: 700, accesos: 20 },
  ];

  const vacaciones = [
    { plan: "Flow Pocket", precio: "S/ 50" },
    { plan: "Flow Lite", precio: "S/ 100" },
    { plan: "Flow Full", precio: "S/ 150" },
    { plan: "Flow Ultra", precio: "S/ 200" },
  ];
</script>

<LegalLayout
  seo={termsSEO}
  path="/terminos"
  eyebrow="Legal · Academias"
  title="Términos y"
  titleGrad="condiciones"
  subtitle="Para academias y negocios que contratan FlowPass."
  lastUpdate="17 de noviembre de 2026"
  lastUpdateISO={siteConfig.legal.termsVersion}
  {sections}
>
  <section id="aceptacion">
    <h2 class="terms-h2 font-epoch"><span class="num">01</span> Aceptación de los términos</h2>
    <p>
      Al contratar y usar los servicios de <strong>FlowPass</strong> (en adelante, "la Plataforma"),
      marca operada por <strong>{siteConfig.legal.name}</strong>, con RUC {siteConfig.legal.ruc} y
      domicilio fiscal en {siteConfig.legal.address}, usted acepta estos Términos y Condiciones. Si no
      está de acuerdo con alguna parte, no debe usar nuestros servicios.
    </p>
    <p>
      <strong>Al marcar su aceptación en la Plataforma, al crear su cuenta o al activar su suscripción
      (pagando su plan o registrando su tarjeta), usted acepta estos términos de forma plena, expresa y
      vinculante</strong>,
      sin necesidad de firmar un documento físico o digital adicional.
    </p>
    <p>
      <strong>Capacidad legal:</strong> FlowPass se contrata solo por empresas y por personas mayores de
      edad. Quien contrata declara ser mayor de edad y, si lo hace a nombre de un negocio, contar con las
      facultades para obligarlo a estos términos.
    </p>
    <p>
      Si es alumno de una academia que usa FlowPass, revise los
      <a href="/alumnos/terminos">Términos para alumnos</a>.
    </p>
  </section>

  <section id="servicio">
    <h2 class="terms-h2 font-epoch"><span class="num">02</span> Descripción del servicio</h2>
    <p>
      FlowPass es un <strong>software como servicio (SaaS)</strong> para negocios que venden clases,
      planes o membresías. Permite gestionar alumnos, controlar pagos, registrar asistencias y
      automatizar la comunicación por WhatsApp.
    </p>
    <p>
      La Plataforma se ofrece "tal cual". Nos esforzamos por mantenerla disponible y funcionando bien,
      pero no garantizamos un servicio ininterrumpido o libre de errores.
    </p>
  </section>

  <section id="contratacion">
    <h2 class="terms-h2 font-epoch"><span class="num">03</span> Cómo se contrata</h2>
    <p>Toda contratación de FlowPass es una <strong>suscripción</strong>. Puede empezar de dos formas:</p>
    <div class="table-wrap">
      <table class="terms-table">
        <thead>
          <tr><th scope="col"></th><th scope="col">Por su cuenta</th><th scope="col">Con un asesor de FlowPass</th></tr>
        </thead>
        <tbody>
          <tr><td>1. Cuenta</td><td>Usted crea su cuenta en la Plataforma.</td><td>Un asesor crea y configura su cuenta.</td></tr>
          <tr><td>2. Términos</td><td>Acepta estos Términos y Condiciones.</td><td>Acepta estos Términos y Condiciones al ingresar.</td></tr>
          <tr><td>3. Suscripción</td><td>Elige su plan y lo paga con tarjeta de crédito o débito.</td><td>Registra su tarjeta de crédito o débito para activar la suscripción.</td></tr>
          <tr><td>4. Listo</td><td>Su cuenta queda activa y se cobra automáticamente en cada renovación.</td><td>Su cuenta queda activa y se cobra automáticamente en cada renovación.</td></tr>
        </tbody>
      </table>
    </div>
    <p>
      <strong>Excepción, solo Perú:</strong> puede pedir pagar su suscripción de forma manual (Yape, Plin
      o transferencia). Como esto genera carga operativa mensual para nuestro equipo, puede tener un
      cargo extra, que le informaremos antes del pago.
    </p>
    <h3>Prueba gratis de 14 días</h3>
    <p>
      Puede probar FlowPass gratis por 14 días, sin registrar tarjeta. La prueba es un plan gratuito con
      funciones limitadas:
    </p>
    <ul class="terms-list">
      <li>No incluye el portal de alumnos.</li>
      <li>No incluye el envío de mensajes de WhatsApp.</li>
      <li>No incluye la marcación de asistencia por geolocalización.</li>
      <li>Incluye soporte mínimo.</li>
    </ul>
    <p>
      Al terminar los 14 días, la Plataforma le pedirá registrar su tarjeta solo si desea seguir usándola.
      Solo entonces se activa su suscripción y se realiza el primer cobro. Si no registra su tarjeta, no se
      le cobra nada.
    </p>
  </section>

  <section id="planes">
    <h2 class="terms-h2 font-epoch"><span class="num">04</span> Planes y límites</h2>
    <p>
      Los precios, monedas, ofertas y características vigentes de cada plan, para cada país, son los
      publicados en <a href="/#precios">flow-pass.com/#precios</a>. Flow Enterprise (cadenas y negocios
      con varias sedes) se negocia con cada cliente y se rige por estos mismos términos.
    </p>
    <p>Cada plan tiene dos límites de alumnos:</p>
    <ul class="terms-list">
      <li><strong>Alumno activo:</strong> alumno que, en algún momento del mes en curso, tiene un plan de clases vigente y cuya asistencia se controla en la Plataforma. Es el que cuenta para el límite del plan.</li>
      <li><strong>Alumno registrado:</strong> todo alumno guardado en la Plataforma, esté activo, inactivo o retirado. Es el total de su base de datos. Si llega a este límite, deberá depurar la información antigua; podemos ayudarle a eliminarla de forma masiva.</li>
    </ul>
    <p>
      <strong>Ejemplo:</strong> una academia con 300 alumnos guardados, de los cuales 35 tienen un plan
      de clases vigente este mes, tiene 300 alumnos registrados y 35 alumnos activos.
    </p>
    <p>
      Además, <strong>cada plan le regala un extra de alumnos activos</strong> sobre su límite, en todos
      los países y en cualquier ciclo de pago (mensual, trimestral o anual):
    </p>
    <div class="table-wrap">
      <table class="terms-table">
        <thead>
          <tr>
            <th scope="col">Plan</th>
            <th scope="col">Límite de alumnos activos</th>
            <th scope="col">Extra de regalo</th>
            <th scope="col">Máximo de alumnos activos</th>
            <th scope="col">Límite de alumnos registrados</th>
            <th scope="col">Mensajes de WhatsApp al mes</th>
            <th scope="col">Accesos del equipo</th>
          </tr>
        </thead>
        <tbody>
          {#each limites as l}
            <tr>
              <td>{l.plan}</td>
              <td class="n">{l.limite}</td>
              <td class="n">+{l.extra}</td>
              <td class="n">{l.maximo}</td>
              <td class="n">{l.registrados}</td>
              <td class="n">{l.mensajes}</td>
              <td class="n">{l.accesos}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <p>
      <strong>Mensajes de WhatsApp al mes:</strong> cupo mensual de mensajes que puede enviar a sus
      alumnos desde la Plataforma. En Flow Enterprise se negocia con cada cliente.
    </p>
    <ul class="terms-list">
      <li><strong>Aviso:</strong> le avisaremos cuando llegue al 80 % del límite de alumnos activos de su plan.</li>
      <li><strong>Si supera el máximo:</strong> no podrá asignar nuevos planes de clases hasta cambiarse al plan que corresponda (si ya tiene Flow Ultra, a Flow Enterprise). Los alumnos que ya tienen un plan vigente no se ven afectados.</li>
      <li><strong>Accesos del equipo:</strong> la cantidad de usuarios de su equipo que pueden ingresar a la Plataforma depende del plan contratado (ver cuadro). Para tener más accesos, debe cambiar de plan.</li>
    </ul>
    <p>
      <strong>Cambio de plan:</strong> puede subir o bajar de plan cuando lo necesite. Solo debe
      solicitarlo a nuestro equipo, que gestiona el cambio de forma manual.
    </p>
    <div class="table-wrap">
      <table class="terms-table">
        <thead>
          <tr><th scope="col">Tipo de cambio</th><th scope="col">Cuándo se aplica</th><th scope="col">Costo</th></tr>
        </thead>
        <tbody>
          <tr><td>Regular (subir o bajar)</td><td>En su siguiente fecha de pago. No es inmediato.</td><td>Desde esa fecha se cobra el precio del nuevo plan.</td></tr>
          <tr><td>Inmediato (excepción)</td><td>Antes de su siguiente fecha de pago, previa conversación con un asesor comercial.</td><td>Se cobra la diferencia proporcional (prorrateo), que le comunicaremos antes de aplicar el cambio.</td></tr>
        </tbody>
      </table>
    </div>
    <p>Si necesita más capacidad que Flow Ultra, el plan que corresponde es Flow Enterprise.</p>
  </section>

  <section id="pagos">
    <h2 class="terms-h2 font-epoch"><span class="num">05</span> Pagos, renovación y reembolsos</h2>
    <ul class="terms-list">
      <li><strong>Medio de pago por defecto:</strong> toda suscripción se paga con tarjeta de crédito o débito, con cobro automático en cada renovación. Los pagos los procesa nuestra pasarela de pago, <strong>dLocal</strong>.</li>
      <li><strong>Ciclo de pago:</strong> puede pagar de forma mensual, trimestral o anual. Usted elige el ciclo y gestiona su suscripción desde la Plataforma.</li>
      <li><strong>Fuera de Perú:</strong> el único medio de pago es tarjeta de crédito o débito.</li>
      <li><strong>Solo en Perú:</strong> también puede pagar por Yape, Plin o transferencia bancaria. Estos pagos son manuales: debe hacerlos en su fecha de pago, y FlowPass puede agregar un costo extra por operación manual, que le informaremos antes del pago.</li>
      <li><strong>Datos financieros:</strong> FlowPass no guarda datos de tarjetas ni ninguna información financiera del cliente. Esa información la recibe y protege únicamente dLocal, certificada bajo el estándar PCI DSS. Si su banco rechaza la tarjeta, consulte con él o vincule otra.</li>
      <li><strong>Renovación:</strong> la fecha de pago se fija con cada cliente al contratar y es también su fecha de renovación. Como en cualquier servicio de suscripción, el plan se renueva automáticamente en esa fecha al terminar cada período.</li>
      <li><strong>Cancelación:</strong> puede cancelar su suscripción en cualquier momento desde la plataforma web, sin penalidades. No se harán nuevos cobros y mantendrá el acceso hasta el final del período ya pagado.</li>
      <li><strong>Falta de pago:</strong> tiene 7 días desde su fecha de pago para regularizar. Vencido ese plazo, la Plataforma se bloquea hasta que se pague (ver cuadro).</li>
    </ul>
    <h3>¿Qué pasa si no se realiza el pago?</h3>
    <div class="table-wrap">
      <table class="terms-table">
        <thead>
          <tr><th scope="col"></th><th scope="col">Pago con tarjeta (todos los países)</th><th scope="col">Pago manual: Yape, Plin o transferencia (solo Perú)</th></tr>
        </thead>
        <tbody>
          <tr><td>Día 0: fecha de pago</td><td>Se cobra automáticamente a la tarjeta.</td><td>Usted debe realizar el pago.</td></tr>
          <tr><td>Si falla</td><td>Por ejemplo, la tarjeta se perdió, venció, fue bloqueada o no tiene fondos.</td><td>Usted no realizó el pago.</td></tr>
          <tr><td>Días 1 al 7</td><td>Nuestro sistema reintenta el cobro una vez al día (7 intentos). Puede actualizar su tarjeta desde la Plataforma.</td><td>Tiene 7 días calendario para pagar.</td></tr>
          <tr><td>Día 8</td><td>Si ningún intento funcionó, la Plataforma se bloquea por falta de pago automático.</td><td>Si no pagó, la Plataforma se bloquea por falta de pago.</td></tr>
          <tr><td>Reactivación</td><td>Al regularizar el pago, se reactiva el acceso.</td><td>Al regularizar el pago, se reactiva el acceso.</td></tr>
        </tbody>
      </table>
    </div>
    <div class="callout">
      <strong>No hay reembolsos.</strong> Todo pago realizado, por cualquier medio, no es reembolsable.
    </div>
    <p>
      <strong>Comprobantes de pago:</strong> en Perú, los precios incluyen IGV y emitimos boleta o factura
      electrónica por cada cobro. Fuera de Perú no emitimos comprobantes electrónicos locales.
    </p>
  </section>

  <section id="vacaciones">
    <h2 class="terms-h2 font-epoch"><span class="num">06</span> Ampliación por temporada vacacional (solo Perú)</h2>
    <p>
      Solo en Perú, puede ampliar su plan durante la temporada vacacional para usarlo
      <strong>sin límite de alumnos activos en enero, febrero y marzo</strong>.
    </p>
    <div class="table-wrap">
      <table class="terms-table">
        <thead>
          <tr><th scope="col">Plan</th><th scope="col">Pago único por temporada</th></tr>
        </thead>
        <tbody>
          {#each vacaciones as v}
            <tr><td>{v.plan}</td><td class="n">{v.precio}</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
    <ul class="terms-list">
      <li><strong>Se solicita con anticipación:</strong> no es automático. Debe pedirlo a nuestro equipo antes de la temporada.</li>
      <li><strong>Pago único:</strong> se paga una sola vez por toda la temporada (no es mensual), por la pasarela de pago.</li>
      <li><strong>Solo alumnos activos:</strong> la ampliación no incrementa los mensajes de WhatsApp, los accesos del equipo ni ningún otro límite del plan.</li>
      <li><strong>Al terminar marzo:</strong> el plan vuelve a sus límites regulares. Si no lo solicitó, se aplican los límites normales del plan.</li>
      <li>FlowPass se reserva el derecho de mantener, modificar o retirar este beneficio.</li>
    </ul>
  </section>

  <section id="adicionales">
    <h2 class="terms-h2 font-epoch"><span class="num">07</span> Servicios adicionales</h2>
    <p>
      Estos servicios no están incluidos en el plan. Se cobran aparte, en soles, se configuran
      manualmente y se solicitan a nuestro equipo.
    </p>
    <div class="table-wrap">
      <table class="terms-table">
        <thead>
          <tr><th scope="col">Servicio</th><th scope="col">Precio vigente a diciembre de 2026</th></tr>
        </thead>
        <tbody>
          <tr><td>Sede adicional</td><td>S/ 30 al mes por cada sede extra</td></tr>
          <tr><td>Facturación electrónica SUNAT (solo Perú)</td><td>Para que su negocio emita boletas y facturas a sus alumnos. El precio depende de la cantidad de comprobantes y se informa al solicitarla.</td></tr>
        </tbody>
      </table>
    </div>
    <p>FlowPass se reserva el derecho de cambiar estos montos.</p>
  </section>

  <section id="responsabilidades">
    <h2 class="terms-h2 font-epoch"><span class="num">08</span> Responsabilidades del usuario</h2>
    <ul class="terms-list">
      <li>Dar información veraz y actualizada.</li>
      <li>Mantener la confidencialidad de sus credenciales. El acceso es personal e intransferible y solo debe usarlo su personal autorizado.</li>
      <li>Usar la Plataforma de acuerdo con la ley y estos términos.</li>
      <li>No intentar acceder a datos de otros usuarios ni vulnerar la seguridad del sistema.</li>
    </ul>
    <p>
      Si permite el uso indebido de sus credenciales, FlowPass no se hace responsable por las
      consecuencias, como pérdida de información, accesos indebidos o mal funcionamiento del servicio.
    </p>
    <h3>Uso de WhatsApp</h3>
    <p>Al enviar mensajes desde la Plataforma, el cliente acepta que:</p>
    <ul class="terms-list">
      <li>Respetará las políticas de WhatsApp y Meta, y no enviará spam ni mensajes no solicitados.</li>
      <li>Usará solo plantillas de mensaje aprobadas por Meta.</li>
      <li>Respetará el cupo mensual de mensajes de su plan (ver numeral 04).</li>
    </ul>
    <p>Si Meta bloquea o limita el número del cliente por incumplir sus políticas, FlowPass no se hace responsable.</p>
  </section>

  <section id="propiedad-intelectual">
    <h2 class="terms-h2 font-epoch"><span class="num">09</span> Propiedad intelectual</h2>
    <p>
      <strong>Todo el software de FlowPass le pertenece exclusivamente a {siteConfig.legal.name}.</strong>
      Esto incluye el código, el diseño, las funciones, la marca, el logo, los textos y cualquier
      desarrollo, mejora o configuración hecha sobre la Plataforma, incluso si fue creada a pedido de un
      cliente.
    </p>
    <p>
      La suscripción le da al cliente solo un derecho de uso personal, no exclusivo e intransferible,
      mientras esté vigente. No le transfiere ninguna propiedad. El cliente no puede:
    </p>
    <ul class="terms-list">
      <li>Copiar, modificar, revender, alquilar, sublicenciar o distribuir la Plataforma o parte de ella.</li>
      <li>Intentar obtener su código fuente, ni crear un producto similar a partir de ella.</li>
      <li>Usar la marca o el logo de FlowPass sin autorización por escrito.</li>
    </ul>
    <p>Los datos que el cliente ingresa siguen siendo suyos (ver numeral 10).</p>
  </section>

  <section id="datos">
    <h2 class="terms-h2 font-epoch"><span class="num">10</span> Propiedad y tratamiento de los datos</h2>
    <div class="callout">
      <strong>Los datos que usted ingresa en FlowPass son de su exclusiva propiedad.</strong>
    </div>
    <p>
      FlowPass actúa como <strong>encargado del tratamiento</strong> en los términos de la Ley N.º 29733,
      Ley de Protección de Datos Personales: procesamos los datos de sus alumnos por su cuenta y solo
      para prestarle el servicio. Solo nuestro equipo interno accede a ellos, para soporte técnico y
      mejora del servicio.
    </p>
    <p>Como <strong>titular del banco de datos</strong> de sus alumnos, usted es responsable de:</p>
    <ul class="terms-list">
      <li>Contar con la autorización de sus alumnos (o de sus padres o tutores, si son menores) para registrar y usar sus datos.</li>
      <li>Registrar solo los datos necesarios y usarlos para los fines informados, en especial la información de salud.</li>
      <li>Atender las solicitudes de acceso, rectificación, cancelación u oposición de sus alumnos. Si un alumno nos contacta, coordinaremos con usted.</li>
      <li>El uso que su negocio haga de los datos fuera de la Plataforma.</li>
    </ul>
    <p>
      No vendemos ni alquilamos sus datos, ni los compartimos con otros clientes. Solo los compartimos
      con los proveedores necesarios para operar el servicio (como la pasarela de pago o el alojamiento
      de datos), bajo confidencialidad, o cuando lo exija una autoridad competente. El detalle está en
      nuestra <a href="/privacidad">Política de privacidad</a>.
    </p>
    <p>
      <strong>Transferencia internacional de datos:</strong> para prestar el servicio, algunos proveedores
      (como la pasarela de pago dLocal o el alojamiento de datos) pueden guardar o procesar la información
      fuera de Perú. Al aceptar estos términos, usted autoriza esta transferencia. Solo trabajamos con
      proveedores que ofrecen un nivel adecuado de protección, conforme a la Ley N.º 29733.
    </p>
    <h3>Sus datos al cancelar</h3>
    <div class="table-wrap">
      <table class="terms-table">
        <thead>
          <tr><th scope="col">Situación</th><th scope="col">Qué hacemos</th></tr>
        </thead>
        <tbody>
          <tr><td>Cancela su suscripción</td><td>Guardamos sus datos por 6 meses, por si decide regresar.</td></tr>
          <tr><td>Quiere una copia de sus datos</td><td>Se la enviamos en un archivo Excel dentro de los 15 días hábiles desde su solicitud, sin importar cuánto haya usado la Plataforma. Los datos son suyos.</td></tr>
          <tr><td>Quiere que borremos todo antes</td><td>Debe solicitarlo de forma expresa y eliminamos sus datos de forma definitiva.</td></tr>
          <tr><td>Pasan 6 meses sin renovar</td><td>Eliminamos de forma definitiva los datos de las cuentas inactivas o que no renovaron su suscripción.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section id="cancelacion">
    <h2 class="terms-h2 font-epoch"><span class="num">11</span> Cancelación y suspensión</h2>
    <p>Podemos suspender o cancelar el acceso a la Plataforma si detectamos:</p>
    <ul class="terms-list">
      <li>Uso inapropiado o fraudulento del servicio.</li>
      <li>Incumplimiento de estos términos.</li>
      <li>Falta de pago después del plazo de 7 días.</li>
    </ul>
    <p>
      FlowPass también puede terminar el servicio con aviso por escrito al menos 7 días calendario antes
      de la fecha de renovación.
    </p>
  </section>

  <section id="responsabilidad">
    <h2 class="terms-h2 font-epoch"><span class="num">12</span> Limitación de responsabilidad</h2>
    <p>
      FlowPass no será responsable por daños indirectos, pérdida de datos o lucro cesante derivados del
      uso o la imposibilidad de uso de la Plataforma. Nuestra responsabilidad máxima se limita al monto
      pagado por el servicio en los últimos 12 meses.
    </p>
    <ul class="terms-list">
      <li><strong>Mantenimiento programado:</strong> cuando sea necesario hacer un mantenimiento, siempre le avisaremos con anticipación a través de la Plataforma o de sus canales de contacto.</li>
      <li><strong>Servicios de terceros:</strong> FlowPass no responde por caídas o fallas de servicios de terceros de los que depende la Plataforma, como WhatsApp y Meta, la pasarela de pago dLocal o el proveedor de servidores.</li>
      <li><strong>Fuerza mayor:</strong> FlowPass no responde por interrupciones causadas por hechos fuera de su control, como desastres naturales, cortes de energía o de internet, ataques informáticos o disposiciones de la autoridad.</li>
    </ul>
  </section>

  <section id="modificaciones">
    <h2 class="terms-h2 font-epoch"><span class="num">13</span> Cambios en precios, planes y términos</h2>
    <p>
      <strong>FlowPass se reserva el derecho de cambiar y/o actualizar en cualquier momento los precios,
      planes, características, ofertas y estos Términos y Condiciones</strong>, para todos sus planes y en
      cada país donde opera. Podemos lanzar ofertas o condiciones distintas en cada país.
    </p>
    <p>
      Los cambios se publicarán en la Plataforma o en <a href="/">flow-pass.com</a> y se aplicarán desde
      el siguiente período de pago. Al seguir usando la Plataforma, usted acepta los cambios; si no está
      de acuerdo, puede cancelar su suscripción.
    </p>
  </section>

  <section id="ley">
    <h2 class="terms-h2 font-epoch"><span class="num">14</span> Ley aplicable</h2>
    <p>
      Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa se resolverá en
      los tribunales de Lima, Perú.
    </p>
    <p>
      <strong>Validez de las cláusulas:</strong> si alguna cláusula de estos términos fuera declarada
      inválida o inaplicable, las demás seguirán vigentes.
    </p>
  </section>

  <section id="contacto">
    <h2 class="terms-h2 font-epoch"><span class="num">15</span> Contacto</h2>
    <p>
      Si tiene preguntas sobre estos términos, escríbanos desde <a href="/contacto">flow-pass.com/contacto</a>
      o a los datos de abajo.
    </p>
    <p>
      <strong>Notificaciones:</strong> enviaremos todos los avisos (cobros, cambios, mantenimientos,
      bloqueos) al correo registrado en su cuenta y a través de la Plataforma. Usted es responsable de
      mantener ese correo actualizado; un aviso enviado a ese correo se considera recibido.
    </p>
    <LegalContact showRepresentative />
  </section>
</LegalLayout>
