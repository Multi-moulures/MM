// Multiplicateurs appliqués au prix de la grille (calibre standard de la grandeur, fini standard).
// null = pas encore confirmé : le calculateur affiche « À venir » pour ce choix.
export const calibres: { ga: number; m: number | null }[] = [
  { ga: 26, m: 1 },
  { ga: 24, m: null },
  { ga: 22, m: null },
];
export const finis: { id: string; fr: string; en: string; m: number | null }[] = [
  { id: 'standard', fr: 'Prépeint standard', en: 'Standard prepainted', m: 1 },
  { id: 'premium', fr: 'Fini premium', en: 'Premium finish', m: null },
];
