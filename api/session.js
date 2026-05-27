import { Redis } from '@upstash/redis';

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing session id' });

  if (req.method === 'GET') {
    const data = await kv.get(`session:${id}`);
    return res.status(200).json({ checked: data ?? {} });
  }

  if (req.method === 'POST') {
    const { checked } = req.body;
    await kv.set(`session:${id}`, checked, { ex: 60 * 60 * 24 * 365 });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
