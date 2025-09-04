// api/uberduck.js
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { voice, text, output_format } = req.body || {};
  if (!voice || !text) return res.status(400).json({ error: 'Missing voice or text' });

  const API_KEY = process.env.UBERDUCK_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Server missing UBERDUCK_KEY env var' });

  try {
    // Call Uberduck Text-to-Speech (v1)
    const payload = {
      text,
      voice,
    };
    if (output_format) payload.output_format = output_format;

    const r = await fetch('https://api.uberduck.ai/v1/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const contentType = r.headers.get('content-type') || '';

    if (!r.ok) {
      const txt = await r.text();
      return res.status(r.status).json({ error: txt });
    }

    if (contentType.startsWith('audio/')) {
      const arrayBuffer = await r.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.setHeader('Content-Type', contentType);
      return res.status(200).send(buffer);
    } else {
      // forward json
      const j = await r.json();
      return res.status(200).json(j);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
