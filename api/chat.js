// Vercel serverless function — proxies chat requests to the Anthropic API
// so the API key never reaches the browser.
//
// Deployment (Vercel):
// 1. Keep this file at api/chat.js in your project root (Vercel auto-detects it).
// 2. In your Vercel project settings, add an environment variable:
//      ANTHROPIC_API_KEY = <your key>
// 3. In index.html, change API_ENDPOINT to '/api/chat'.
// 4. Deploy. This endpoint will be live at https://hiresam.uk/api/chat
//
// (Netlify/Cloudflare Workers equivalents follow the same idea — hold the
// key in an environment variable, proxy the request server-side.)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, messages } = req.body || {};

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: system,
        messages: messages,
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search',
            max_uses: 3
          }
        ]
      })
    });

    const data = await anthropicRes.json();
    res.status(anthropicRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Upstream request failed' });
  }
}
