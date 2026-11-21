import { getCategories, getProducts, productUrl } from '../i18n';
import { prix, sizesFor, dimsOf } from './prix';
import { calibres, groupes, couleurs } from './tarifs';

const products = getProducts('fr');
export const categories = getCategories('fr');
export const prodGroups = categories.map((c) => ({ label: c.name, list: products.filter((p) => p.cat === c.id).map((p) => ({ slug: p.slug, name: p.name })) }));

// Données du configurateur. p = PDSF, k = coût de base (avant rabais du marchand), c = prix couvreur.
export const items = products.map((p) => {
  const all = sizesFor(p.slug, 'fr');
  const std = all.map((z) => ({ z, d: dimsOf(z.label) })).filter((x) => !x.z.custom);
  const sizes = std.map(({ z, d }) => ({ label: z.label, dims: d.dims, ga: d.ga, c: prix[z.key]?.couvreur ?? null, p: prix[z.key]?.pdsf ?? null, k: prix[z.key]?.cout ?? null }));
  const customOk = sizes.length > 0 && sizes.every((s) => s.dims.length === 2) && std.every((x) => x.d.unit === 'po');
  return { slug: p.slug, name: p.name, url: productUrl(p.slug, 'fr'), gauge: sizes.some((s) => s.ga != null), customOk, quoteOnly: sizes.length === 0, sizes };
});
export const cfg = { gauges: calibres, groups: groupes.map((g) => ({ id: g.id, label: g.fr, m: g.m })), colors: couleurs };
export const prodHtml = prodGroups.map((g) => '<optgroup label="' + g.label + '">' + g.list.map((p) => '<option value="' + p.slug + '">' + p.name + '</option>').join('') + '</optgroup>').join('');
