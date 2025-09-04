// api/uberduck-voices.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = process.env.UBERDUCK_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Server missing UBERDUCK_KEY env var' });

  try {
    const params = new URLSearchParams();
    if (req.query.tag) params.set('tag', req.query.tag);
    if (req.query.language) params.set('language', req.query.language);
    if (req.query.limit) params.set('limit', req.query.limit);

    const url = 'https://api.uberduck.ai/v1/voices' + (params.toString() ? ('?' + params.toString()) : '');

    const r = await fetch(url, { headers: { 'Authorization': 'Bearer ' + API_KEY } });
    if (!r.ok) {
      const txt = await r.text();
      return res.status(r.status).json({ error: txt });
    }
    const j = await r.json();
    return res.status(200).json(j);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
