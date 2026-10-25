import { NextResponse } from "next/server";
import { BUDGETS, FEATURES, INDUSTRIES, PROJECT_TYPES, TIMELINES } from "@/lib/catalog";
import { estimate, type Intake } from "@/lib/blueprint";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseIntake(raw: unknown): Intake | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const ok =
    PROJECT_TYPES.some((t) => t.id === r.projectType) &&
    INDUSTRIES.some((i) => i.id === r.industry) &&
    BUDGETS.some((b) => b.id === r.budgetId) &&
    TIMELINES.some((t) => t.id === r.timelineId) &&
    Array.isArray(r.features) &&
    r.features.every((f) => FEATURES.some((x) => x.id === f));
  return ok ? (r as unknown as Intake) : null;
}

export async function POST(req: Request) {
  let body: { intake?: unknown; contact?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const intake = parseIntake(body.intake);
  if (!intake) return NextResponse.json({ error: "Invalid project details" }, { status: 400 });

  const name = clip(body.contact?.name, 100);
  const email = clip(body.contact?.email, 200);
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });

  // The blueprint is recomputed server-side so the stored lead never trusts client numbers.
  const blueprint = estimate(intake);
  const lead = {
    receivedAt: new Date().toISOString(),
    name,
    email,
    company: clip(body.contact?.company, 150),
    notes: clip(body.contact?.notes, 1000),
    intake,
    blueprint,
  };

  const hook = process.env.INQUIRY_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    } catch (e) {
      console.error("inquiry webhook failed", e);
      return NextResponse.json({ error: "Could not deliver your inquiry. Please try again." }, { status: 502 });
    }
  } else {
    console.log("inquiry", JSON.stringify(lead));
  }

  return NextResponse.json({ ok: true });
}
