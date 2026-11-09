// src/lib/config/site.ts

// WhatsApp de FlowPass por país: única fuente del número. El enlace de wa.me se arma desde `raw`.
// El SaaS tiene su copia en FlowPass-new/src/lib/utils/supportWhatsapp.ts (otro repo): cambiar los dos juntos.
const whatsappContact = (code: string, flag: string, label: string, raw: string, formatted: string) => ({
  code,
  flag,
  label,
  raw,
  formatted,
  whatsapp: `https://wa.me/${raw}`
});

const PHONES = {
  PE: whatsappContact('PE', '🇵🇪', 'Perú', '51977854515', '+51 977 854 515'),
  MX: whatsappContact('MX', '🇲🇽', 'México', '525536506130', '+52 55 3650 6130')
};

export const siteConfig = {
  name: 'FlowPass',
  domain: 'flow-pass.com',
  url: 'https://flow-pass.com',
  email: 'contacto@flow-pass.com',
  // Correo del área comercial (aquí llegan los mensajes de los formularios)
  emailComercial: 'flowpass.app.contacto@gmail.com',
  // Soporte y reclamos de clientes (formulario de /contacto)
  emailSoporte: 'soporte@flow-pass.com',
  // Datos de la empresa (ficha RUC SUNAT). Se muestran en las páginas legales y el footer.
  legal: {
    name: 'FLOWPASS PERU S.A.C.',
    ruc: '20615483487',
    address: 'Av. Terpsícore 142, Urb. Olimpo Et. Uno, Ate, Lima, Perú',
    streetAddress: 'Av. Terpsícore 142, Urb. Olimpo Et. Uno',
    district: 'Ate',
    // Fecha de la última versión de /terminos. Se guarda en la cuenta al registrarse: al cambiar los términos, cambiarla.
    termsVersion: '2026-10-12'
  },
  phone: PHONES.PE.raw, // Código de país sin + (PE — default histórico)
  phoneFormatted: PHONES.PE.formatted,
  // Contacto por país — usado por el selector de banderitas en CTA
  phones: PHONES,
  social: {
    instagram: 'https://www.instagram.com/flowpass.app',
    facebook: 'https://www.facebook.com/flowpassapp/',
    tiktok: 'https://www.tiktok.com/@flowpass.app',
    whatsapp: PHONES.PE.whatsapp,
    // Perfil de Empresa en Google (opiniones). /review abre el formulario para dejar una.
    google: 'https://g.page/r/CQbO5PNnyesCEBM',
    googleReview: 'https://g.page/r/CQbO5PNnyesCEBM/review'
  },
  foundingYear: 2025,
  foundingDateISO: '2025-09',        // fecha de fundación (mes/año)
  commercialLaunchISO: '2025-11-01', // lanzamiento comercial público
  location: {
    address: 'Lima, Perú',
    country: 'PE'
  },
  // Fundadores — usado por /about y por el Person schema dentro de Organization.
  // Añadir aquí URL de LinkedIn / foto cuando estén disponibles.
  founders: [
    {
      name: 'Grecia Delgado',
      role: 'CEO · Product & Engineering',
      country: 'PE',
      background: '7+ años en fintech y SaaS en LatAm — Kushki, Xepelin, Hyperproof.',
      hobby: 'Crossfit',
      story: 'Crossfitera. Vio que las academias donde entrenaba seguían llevando todo en una libreta y decidió que había que cambiarlo.',
      linkedin: 'https://www.linkedin.com/in/gredelga/',
      photo: 'https://files.angrylabs.app/api/public/dl/EqtqdIQG?inline=true'
    },
    {
      name: 'Angel Valenzuela',
      role: 'CTO · Engineering',
      country: 'MX',
      background: '7+ años en ingeniería. Actualmente tech lead en Kushki, el unicornio de pagos de LatAm.',
      hobby: 'Salsa',
      story: 'Salsero. Puso el ojo técnico y de producto para que FlowPass fuera simple desde el primer día.',
      linkedin: 'https://www.linkedin.com/in/angelvh/',
      photo: 'https://files.angrylabs.app/api/public/dl/PQAjYENb?inline=true'
    },
    {
      name: 'Piero Varillas',
      role: 'COO · Operations',
      country: 'PE',
      background: 'MBA. Ha liderado contratos por 10M+ USD en operaciones mineras y desarrollo de negocio.',
      hobby: 'Pádel',
      story: 'Paddlero. Se unió al equipo para llevar FlowPass a más academias en Perú, México y toda LATAM.',
      linkedin: 'https://www.linkedin.com/in/pierov/',
      photo: 'https://files.angrylabs.app/api/public/dl/q3JVmBwu?inline=true'
    }
  ]
};