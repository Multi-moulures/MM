import type { Lang } from '../i18n';

export type FamilyId = 'airm' | 'airm300' | 'airm100';
type Base = { id: string; fr: string; en: string };
const bases: Base[] = [
  { id: 'ajustable', fr: 'base ajustable', en: 'pitch-adjustable base' },
  { id: 'feine', fr: 'base feine', en: 'curb base' },
  { id: 'pignon', fr: 'base pignon', en: 'ridge base' },
  { id: 'plate', fr: 'base plate', en: 'flat roof base' },
];
// Modèles offerts. Ajouter une base ici quand le produit existe dans produits.ts.
const available: Record<'airm300' | 'airm100', string[]> = {
  airm300: ['ajustable', 'feine', 'pignon', 'plate'],
  airm100: ['ajustable', 'feine'],
};
export type Model = { family: 'airm300' | 'airm100'; base: string; label: string; slug?: string };
export const models = (f: 'airm300' | 'airm100', lang: Lang): Model[] =>
  bases.map((b) => ({ family: f, base: b.id, label: b[lang], slug: available[f].includes(b.id) ? `${f}-base-${b.id}` : undefined }));

export const families: Record<FamilyId, { fr: { h1: string; title: string; desc: string; lead: string }; en: { h1: string; title: string; desc: string; lead: string } }> = {
  airm: {
    fr: { h1: 'Ventilateurs de toit AirM', title: 'Ventilateurs de toit AirM : AirM300 et AirM100 | Multi-Ventilation', desc: 'Tous les ventilateurs de toit AirM : AirM300 et AirM100, en base ajustable, feine, pignon et plate. Fabriqués au Québec sur mesure, dans la couleur de votre toiture.', lead: 'Deux modèles, quatre bases. Choisissez le ventilateur et la base qui conviennent à votre toiture.' },
    en: { h1: 'AirM roof vents', title: 'AirM roof vents: AirM300 and AirM100 | Multi-Ventilation', desc: 'All AirM roof vents: AirM300 and AirM100, with pitch-adjustable, curb, ridge and flat roof bases. Custom made in Quebec, in the colour of your roof.', lead: 'Two models, four bases. Choose the vent and the base that fit your roof.' },
  },
  airm300: {
    fr: { h1: 'Ventilateur de toit AirM300', title: 'Ventilateur de toit AirM300, 4 bases | Multi-Ventilation', desc: 'AirM300, ventilateur de toit statique testé selon CAN3-A93-M82 : base ajustable, feine, pignon et plate. Fabriqué au Québec sur mesure, dans la couleur de votre toiture.', lead: 'Ventilateur de toiture haute performance, testé selon la norme CAN3-A93-M82. Offert en quatre bases.' },
    en: { h1: 'AirM300 roof vent', title: 'AirM300 roof vent, 4 bases | Multi-Ventilation', desc: 'AirM300 static roof vent, tested to CAN3-A93-M82: pitch-adjustable, curb, ridge and flat roof bases. Custom made in Quebec, in the colour of your roof.', lead: 'High-performance roof vent, tested to CAN3-A93-M82. Available with four bases.' },
  },
  airm100: {
    fr: { h1: 'Ventilateur de toit AirM100', title: 'Ventilateur de toit AirM100 | Multi-Ventilation', desc: 'AirM100, ventilateur de toit statique compact : base ajustable et base feine, bases pignon et plate bientôt disponibles. Fabriqué au Québec sur mesure.', lead: 'Ventilateur de toiture compact. Base ajustable et base feine offertes, bases pignon et plate bientôt disponibles.' },
    en: { h1: 'AirM100 roof vent', title: 'AirM100 roof vent | Multi-Ventilation', desc: 'AirM100 compact static roof vent: pitch-adjustable and curb bases, ridge and flat roof bases coming soon. Custom made in Quebec.', lead: 'Compact roof vent. Pitch-adjustable and curb bases available, ridge and flat roof bases coming soon.' },
  },
};
