// src/lib/config/seo.ts
import { siteConfig } from './site';

export interface SEOPage {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

// Fallback global — usado si una página no define su propio SEO.
// Se mantiene amplio (incluye membresías + verticales típicas + geografía)
// para maximizar cobertura semántica en buscadores tradicionales y LLMs.
export const defaultSEO: SEOPage = {
  title: 'FlowPass · Software para membresías, academias y negocios',
  description:
    'FlowPass: SaaS para academias, gimnasios y negocios de membresías en Perú y México. Alumnos, cobros y WhatsApp oficial. Sin permanencia.',
  keywords:
    'software para academias, software de membresías, sistema de suscripciones, software para gimnasios, software para barbería, gestión de alumnos, cobros recurrentes, recordatorios WhatsApp, software academias Perú, software academias México, software academias Latinoamérica, CRM academias, gestión de asistencia QR',
  image: `${siteConfig.url}/og-image.png`,
  ogType: 'website'
};

// SEO específico para la página de inicio.
// Formato: [Marca] · [Categoría] con [Diferencial clave]  (title ≤ 60 chars)
//          [Marca]: [Qué es] + [Para quién] + [Dónde] + [Diferencial]  (description ≤ 160 chars)
export const homeSEO: SEOPage = {
  title: 'FlowPass · Software para academias y negocios de membresías',
  description:
    'FlowPass: software para academias, gimnasios y negocios de membresías en Perú, México y Latinoamérica. Cobros, asistencia y recordatorios por WhatsApp.',
  keywords: defaultSEO.keywords,
  image: defaultSEO.image,
  ogType: 'website'
};

// SEO para página About / Sobre nosotros
export const aboutSEO: SEOPage = {
  title: 'Sobre FlowPass · Quiénes somos y por qué existimos',
  description:
    'FlowPass nació en Lima en 2025: 3 fundadores que entrenaban y vieron academias llevando todo en libreta. Software simple para negocios de membresías en LATAM.',
  keywords:
    'sobre FlowPass, quiénes somos FlowPass, fundadores FlowPass, historia FlowPass, equipo FlowPass, Grecia Delgado, Angel Valenzuela, Piero Varillas, startup software academias LATAM',
  image: defaultSEO.image,
  ogType: 'website'
};

// SEO para página de términos
export const termsSEO: SEOPage = {
  title: 'Términos y Condiciones · FlowPass',
  description:
    'Términos y condiciones de FlowPass, software para academias y negocios de membresías en Perú, México y LATAM. Política de datos y uso del servicio.',
  keywords:
    'términos y condiciones flowpass, política de privacidad, acuerdo de confidencialidad, condiciones software academias',
  image: defaultSEO.image,
  ogType: 'website'
};

// SEO para términos del portal de alumnos
export const studentTermsSEO: SEOPage = {
  title: 'Términos para alumnos · FlowPass',
  description:
    'Términos de uso del portal de alumnos de FlowPass: cómo funciona tu cuenta, tu relación con tu academia y el uso del portal.',
  keywords:
    'términos alumnos flowpass, portal de alumnos, condiciones de uso app academia',
  image: defaultSEO.image,
  ogType: 'website'
};

// SEO para política de privacidad
export const privacySEO: SEOPage = {
  title: 'Política de Privacidad · FlowPass',
  description:
    'Cómo FlowPass trata los datos personales de academias y alumnos: qué datos, para qué, con quién se comparten y cómo ejercer tus derechos.',
  keywords:
    'política de privacidad flowpass, protección de datos personales, ley 29733, datos alumnos academia',
  image: defaultSEO.image,
  ogType: 'website'
};

// SEO para la página de contacto
export const contactSEO: SEOPage = {
  title: 'Contacto · FlowPass',
  description:
    'Escríbenos: formulario, correo y WhatsApp en Perú y México. FlowPass es operado por FLOWPASS PERU S.A.C., RUC 20615483487.',
  keywords: 'contacto FlowPass, FlowPass Perú, FlowPass México, soporte FlowPass',
  image: defaultSEO.image,
  ogType: 'website'
};
