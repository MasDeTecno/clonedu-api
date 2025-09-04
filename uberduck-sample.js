// api/uberduck-sample.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const voice = req.query.voice;
  if (!voice) return res.status(400).json({ error: 'Missing voice' });

  const API_KEY = process.env.UBERDUCK_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Server missing UBERDUCK_KEY env var' });

  try {
    const url = `https://api.uberduck.ai/v1/voices/${encodeURIComponent(voice)}`;
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
