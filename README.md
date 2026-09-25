<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a405aa30-61e9-41cb-807f-a3788df578ac

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

The app deploys to Vercel as a Vite static build plus one serverless function:

- **Framework preset:** Vite (auto-detected; also pinned in `vercel.json`).
- **Build command:** `vite build` · **Output directory:** `dist`.
- **API:** `POST /api/simplify-prescription` is served by `api/simplify-prescription.ts`
  (a Vercel Serverless Function) in production. Locally, the same route is handled
  by the dev-only middleware in `vite.config.ts`, so `npm run dev` still works.
- **Required environment variable:** set `GEMINI_API_KEY` in
  Vercel → Project → Settings → Environment Variables. Without it, the API returns
  safe localized fallback guidance instead of a real reading of the label.
