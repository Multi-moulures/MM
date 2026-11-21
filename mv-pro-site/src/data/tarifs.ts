// Multiplicateurs appliqués au prix de la grille (grandeur standard, calibre standard, couleur du groupe Standard).
// null = pas encore confirmé : le calculateur affiche « À venir » pour ce choix.
import raw from './couleurs.json';

export const calibres: { ga: number; m: number | null }[] = [
  { ga: 26, m: 1 },
  { ga: 24, m: null },
  { ga: 22, m: null },
];

// Groupes de prix des couleurs.
export const groupes: { id: string; fr: string; en: string; m: number | null }[] = [
  { id: 'standard', fr: 'Standard', en: 'Standard', m: 1 },
  { id: 'premium', fr: 'Premium', en: 'Premium', m: null },
];

// Série de couleurs -> groupe de prix. À confirmer par Multi-Moulures.
const premium = /PVDF|MÉTALL|WAKEFIELD|HARRYWOOD|EXPRESSENCE|MAT\b/i;
type Raw = { brand: string; kind: string; series: { series: string; colors: string[] }[] }[];
export const couleurs = (raw as Raw)
  .filter((b) => b.kind === 'steel')
  .flatMap((b) => b.series.map((s) => ({
    label: `${b.brand} · ${s.series}`,
    group: premium.test(s.series) ? 'premium' : 'standard',
    colors: s.colors,
  })));
