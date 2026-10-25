# Cynbit Project Blueprint (prototype)

A four-step project scoping wizard proposed as an improvement to the discovery flow on https://www.cynbit.in.
Independent prototype, not affiliated with Cynbit.

## Why
The live site funnels every "Start discovery" button to one free-text form (name, email, company, industry, message)
that collects no budget, timeline or scope, despite being headed "The Blueprint". This prototype shows the visitor an
instant, indicative blueprint first and asks for contact details afterwards.

## What it does
1. Pick project type
2. Pick industry and features
3. Pick timeline and budget band
4. See duration, cost range, phases, stack and the closest Cynbit case studies, then optionally send it or download it as Markdown

## Stack
Next.js (App Router), TypeScript, Tailwind CSS, Vitest. No database, no third-party runtime services.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm test
npm run build
```

## Configuration
`INQUIRY_WEBHOOK_URL` (optional): where `/api/inquiry` POSTs the validated lead JSON (Slack, Zapier, Make, etc.).
Unset, the lead is logged to the server console.

## Honest limits
- The estimate is a transparent effort model with assumed rates (`src/lib/blueprint.ts`), not Cynbit pricing.
- Case study titles and URLs come from the live site; the type/industry/feature tags are this prototype's own classification.
- Leads are not stored; delivery depends on the webhook.
