import { products as fr, type Product } from './produits';

// Grille de prix, en $ CA, avant taxes. Clé : `${slug}#${index de la grandeur}`.
// Laisser vide (undefined) tant que le prix n'est pas confirmé : le site affiche « À venir ».
export type Prix = { couvreur?: number; pdsf?: number; cout?: number };
export const prix: Record<string, Prix> = {};

const picks = [/^(modèle|model)/, /^(diamètre|outlet|conduit|duct)/, /^(longueur|length)/, /^(a, )?(largeur|width)$|^(d, )?(largeur du col|neck width)|^largeur$/, /^(a, )?(hauteur|height)( totale|overall)?$|^(overall height)$/];
export function sizes(p: Product): { key: string; label: string; custom: boolean }[] {
  const h = p.table.head.map((x) => x.toLowerCase().trim());
  const gi = h.findIndex((x) => /^(calibre|gauge)/.test(x));
  const cols: number[] = [];
  for (const re of picks) { const i = h.findIndex((x, j) => re.test(x) && !cols.includes(j)); if (i >= 0) cols.push(i); if (cols.length === 2 || (cols.length === 1 && /^(modèle|model|diamètre|outlet|conduit|duct)/.test(h[cols[0]]))) break; }
  return p.table.rows.map((r, i) => {
    const custom = /sur mesure|custom/i.test(r.join(' '));
    const vals = cols.map((c) => r[c]).filter(Boolean);
    const main = custom ? (/sur mesure/i.test(r.join(' ')) ? 'Sur mesure' : 'Custom') : vals.join(' x ');
    const label = [gi >= 0 && r[gi] ? r[gi] : '', main].filter(Boolean).join(' · ');
    return { key: `${p.slug}#${i}`, label, custom };
  });
}

// Libellés calculés à partir des données françaises (mêmes index dans les deux langues).
export function sizesFor(slug: string, lang: 'fr' | 'en') {
  const list = sizes(fr.find((p) => p.slug === slug)!);
  if (lang === 'fr') return list;
  return list.map((x) => ({ ...x, label: x.label.replace(/ po\b/g, ' in.').replace(/ pi\b/g, ' ft').replace(/Sur mesure/g, 'Custom').replace(/(\d),(\d)/g, '$1.$2') }));
}

// Dimensions numériques d'une grandeur (pour l'arrondi à la grandeur supérieure).
const num = (t: string) => { const m = t.match(/^(\d+)(?:\s+(\d+)\/(\d+))?$|^(\d+)\/(\d+)$/); if (!m) return NaN; return m[4] ? +m[4] / +m[5] : +m[1] + (m[2] ? +m[2] / +m[3] : 0); };
export function dimsOf(label: string): { dims: number[]; ga: number | null; unit: string } {
  const parts = label.split(' · ');
  const g = parts.length > 1 ? parseInt(parts[0]) : NaN;
  const main = parts[parts.length - 1];
  const dims = main.split(' x ').map((x) => num(x.replace(/\s*(po|pi|in\.|ft)\s*$/, '').trim())).filter((x) => !isNaN(x));
  const unit = /pi\b|ft\b/.test(main) ? 'pi' : 'po';
  return { dims, ga: isNaN(g) ? null : g, unit };
}
