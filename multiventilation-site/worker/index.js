// Worker de multiventilation.ca : redirections 301, formulaire de demande de prix, puis fichiers statiques.
import { EmailMessage } from 'cloudflare:email';
import { enSlugs } from './enslugs.js';

const APEX = 'multiventilation.ca';
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

async function sendMail(env, subject, text, replyTo) {
  const from = env.MAIL_FROM || 'formulaire@multiventilation.ca';
  const to = env.MAIL_TO || 'marc@multimoulures.com';
  const enc = (s) => '=?UTF-8?B?' + btoa(unescape(encodeURIComponent(s))) + '?=';
  const body = btoa(unescape(encodeURIComponent(text))).replace(/.{76}/g, '$&\r\n');
  const raw = [
    `From: ${enc('Site Multi-Ventilation')} <${from}>`, `To: <${to}>`, `Subject: ${enc(subject)}`,
    replyTo ? `Reply-To: <${replyTo}>` : null, `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${APEX}>`, 'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', body,
  ].filter((l) => l !== null).join('\r\n');
  await env.MAIL.send(new EmailMessage(from, to, raw));
}

const clean = (v, n = 200) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);
const TYPES = { couvreur: 'Couvreur ou entrepreneur', revendeur: 'Revendeur', autre: 'Autre' };

async function lead(request, env) {
  let d;
  try { d = await request.json(); } catch { return json({ error: 'Requête invalide' }, 400); }
  if (d.site_web) return json({ ok: true }); // pot de miel : robot
  const nom = clean(d.nom), tel = clean(d.telephone, 40), ville = clean(d.ville);
  if (!nom || !tel || !ville) return json({ error: 'Champs obligatoires manquants' }, 422);
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(clean(d.courriel)) ? clean(d.courriel) : '';
  const type = TYPES[d.type] || clean(d.type);
  const qui = clean(d.entreprise) || nom;
  const text = [
    `Nouvelle demande reçue sur multiventilation.ca (${d.lang === 'en' ? 'anglais' : 'français'}).`, '',
    `Type : ${type}`, `Province : ${clean(d.province)}`, `Ville : ${ville}`, `Entreprise : ${clean(d.entreprise)}`,
    `Nom : ${nom}`, `Téléphone : ${tel}`, `Courriel : ${email}`, `Produit : ${clean(d.produit)}`,
    `Transmettre au revendeur de sa région : ${d.partage_revendeur ? 'oui' : 'non'}`, '',
    'Message :', String(d.message ?? '').slice(0, 5000), '',
    `Page : ${clean(d.page, 300)}`, `Reçue le : ${new Date().toLocaleString('fr-CA', { timeZone: 'America/Toronto' })}`,
  ].join('\n');
  try { await sendMail(env, `Demande de prix MV (${type}) : ${qui}, ${ville}`, text, email); }
  catch (e) { console.error('Courriel non envoyé', e); return json({ error: 'Envoi impossible' }, 502); }
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // www et http vers https://multiventilation.ca (sauf en développement local)
    const local = env.LOCAL === '1' || url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if (!local && (url.hostname !== APEX || url.protocol === 'http:')) {
      if (url.hostname === 'www.' + APEX || url.hostname === APEX) return Response.redirect(`https://${APEX}${url.pathname}${url.search}`, 301);
    }
    if (url.pathname === '/api/demande') {
      if (request.method !== 'POST') return json({ error: 'Méthode non permise' }, 405);
      return lead(request, env);
    }
    // Anciennes adresses anglaises (slug français) vers les nouvelles adresses anglaises
    const m = url.pathname.match(/^\/en\/products\/([^/]+)\/?$/);
    if (m && enSlugs[m[1]] && enSlugs[m[1]] !== m[1]) return Response.redirect(`${url.origin}/en/products/${enSlugs[m[1]]}/${url.search}`, 301);
    return env.ASSETS.fetch(request);
  },
};
