// Configurateur partagé : produit, grandeur (ou format sur mesure), calibre, couleur.
export const soon = 'À venir', onQuote = 'Sur soumission';
export const fmt = (n) => (n == null || isNaN(n) ? soon : n.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' }));
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export async function api(path, opts = {}) {
  const r = await fetch(path, { ...opts, headers: { 'content-type': 'application/json' }, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(d.error || 'Erreur ' + r.status), { status: r.status, data: d });
  return d;
}

export function makeConfigurator(DATA, slot, onChange, init = {}) {
  const { items, cfg, prodHtml } = DATA;
  const colorHtml = cfg.colors.map((s) => `<optgroup label="${esc(s.label)}">${s.colors.map((c) => `<option value="${esc(s.label + '|' + c)}" data-g="${s.group}">${esc(c)}</option>`).join('')}</optgroup>`).join('');
  slot.innerHTML = `<label class="f-p">Produit<select name="p">${prodHtml}</select></label>
    <label>Grandeur<select name="s"></select></label>
    <label class="dA" hidden>Dimension A (po)<input name="a" type="number" min="1" step="0.125"></label>
    <label class="dB" hidden>Dimension B (po)<input name="b" type="number" min="1" step="0.125"></label>
    <label class="g">Calibre<select name="g">${cfg.gauges.map((g) => `<option value="${g.ga}">${g.ga} ga</option>`).join('')}</select></label>
    <label class="f-c">Couleur<select name="c">${colorHtml}</select></label>`;
  const $ = (n) => slot.querySelector(`[name=${n}]`);
  const item = () => items.find((x) => x.slug === $('p').value);
  const toggleDims = () => { const c = $('s').value === 'c'; slot.querySelector('.dA').hidden = !c; slot.querySelector('.dB').hidden = !c; };
  const fillSizes = () => {
    const it = item();
    $('s').innerHTML = it.quoteOnly ? `<option value="q">${onQuote}</option>` : it.sizes.map((z, i) => `<option value="${i}">${esc(z.label)}</option>`).join('') + (it.customOk ? '<option value="c">Autre format (sur mesure)</option>' : '');
    slot.querySelector('.g').hidden = !it.gauge;
    toggleDims(); syncGauge();
  };
  const chosen = () => {
    const it = item(), v = $('s').value;
    if (it.quoteOnly) return { it, z: null };
    if (v !== 'c') return { it, z: it.sizes[+v] || it.sizes[0], rounded: false };
    const a = parseFloat($('a').value), b = parseFloat($('b').value);
    if (!(a > 0 && b > 0)) return { it, z: null, pending: true };
    const fit = it.sizes.filter((z) => z.dims[0] >= a && z.dims[1] >= b).sort((x, y) => x.dims[0] * x.dims[1] - y.dims[0] * y.dims[1]);
    return { it, z: fit[0] || null, rounded: true, tooBig: !fit.length, req: `${a} x ${b} po` };
  };
  const syncGauge = () => { const z = chosen().z; if (z && z.ga) $('g').value = String(z.ga); };
  const group = () => $('c').selectedOptions[0]?.dataset.g || 'standard';
  const gm = (ga) => cfg.gauges.find((g) => g.ga === ga)?.m ?? null;
  // field : 'p' (PDSF), 'k' (coût de base), 'c' (prix couvreur)
  const price = (field) => {
    const s = chosen(); if (!s.z) return null;
    const base = s.z[field]; if (base == null) return null;
    let m = 1;
    if (s.it.gauge && s.z.ga) { const sel = +$('g').value; if (sel !== s.z.ga) { const a = gm(sel), b = gm(s.z.ga); if (a == null || b == null) return null; m *= a / b; } }
    const g = cfg.groups.find((x) => x.id === group()); if (!g || g.m == null) return null; m *= g.m;
    return Math.round(base * m * 100) / 100;
  };
  const color = () => ($('c').value || '').split('|')[1] || '';
  const desc = () => {
    const s = chosen(), parts = [s.it.name];
    if (s.rounded && s.req) parts.push(`${s.req} (format standard ${s.z ? s.z.label : 'hors grille'})`); else if (s.z) parts.push(s.z.label); else parts.push(onQuote);
    if (s.it.gauge) parts.push($('g').value + ' ga');
    parts.push('couleur ' + color());
    return parts.join(', ');
  };
  const status = () => { const s = chosen(); return s.it.quoteOnly ? onQuote : s.tooBig ? 'Format hors grille : sur soumission.' : s.pending ? '' : s.rounded ? `Facturé au format standard : ${s.z.label}` : ''; };
  const state = () => ({ p: $('p').value, s: $('s').value, a: $('a').value, b: $('b').value, g: $('g').value, c: $('c').value });
  $('p').addEventListener('change', () => { fillSizes(); onChange(); });
  $('s').addEventListener('change', () => { toggleDims(); syncGauge(); onChange(); });
  ['a', 'b'].forEach((n) => $(n).addEventListener('input', () => { syncGauge(); onChange(); }));
  ['g', 'c'].forEach((n) => $(n).addEventListener('change', onChange));
  if (init.p) $('p').value = init.p;
  fillSizes();
  if (init.s != null) { $('s').value = init.s; toggleDims(); }
  if (init.a) $('a').value = init.a; if (init.b) $('b').value = init.b;
  if (init.g) $('g').value = init.g; if (init.c) $('c').value = init.c;
  return { chosen, price, desc, status, state, item };
}
