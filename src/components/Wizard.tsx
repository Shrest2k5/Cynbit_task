"use client";

import { useMemo, useState } from "react";
import {
  BUDGETS,
  FEATURES,
  INDUSTRIES,
  PROJECT_TYPES,
  TIMELINES,
  CASE_STUDY_BASE_URL,
  type FeatureId,
  type Industry,
  type ProjectType,
} from "@/lib/catalog";
import { estimate, formatInr, matchCaseStudies, type Intake } from "@/lib/blueprint";
import { toMarkdown } from "@/lib/brief";

const STEPS = ["Project", "Scope", "Time & budget", "Blueprint"] as const;

type Draft = {
  projectType?: ProjectType;
  industry?: Industry;
  features: FeatureId[];
  budgetId?: string;
  timelineId?: string;
};

const card = "rounded-xl border border-line bg-panel p-4 text-left transition hover:border-accent";
const cardOn = "border-accent ring-1 ring-accent";

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Draft>({ features: [] });
  const [contact, setContact] = useState({ name: "", email: "", company: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const canNext =
    (step === 0 && !!d.projectType) ||
    (step === 1 && !!d.industry) ||
    (step === 2 && !!d.budgetId && !!d.timelineId);

  const intake: Intake | null =
    d.projectType && d.industry && d.budgetId && d.timelineId
      ? { projectType: d.projectType, industry: d.industry, features: d.features, budgetId: d.budgetId, timelineId: d.timelineId }
      : null;

  const result = useMemo(
    () => (intake && step === 3 ? { bp: estimate(intake), cases: matchCaseStudies(intake) } : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, d]
  );

  const toggle = (id: FeatureId) =>
    setD((p) => ({ ...p, features: p.features.includes(id) ? p.features.filter((f) => f !== id) : [...p.features, id] }));

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!intake) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, contact }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function download() {
    if (!intake || !result) return;
    const blob = new Blob([toMarkdown(intake, result.bp, result.cases)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project-blueprint.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-10" aria-label="Project blueprint wizard">
      <ol className="flex gap-2 text-xs" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined}
            className={`flex-1 border-t-2 pt-2 ${i <= step ? "border-accent text-ink" : "border-line text-muted"}`}>
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="mt-8">
        {step === 0 && (
          <fieldset>
            <legend className="text-xl font-medium">What are you building?</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PROJECT_TYPES.map((t) => (
                <button key={t.id} type="button" aria-pressed={d.projectType === t.id}
                  onClick={() => setD((p) => ({ ...p, projectType: t.id }))}
                  className={`${card} ${d.projectType === t.id ? cardOn : ""}`}>
                  <span className="block font-medium">{t.label}</span>
                  <span className="mt-1 block text-sm text-muted">{t.blurb}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <fieldset>
              <legend className="text-xl font-medium">Which industry?</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {INDUSTRIES.map((i) => (
                  <button key={i.id} type="button" aria-pressed={d.industry === i.id}
                    onClick={() => setD((p) => ({ ...p, industry: i.id }))}
                    className={`rounded-full border border-line px-4 py-2 text-sm hover:border-accent ${d.industry === i.id ? cardOn : ""}`}>
                    {i.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-xl font-medium">What does it need? <span className="text-sm text-muted">(optional)</span></legend>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <label key={f.id} className={`${card} flex cursor-pointer items-center gap-3 ${d.features.includes(f.id) ? cardOn : ""}`}>
                    <input type="checkbox" className="accent-[var(--accent)]" checked={d.features.includes(f.id)} onChange={() => toggle(f.id)} />
                    {f.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <fieldset>
              <legend className="text-xl font-medium">When do you need it?</legend>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TIMELINES.map((t) => (
                  <button key={t.id} type="button" aria-pressed={d.timelineId === t.id}
                    onClick={() => setD((p) => ({ ...p, timelineId: t.id }))}
                    className={`${card} ${d.timelineId === t.id ? cardOn : ""}`}>{t.label}</button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-xl font-medium">Budget range</legend>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BUDGETS.map((b) => (
                  <button key={b.id} type="button" aria-pressed={d.budgetId === b.id}
                    onClick={() => setD((p) => ({ ...p, budgetId: b.id }))}
                    className={`${card} ${d.budgetId === b.id ? cardOn : ""}`}>{b.label}</button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {step === 3 && result && intake && (
          <div className="space-y-8">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Estimated duration" value={`${result.bp.weeks} weeks`} fit={result.bp.timelineFit} />
              <Stat label="Indicative cost" value={`${formatInr(result.bp.costLow)} – ${formatInr(result.bp.costHigh)}`} fit={result.bp.budgetFit} />
              <Stat label="Features" value={`${d.features.length} selected`} />
            </div>

            {result.bp.notes.length > 0 && (
              <ul className="rounded-xl border border-amber-400/40 bg-amber-400/5 p-4 text-sm text-amber-200">
                {result.bp.notes.map((n) => <li key={n}>{n}</li>)}
              </ul>
            )}

            <div>
              <h2 className="text-lg font-medium">Delivery phases</h2>
              <div className="mt-3 flex h-3 overflow-hidden rounded-full" role="img"
                aria-label={result.bp.phases.map((p) => `${p.name} ${p.weeks} weeks`).join(", ")}>
                {result.bp.phases.map((p, i) => (
                  <div key={p.name} style={{ flex: p.weeks, opacity: 0.4 + i * 0.15 }} className="bg-accent" />
                ))}
              </div>
              <ul className="mt-3 grid gap-1 text-sm text-muted sm:grid-cols-2">
                {result.bp.phases.map((p) => <li key={p.name}>{p.name}: {p.weeks} wk</li>)}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-medium">Suggested stack</h2>
              <p className="mt-3 flex flex-wrap gap-2">
                {result.bp.stack.map((s) => <span key={s} className="rounded-md border border-line px-2 py-1 text-sm">{s}</span>)}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium">Similar Cynbit work</h2>
              <ul className="mt-3 space-y-2">
                {result.cases.map((c) => (
                  <li key={c.slug}>
                    <a className="block rounded-xl border border-line bg-panel p-3 hover:border-accent"
                      href={`${CASE_STUDY_BASE_URL}${c.slug}`} target="_blank" rel="noreferrer">
                      <span className="font-medium">{c.client}</span>
                      <span className="block text-sm text-muted">{c.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted">
              Indicative only. Based on a simple effort model with assumed rates, not Cynbit pricing.
              A discovery call replaces this with a real quote.
            </p>

            <div className="rounded-xl border border-line bg-panel p-5">
              <h2 className="text-lg font-medium">Send this blueprint to the team</h2>
              {status === "sent" ? (
                <p className="mt-3 text-accent" role="status">Received. Your blueprint is with the team.</p>
              ) : (
                <form onSubmit={send} className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Name" value={contact.name} onChange={(v) => setContact({ ...contact, name: v })} required />
                  <Field label="Email" type="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} required />
                  <Field label="Company (optional)" value={contact.company} onChange={(v) => setContact({ ...contact, company: v })} />
                  <Field label="Anything else? (optional)" value={contact.notes} onChange={(v) => setContact({ ...contact, notes: v })} />
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <button disabled={status === "sending"} className="rounded-lg bg-accent px-5 py-2 font-medium text-bg disabled:opacity-60">
                      {status === "sending" ? "Sending…" : "Send blueprint"}
                    </button>
                    <button type="button" onClick={download} className="rounded-lg border border-line px-5 py-2 hover:border-accent">
                      Download as Markdown
                    </button>
                  </div>
                  {status === "error" && <p className="text-sm text-red-300 sm:col-span-2" role="alert">{error}</p>}
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-between">
        <button type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0}
          className="rounded-lg border border-line px-5 py-2 disabled:invisible">Back</button>
        {step < 3 && (
          <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext}
            className="rounded-lg bg-accent px-6 py-2 font-medium text-bg disabled:opacity-40">
            {step === 2 ? "Show my blueprint" : "Continue"}
          </button>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value, fit }: { label: string; value: string; fit?: "comfortable" | "tight" | "unrealistic" }) {
  const tone = fit === "unrealistic" ? "text-red-300" : fit === "tight" ? "text-amber-300" : "text-ink";
  return (
    <div className="rounded-xl border border-line bg-panel p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${tone}`}>{value}</p>
      {fit && <p className="mt-1 text-xs text-muted">{fit === "comfortable" ? "Fits your input" : fit === "tight" ? "Tight against your input" : "Exceeds your input"}</p>}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2" />
    </label>
  );
}
