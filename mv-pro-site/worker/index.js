// API du portail pro Multi-Ventilation. Les pages statiques sont servies par ASSETS.
// Identité : en-tête Cloudflare Access (Cf-Access-Authenticated-User-Email).
import { EmailMessage } from 'cloudflare:email';

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS tiers (id TEXT PRIMARY KEY, name TEXT NOT NULL, pct REAL NOT NULL, sort INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS dealers (id INTEGER PRIMARY KEY AUTOINCREMENT, company TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'marchand', tier TEXT NOT NULL DEFAULT 'n1', custom_pct REAL, active INTEGER NOT NULL DEFAULT 1, address TEXT, phone TEXT, notes TEXT, created TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, dealer_id INTEGER NOT NULL, name TEXT)`,
  `CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, dealer_id INTEGER NOT NULL, number TEXT, status TEXT NOT NULL DEFAULT 'brouillon', client_name TEXT, client_phone TEXT, client_email TEXT, client_site TEXT, data TEXT NOT NULL DEFAULT '{}', total REAL DEFAULT 0, created_by TEXT, created TEXT NOT NULL, updated TEXT NOT NULL, ordered TEXT)`,
  `CREATE TABLE IF NOT EXISTS requests (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, name TEXT, company TEXT, phone TEXT, type TEXT, city TEXT, message TEXT, created TEXT NOT NULL, handled INTEGER NOT NULL DEFAULT 0)`,
  `INSERT OR IGNORE INTO tiers (id, name, pct, sort) VALUES ('n1', 'Niveau 1', 0, 1), ('n2', 'Niveau 2', 5, 2), ('n3', 'Niveau 3', 10, 3)`,
];
let ready = false;
async function init(db) {
  if (ready) return;
  for (const q of SCHEMA) await db.prepare(q).run();
  ready = true;
}

const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const now = () => new Date().toISOString();
const str = (v, n = 200) => (v == null ? null : String(v).slice(0, n).trim() || null);

// Nom d'entreprise de démo : « prénom Inc » à partir du courriel.
function demoCompany(email) {
  const local = email.split('@')[0];
  if (local.toLowerCase() === 'charles') return 'Charles "je pue" Inc.';
  const name = local.split(/[._-]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
  return `${name} Inc`;
}

async function whoami(req, env) {
  const email = (req.headers.get('cf-access-authenticated-user-email') || '').toLowerCase();
  if (!email) return null;
  const admins = (env.ADMINS || '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
  let u = await env.DB.prepare('SELECT u.email, u.dealer_id, d.company, d.type, d.tier, d.custom_pct, d.active, t.pct AS tier_pct, t.name AS tier_name FROM users u JOIN dealers d ON d.id = u.dealer_id LEFT JOIN tiers t ON t.id = d.tier WHERE u.email = ?').bind(email).first();
  // Démo : tout courriel du domaine interne obtient un compte marchand automatiquement.
  const domain = (env.DEMO_DOMAIN || '').toLowerCase();
  if (!u && domain && email.endsWith('@' + domain)) {
    const r = await env.DB.prepare('INSERT INTO dealers (company, type, tier, created) VALUES (?, ?, ?, ?)').bind(demoCompany(email), 'marchand', 'n1', now()).run();
    await env.DB.prepare('INSERT INTO users (email, dealer_id) VALUES (?, ?)').bind(email, r.meta.last_row_id).run();
    return whoami(req, env);
  }
  const pct = u ? (u.custom_pct != null ? u.custom_pct : u.tier_pct || 0) : 0;
  return { email, admin: admins.includes(email), dealer: u ? { id: u.dealer_id, company: u.company, type: u.type, tier: u.tier, tierName: u.custom_pct != null ? 'Personnalisé' : u.tier_name, pct, active: !!u.active } : null };
}

async function sendMail(env, subject, text, replyTo) {
  if (!env.MAIL) return { sent: false, reason: 'Envoi de courriel non configuré' };
  const from = env.MAIL_FROM || 'portail@multiventilation.ca';
  const to = env.MAIL_TO || 'info@multimoulures.com';
  const enc = (s) => '=?UTF-8?B?' + btoa(unescape(encodeURIComponent(s))) + '?=';
  const body = btoa(unescape(encodeURIComponent(text))).replace(/.{76}/g, '$&\r\n');
  const raw = [
    `From: ${enc('Portail Multi-Ventilation')} <${from}>`, `To: <${to}>`, `Subject: ${enc(subject)}`,
    replyTo ? `Reply-To: <${replyTo}>` : null, `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@multiventilation.ca>`, 'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', body,
  ].filter((l) => l !== null).join('\r\n');
  try { await env.MAIL.send(new EmailMessage(from, to, raw)); return { sent: true }; }
  catch (e) { return { sent: false, reason: String(e.message || e) }; }
}

const money = (n) => (n == null || isNaN(n) ? 'à venir' : n.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' }));
function orderText(q, me, data) {
  const L = [];
  L.push(`Nouvelle commande reçue par le portail pro (TEST).`, '');
  L.push(`Marchand : ${me.dealer.company}`, `Envoyée par : ${me.email}`, `Soumission : ${q.number}`, `Date : ${new Date().toLocaleString('fr-CA', { timeZone: 'America/Toronto' })}`, '');
  if (q.client_name || q.client_site) L.push(`Client du marchand : ${q.client_name || ''}`, `Chantier : ${q.client_site || ''}`, '');
  L.push('Produits :');
  (data.lines || []).forEach((l, i) => {
    L.push(`${i + 1}. ${l.desc || l.slug}`, `   Quantité : ${l.qty}   Coût marchand unitaire : ${money(l.cost)}   PDSF : ${money(l.pdsf)}`);
  });
  const unknown = (data.lines || []).some((l) => l.cost == null);
  L.push('', `Total au coût marchand : ${unknown ? 'à venir (prix non encore inscrits au portail)' : money(data.totalCost)}`);
  if (data.notes) L.push('', `Notes : ${data.notes}`);
  return L.join('\n');
}

async function api(req, env, url) {
  await init(env.DB);
  const me = await whoami(req, env);
  if (!me) return json({ error: 'Non authentifié' }, 401);
  const p = url.pathname, m = req.method;
  const body = m === 'GET' ? {} : await req.json().catch(() => ({}));

  if (p === '/api/me') return json(me);

  if (p === '/api/access-request' && m === 'POST') {
    const r = { email: me.email, name: str(body.name), company: str(body.company), phone: str(body.phone, 40), type: str(body.type, 20), city: str(body.city), message: str(body.message, 2000) };
    await env.DB.prepare('INSERT INTO requests (email, name, company, phone, type, city, message, created) VALUES (?,?,?,?,?,?,?,?)').bind(r.email, r.name, r.company, r.phone, r.type, r.city, r.message, now()).run();
    const mail = await sendMail(env, 'test de portail : demande d’accès', `Demande d’accès au portail pro.\n\nCourriel : ${r.email}\nNom : ${r.name || ''}\nEntreprise : ${r.company || ''}\nTéléphone : ${r.phone || ''}\nType : ${r.type || ''}\nVille : ${r.city || ''}\n\n${r.message || ''}`, r.email);
    return json({ ok: true, mail });
  }

  // Le reste exige un compte marchand actif (ou un administrateur).
  const isAdmin = me.admin;
  if (!me.dealer && !isAdmin) return json({ error: 'Aucun compte', needAccess: true }, 403);
  if (me.dealer && !me.dealer.active && !isAdmin) return json({ error: 'Compte désactivé', needAccess: true }, 403);

  // ---- Soumissions ----
  let mm;
  if (p === '/api/quotes' && m === 'GET') {
    const all = isAdmin && url.searchParams.get('all') === '1';
    const rs = all
      ? await env.DB.prepare('SELECT q.id, q.number, q.status, q.client_name, q.total, q.updated, q.ordered, d.company FROM quotes q JOIN dealers d ON d.id = q.dealer_id ORDER BY q.updated DESC LIMIT 500').all()
      : await env.DB.prepare('SELECT id, number, status, client_name, total, updated, ordered FROM quotes WHERE dealer_id = ? ORDER BY updated DESC LIMIT 500').bind(me.dealer?.id ?? -1).all();
    return json(rs.results);
  }
  if (p === '/api/quotes' && m === 'POST') {
    if (!me.dealer) return json({ error: 'Aucun compte marchand' }, 400);
    const t = now();
    const r = await env.DB.prepare('INSERT INTO quotes (dealer_id, created_by, created, updated, data) VALUES (?, ?, ?, ?, ?)').bind(me.dealer.id, me.email, t, t, JSON.stringify({ lines: [] })).run();
    const id = r.meta.last_row_id, number = `S-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`;
    await env.DB.prepare('UPDATE quotes SET number = ? WHERE id = ?').bind(number, id).run();
    return json({ id, number });
  }
  if ((mm = p.match(/^\/api\/quotes\/(\d+)(\/order)?$/))) {
    const id = +mm[1];
    const q = await env.DB.prepare('SELECT * FROM quotes WHERE id = ?').bind(id).first();
    if (!q || (!isAdmin && q.dealer_id !== me.dealer?.id)) return json({ error: 'Introuvable' }, 404);
    if (mm[2] && m === 'POST') {
      const data = JSON.parse(q.data || '{}');
      if (!(data.lines || []).length) return json({ error: 'La soumission ne contient aucun produit.' }, 400);
      const dealer = await env.DB.prepare('SELECT company FROM dealers WHERE id = ?').bind(q.dealer_id).first();
      const mail = await sendMail(env, `test de portail : commande ${q.number}, ${dealer.company}`, orderText(q, { email: me.email, dealer: { company: dealer.company } }, data), me.email);
      if (!mail.sent) return json({ error: 'Le courriel n’a pas pu être envoyé : ' + mail.reason }, 502);
      const t = now();
      await env.DB.prepare("UPDATE quotes SET status = 'commandée', ordered = ?, updated = ? WHERE id = ?").bind(t, t, id).run();
      return json({ ok: true });
    }
    if (m === 'GET') return json({ ...q, data: JSON.parse(q.data || '{}') });
    if (m === 'PUT') {
      if (q.ordered) return json({ error: 'Cette soumission a déjà été commandée.' }, 409);
      const st = ['brouillon', 'envoyée', 'acceptée', 'perdue'].includes(body.status) ? body.status : q.status;
      const data = JSON.stringify(body.data || {}).slice(0, 200000);
      await env.DB.prepare('UPDATE quotes SET status = ?, client_name = ?, client_phone = ?, client_email = ?, client_site = ?, data = ?, total = ?, updated = ? WHERE id = ?')
        .bind(st, str(body.client_name), str(body.client_phone, 40), str(body.client_email), str(body.client_site, 300), data, +body.total || 0, now(), id).run();
      return json({ ok: true });
    }
    if (m === 'DELETE') {
      if (q.ordered) return json({ error: 'Une soumission commandée ne peut pas être supprimée.' }, 409);
      await env.DB.prepare('DELETE FROM quotes WHERE id = ?').bind(id).run();
      return json({ ok: true });
    }
  }

  // ---- Administration ----
  if (p.startsWith('/api/admin/')) {
    if (!isAdmin) return json({ error: 'Réservé aux administrateurs' }, 403);
    if (p === '/api/admin/tiers' && m === 'GET') return json((await env.DB.prepare('SELECT * FROM tiers ORDER BY sort').all()).results);
    if (p === '/api/admin/tiers' && m === 'PUT') {
      for (const t of body.tiers || []) await env.DB.prepare('UPDATE tiers SET name = ?, pct = ? WHERE id = ?').bind(str(t.name, 40), Math.max(0, Math.min(90, +t.pct || 0)), t.id).run();
      return json({ ok: true });
    }
    if (p === '/api/admin/dealers' && m === 'GET') {
      const ds = (await env.DB.prepare('SELECT d.*, t.name AS tier_name, t.pct AS tier_pct, (SELECT COUNT(*) FROM quotes q WHERE q.dealer_id = d.id) AS quotes FROM dealers d LEFT JOIN tiers t ON t.id = d.tier ORDER BY d.company').all()).results;
      const us = (await env.DB.prepare('SELECT email, dealer_id FROM users').all()).results;
      return json(ds.map((d) => ({ ...d, emails: us.filter((u) => u.dealer_id === d.id).map((u) => u.email) })));
    }
    if (p === '/api/admin/dealers' && (m === 'POST' || m === 'PUT')) {
      const emails = String(body.emails || '').toLowerCase().split(/[\s,;]+/).filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));
      const tier = ['n1', 'n2', 'n3'].includes(body.tier) ? body.tier : 'n1';
      const custom = body.tier === 'custom' ? Math.max(0, Math.min(90, +body.custom_pct || 0)) : null;
      const vals = [str(body.company), body.type === 'couvreur' ? 'couvreur' : 'marchand', tier, custom, body.active === false ? 0 : 1, str(body.address, 300), str(body.phone, 40), str(body.notes, 2000)];
      if (!vals[0]) return json({ error: 'Le nom de l’entreprise est requis.' }, 400);
      let id = +body.id;
      if (m === 'POST') id = (await env.DB.prepare('INSERT INTO dealers (company, type, tier, custom_pct, active, address, phone, notes, created) VALUES (?,?,?,?,?,?,?,?,?)').bind(...vals, now()).run()).meta.last_row_id;
      else await env.DB.prepare('UPDATE dealers SET company = ?, type = ?, tier = ?, custom_pct = ?, active = ?, address = ?, phone = ?, notes = ? WHERE id = ?').bind(...vals, id).run();
      await env.DB.prepare('DELETE FROM users WHERE dealer_id = ?').bind(id).run();
      for (const e of emails) await env.DB.prepare('INSERT OR REPLACE INTO users (email, dealer_id) VALUES (?, ?)').bind(e, id).run();
      return json({ ok: true, id });
    }
    if (p === '/api/admin/requests' && m === 'GET') return json((await env.DB.prepare('SELECT * FROM requests ORDER BY created DESC LIMIT 200').all()).results);
  }
  return json({ error: 'Introuvable' }, 404);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/')) {
      try { return await api(req, env, url); }
      catch (e) { return json({ error: 'Erreur serveur', detail: String(e.message || e) }, 500); }
    }
    return env.ASSETS.fetch(req);
  },
};
