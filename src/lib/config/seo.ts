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

export const defaultSEO: SEOPage = {
  title: 'FlowPass | Software para academias',
  description: 'FlowPass es el software que automatiza la gestión de academias: control de alumnos, pagos, asistencias y comunicación por WhatsApp. Simplifica tu administración.',
  keywords: 'software academias, sistema academias, software qr, gestion alumnos, pagos academias, app academias, gestión escolar',
  image: `${siteConfig.url}/og-image.png`,
  ogType: 'website'
};

// SEO específico para la página de inicio
export const homeSEO: SEOPage = {
  title: 'FlowPass | Software para academias',
  description: 'Gestiona tu academia sin complicaciones: alumnos, pagos, asistencias y comunicación automática por WhatsApp. Todo en un solo lugar.',
  keywords: defaultSEO.keywords,
  image: defaultSEO.image,
  ogType: 'website'
};

// SEO para página de términos
export const termsSEO: SEOPage = {
  title: 'Términos y Condiciones | FlowPass',
  description: 'Lee los términos y condiciones de uso de FlowPass. Conoce nuestros acuerdos de confidencialidad, política de datos y condiciones del servicio.',
  keywords: 'términos y condiciones, política de privacidad, acuerdo de confidencialidad flowpass',
  image: defaultSEO.image,
  ogType: 'website'
};