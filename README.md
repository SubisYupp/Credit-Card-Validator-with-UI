# Credit Card — Wave UI

A minimal credit card landing page with a **cursor-trailing wave** inspired by the aesthetic of **bolt.new**.

**Tech stack**: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion

## Local setup

```bash
pnpm i   # or npm i / yarn
pnpm dev # or npm run dev / yarn dev
```

- Open http://localhost:3000
- The cursor should leave a glowing, wavy trail across the screen.

## Deploy to Vercel

### One‑click (recommended)
1. Create a GitHub repo and push this project (or use "Import Project" on Vercel).
2. Go to https://vercel.com/new and **Import from GitHub**.
3. Framework should auto‑detect **Next.js**. Click **Deploy**.
4. After the first build completes, you get a live URL.

### Using the CLI
```bash
npm i -g vercel
vercel   # follow prompts, link to a new or existing project
vercel --prod
```

No environment variables are required.

## Notes

- The wave effect is implemented with a full‑screen `<canvas>` that tracks the mouse and draws a ribbon with a sinusoidal offset along the path normals.
- For production, ensure the canvas is `pointer-events: none` so it doesn't block clicks.
- Tailwind config and a subtle gradient background are set up to evoke a *bolt.new*-style vibe (dark, minimal, neon accents).

---
MIT
