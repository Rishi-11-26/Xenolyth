export type ProductStatus = 'live' | 'coming-soon';

export interface Product {
  slug: string;
  name: string;
  status: ProductStatus;
  tagline: string;
  description: string;
  accentColor: string;
  image?: string;
  ctaLabel: string;
  ctaHref: string;
}

export const products: Product[] = [
  {
    slug: 'sentinel',
    name: 'Sentinel',
    status: 'live',
    tagline: 'Autonomous information monitoring and system orchestration.',
    description: 'Sentinel acts on defined triggers to run continuous health checks, audit actions, and coordinate responses independently — reporting events rather than failing silently.',
    accentColor: 'var(--accent-sentinel)',
    image: '/images/sentinel-screenshot.png',
    ctaLabel: 'Explore Sentinel',
    ctaHref: '/products/sentinel'
  }
];
