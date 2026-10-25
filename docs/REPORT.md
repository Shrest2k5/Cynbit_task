# Technical report: Project Blueprint for cynbit.in

## 1. Problem statement
Cynbit's site is a clean Next.js brochure with 13 case studies and a services page, but its conversion path is thin.
Observed on 25 Oct 2026 (text fetch of the live pages, no browser rendering or Lighthouse run):

- Every primary CTA ("Start discovery", "Get Started Now", "Consult our experts") leads to one form with name, email, company, industry and a free-text message.
- The form collects no service type, scope, budget or timeline, yet the section is titled "The Blueprint" and promises "a tailored strategic overview".
- The FAQ tells visitors to start by email or phone, so the form is the only self-serve path.
- Case study pages are short (one sentence each for challenge, solution, outcome, plus two stat tiles), so visitors cannot self-qualify against past work.

Hypothesis: a visitor who is not ready to write a paragraph to a stranger will complete a structured, low-effort flow, especially if value is returned before contact details are requested.

## 2. Options considered
| Idea | Verdict |
|---|---|
| AI chat discovery agent | Valid, but generic (every submission will have one), needs an LLM key, abuse and cost controls |
| Architecture visualizer for case studies | Strong later layer, but only one case study states real infrastructure (Evento: AWS Lambda, SQS); the rest would be invented |
| Live activity ticker / graph | Rejected: no real data source, so it would be fabricated proof |
| Lazy-loading | Hygiene, treated as a constraint, not the feature |
| **Structured project estimator (chosen)** | Directly fixes the weakest funnel step, measurable, no fabricated data |

## 3. Design
- Four steps, one decision per screen, answers are cards or chips (no typing until the very end).
- The blueprint is shown before any contact details are requested; sending to the team is optional and the Markdown download needs no email.
- Output: duration, cost range with fit against the visitor's own budget/timeline, phase split, suggested stack, three matching case studies linking to the real pages.

## 4. Implementation
- `src/lib/catalog.ts`: project types, features, budgets, timelines, case studies (titles and URLs from the live site).
- `src/lib/blueprint.ts`: pure functions `estimate()` and `matchCaseStudies()`.
  Weeks = (base weeks for type + feature weeks) x 1.25 overhead; cost = weeks x assumed rate with a plus/minus 20% band.
  Fit compares the band to the chosen budget and the weeks to the chosen timeline.
- `src/app/api/inquiry/route.ts`: validates every field against the catalog, recomputes the estimate server-side (the client's numbers are never trusted), forwards to an optional webhook.
- `src/components/Wizard.tsx`: client component, accessible controls (fieldsets, aria-pressed, aria-current, role=alert/status).
- 9 unit tests cover scaling, phase sums, fit flags, invalid input and ranking.
- No custom font and no client-side data fetching, so the first load ships only the wizard code.

## 5. Results
Verified in this build:
- `npm test`: 9/9 pass. `npm run lint` and `npm run build` clean.
- API checked against a running production server: valid request 200; bad email, bad intake and malformed JSON each return 400 with a clear message.

NOT yet measured (fill in before submitting):
- Lighthouse / Core Web Vitals of the deployed URL.
- Visual check on real devices (the UI has not been viewed in a browser in the build environment).
- Baseline vs prototype comparison. Defensible comparison from the audit: form asks 0 scoping questions vs 5 here; typed fields before value: 5 vs 0.
- Any conversion claim. No users were tested, so none should be made.

## 6. Limitations and next steps
- Estimates use assumed rates and a simple model; Cynbit would need to calibrate them with real project data.
- Case study tags are this prototype's classification.
- Leads are not persisted without the webhook.
- Next: calibrate the model, add the architecture visualizer for case studies with verified stacks, add analytics for step drop-off, and fix the metadata issues found in the audit (case study pages returning the homepage title/description, og:url always the root, og:image a logo SVG).
