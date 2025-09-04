// api/uberduck-status.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const uuid = req.query.uuid;
  if (!uuid) return res.status(400).json({ error: 'Missing uuid' });

  const API_KEY = process.env.UBERDUCK_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Server missing UBERDUCK_KEY env var' });

  try {
    // try v1 speak-status
    let endpoints = [
      `https://api.uberduck.ai/v1/speak-status?uuid=${encodeURIComponent(uuid)}`,
      `https://api.uberduck.ai/speak-status?uuid=${encodeURIComponent(uuid)}`
    ];

    for (const ep of endpoints) {
      const r = await fetch(ep, { headers: { 'Authorization': 'Bearer ' + API_KEY } });
      if (!r.ok) continue;
      const j = await r.json();
      return res.status(200).json(j);
    }
    return res.status(502).json({ error: 'No status endpoint available' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
