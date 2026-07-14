# hiresam.uk — deployment notes

## What's here
- `index.html` — the whole site, single file (styles + script inline)
- `api/chat.js` — serverless function so the live chat works safely once deployed
- This README

## Fastest path: Vercel (free tier is enough for this)

1. Create a Vercel account, install the CLI or just drag-and-drop the `site` folder
   into a new Vercel project via the dashboard ("Add New Project" → upload).
2. In the project's **Settings → Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your API key (from console.anthropic.com)
3. In `index.html`, find this line near the bottom:
   ```
   const API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
   ```
   Change it to:
   ```
   const API_ENDPOINT = '/api/chat';
   ```
   (Only needed once you deploy — the direct URL only works inside Claude.ai's
   own preview, where no key is required.)
4. Deploy. Vercel will auto-detect `api/chat.js` as a serverless function.
5. In Vercel's project settings → **Domains**, add `hiresam.uk`.
   Vercel will give you either an A record or nameservers to set.

## Pointing hiresam.uk at it (from IONOS)

In the IONOS dashboard (Domains & SSL → hiresam.uk → DNS):
- Follow whatever exact records Vercel's domain screen shows you (this changes
  slightly over time, so use what Vercel displays rather than guessing).
- Typically: an `A` record pointing to Vercel's IP, plus a `CNAME` for `www`.
- SSL is handled automatically by Vercel once the domain resolves — you don't
  need IONOS's own "Activate SSL" option if you're pointing DNS elsewhere;
  that prompt only matters if you keep the site hosted directly on IONOS.

## Netlify / Cloudflare Pages

Same idea if you'd rather use one of these instead of Vercel — deploy the
folder, add the `ANTHROPIC_API_KEY` environment variable, and both platforms
support a serverless/edge function in roughly the same shape as `api/chat.js`
(minor syntax differences — ask if you want the Netlify or Cloudflare
Workers version instead).

## Before going live
- Swap `API_ENDPOINT` as above, or the chat will silently fail once deployed.
- Double check the email `go@hiresam.uk` is actually receiving (forwarding
  set up in IONOS) before linking it anywhere public.
- Consider whether you want this indexed by search engines yet, given the
  domain name — a `robots.txt` disallowing all crawlers is one line if you'd
  rather it stay link-only for now.
