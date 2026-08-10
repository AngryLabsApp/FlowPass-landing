// src/lib/config/site.ts
export const siteConfig = {
  name: 'FlowPass',
  domain: 'flow-pass.com',
  url: 'https://flow-pass.com',
  email: 'contacto@flow-pass.com',
  phone: '51977854515', // Código de país sin +
  phoneFormatted: '+51 977 854 515', // Formato legible
  social: {
    instagram: 'https://www.instagram.com/flowpass.app',
    facebook: 'https://www.facebook.com/share/17fy2RKRvB/',
    tiktok: 'https://www.tiktok.com/@flowpass.app',
    whatsapp: 'https://wa.me/+51977854515'
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