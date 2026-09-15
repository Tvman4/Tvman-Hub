/**
 * Cloudflare Worker — visitor counter + OPTIONAL Discord notify.
 *
 * Deploy this SEPARATELY. Do not commit the webhook.
 *
 * wrangler secret put DISCORD_WEBHOOK_URL
 *
 * Bind a KV namespace named COUNTS.
 *
 * The GitHub Pages site only calls:
 *   POST /hit     → bump this browser session
 *   GET  /stats   → { live, visits }
 *
 * Webhook is never sent to the browser.
 */

const ALLOWED_ORIGINS = [
  'https://tvman4.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
];

const LIVE_WINDOW_MS = 2 * 60 * 1000;      // counted "on site" for 2 minutes
const HIT_COOLDOWN_MS = 20 * 1000;         // one /hit per IP per 20s
const WEBHOOK_MIN_GAP_MS = 5 * 60 * 1000;  // Discord at most every 5 minutes
const WEBHOOK_MIN_DELTA = 5;               // or when live count jumps by 5+

function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'access-control-allow-origin': allow,
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  };
}

async function hashIp(ip) {
  const data = new TextEncoder().encode(ip + 'tvman-salt');
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

async function readState(env) {
  const raw = await env.COUNTS.get('state');
  return raw ? JSON.parse(raw) : { visits: 0, sessions: {}, lastWebhook: 0, lastLiveSent: 0 };
}

async function writeState(env, state) {
  await env.COUNTS.put('state', JSON.stringify(state));
}

function prune(sessions, now) {
  const next = {};
  for (const [id, ts] of Object.entries(sessions)) {
    if (now - ts < LIVE_WINDOW_MS) next[id] = ts;
  }
  return next;
}

async function maybeWebhook(env, live, visits, now) {
  const url = env.DISCORD_WEBHOOK_URL;
  if (!url) return;

  const state = await readState(env);
  const delta = Math.abs(live - (state.lastLiveSent || 0));
  const due = now - (state.lastWebhook || 0) >= WEBHOOK_MIN_GAP_MS;
  if (!due && delta < WEBHOOK_MIN_DELTA) return;

  state.lastWebhook = now;
  state.lastLiveSent = live;
  await writeState(env, state);

  await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: 'Tvman Hub',
      embeds: [{
        title: 'Hub traffic',
        color: 9109504,
        fields: [
          { name: 'Live (approx)', value: String(live), inline: true },
          { name: 'Visits (all time)', value: String(visits), inline: true }
        ]
      }]
    })
  }).catch(() => {});
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    const headers = cors(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);

    if (url.pathname === '/stats' && request.method === 'GET') {
      const state = await readState(env);
      const sessions = prune(state.sessions || {}, Date.now());
      return new Response(JSON.stringify({
        live: Object.keys(sessions).length,
        visits: state.visits || 0
      }), { headers });
    }

    if (url.pathname === '/hit' && request.method === 'POST') {
      const ip = request.headers.get('cf-connecting-ip') || '0';
      const id = await hashIp(ip);
      const now = Date.now();
      const state = await readState(env);
      state.sessions = prune(state.sessions || {}, now);

      const last = state.sessions[id];
      if (!last || now - last > HIT_COOLDOWN_MS) {
        if (!last) state.visits = (state.visits || 0) + 1;
        state.sessions[id] = now;
        await writeState(env, state);
      }

      const live = Object.keys(state.sessions).length;
      const visits = state.visits || 0;
      await maybeWebhook(env, live, visits, now);

      return new Response(JSON.stringify({ live, visits }), { headers });
    }

    return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers });
  }
};
