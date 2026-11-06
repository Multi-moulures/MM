import { products as productsFr, categories as categoriesFr, type Product } from './data/produits';
import { productsEn, categoriesEn } from './data/produits-en';
import { faq as faqFr } from './data/site';

export type Lang = 'fr' | 'en';
export const langOf = (path: string): Lang => (path === '/en' || path.startsWith('/en/') ? 'en' : 'fr');

export const routes = {
  home: { fr: '/', en: '/en/' },
  products: { fr: '/produits/', en: '/en/products/' },
  quote: { fr: '/demander-un-prix/', en: '/en/get-a-quote/' },
  resellers: { fr: '/revendeurs/', en: '/en/resellers/' },
  faq: { fr: '/faq/', en: '/en/faq/' },
};
export const productUrl = (slug: string, lang: Lang) => routes.products[lang] + slug + '/';

export function altPath(path: string): string {
  const from = langOf(path), to: Lang = from === 'fr' ? 'en' : 'fr';
  for (const r of Object.values(routes)) if (r[from] === path) return r[to];
  if (path.startsWith(routes.products[from])) return routes.products[to] + path.slice(routes.products[from].length);
  return routes.home[to];
}

export const getProducts = (lang: Lang): Product[] => lang === 'fr' ? productsFr : productsFr.map((p) => {
  const e = productsEn[p.slug];
  return { ...p, name: e.name, sub: e.sub, desc: e.desc, pitch: e.pitch ?? p.pitch, specs: e.specs, table: e.table, check: undefined,
    metric: { v: e.metric.v ?? p.metric.v, u: e.metric.u ?? p.metric.u, label: e.metric.label, note: e.metric.note } };
});
export const getCategories = (lang: Lang) => lang === 'fr' ? categoriesFr : categoriesFr.map((c) => ({ ...c, ...categoriesEn[c.id] }));

export const faqEn: [string, string][] = [
  ['What is your lead time?', 'Our custom ventilation products are made in 5 days, in the size and colour of your choice.'],
  ['Can you match my roof colour?', 'Yes. We fabricate our vents, caps and soffits from the same prepainted galvanized steel used by metal roofing manufacturers. We match the Ideal Roofing, Vicwest, MAC, Agway Metals and Color Steels palettes, and we can match a sample if your colour is not listed.'],
  ['Are your vents tested?', 'The AirM300 and the 480 Dome were tested to CAN3-A93-M82 (R2003) by UL Canada, an ISO/IEC 17025 accredited laboratory, for wind resistance, rain, corrosion and structural integrity.'],
  ['How much ventilation does an attic need?', 'The National Building Code of Canada generally calls for a net free ventilating area of at least 1/300 of the insulated ceiling area, split between intake (soffits) and exhaust (roof vents). Always confirm with the applicable code and your roofing manufacturer’s requirements.'],
  ['What is the warranty?', 'Lifetime warranty on manufacturing defects and 10 years on paint.'],
  ['Do you sell to resellers?', 'Yes. Distributors, building supply stores and dealers can resell our products, in Quebec and across Canada. See the Resellers page.'],
  ['I am a roofer outside Quebec. How do I order?', 'Enter your region in the quote form. We will serve you directly or refer you to a reseller near you.'],
];
export const getFaq = (lang: Lang) => (lang === 'fr' ? faqFr : faqEn);

export const t = {
  fr: {
    nav: [[routes.products.fr, 'Produits'], [routes.resellers.fr, 'Revendeurs'], [routes.faq.fr, 'FAQ']],
    quote: 'Demander un prix', switchLabel: 'EN', switchName: 'English', home: 'Accueil',
    slogan: ['Sur mesure.', 'En 5 jours.'],
    about: 'Ventilation de toiture sur mesure, fabriquée au Québec en acier galvanisé prépeint canadien. Une division de', aboutEnd: ', fabricant depuis plus de 35 ans.',
    links: 'Liens', all: 'Tous les produits', catalogue: 'Catalogue (PDF)', becomeReseller: 'Devenir revendeur', parentLink: 'Moulures sur mesure (Multi-Moulures)',
    rights: 'Tous droits réservés.', legal: 'Multi-Ventilation, une division de Multi-Moulures inc.', province: '(Québec)',
  },
  en: {
    nav: [[routes.products.en, 'Products'], [routes.resellers.en, 'Resellers'], [routes.faq.en, 'FAQ']],
    quote: 'Get a quote', switchLabel: 'FR', switchName: 'Français', home: 'Home',
    slogan: ['Custom.', 'In 5 days.'],
    about: 'Custom roof ventilation, made in Quebec from Canadian prepainted galvanized steel. A division of', aboutEnd: ', a manufacturer for over 35 years.',
    links: 'Links', all: 'All products', catalogue: 'Catalogue (PDF, French)', becomeReseller: 'Become a reseller', parentLink: 'Custom flashings (Multi-Moulures)',
    rights: 'All rights reserved.', legal: 'Multi-Ventilation, a division of Multi-Moulures inc.', province: ', Quebec',
  },
};
