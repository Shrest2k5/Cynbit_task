import { describe, expect, it } from "vitest";
import { estimate, matchCaseStudies, formatInr, type Intake } from "./blueprint";

const base: Intake = {
  projectType: "web-platform",
  industry: "events",
  features: ["realtime", "payments"],
  budgetId: "b3",
  timelineId: "t3",
};

describe("estimate", () => {
  it("scales weeks with features", () => {
    const small = estimate({ ...base, features: [] });
    const big = estimate(base);
    expect(big.weeks).toBeGreaterThan(small.weeks);
  });

  it("phase weeks sum to total weeks", () => {
    const b = estimate(base);
    expect(b.phases.reduce((s, p) => s + p.weeks, 0)).toBe(b.weeks);
  });

  it("flags an unrealistic budget", () => {
    const b = estimate({ ...base, budgetId: "b1", features: ["auth", "payments", "realtime", "ai-agent"] });
    expect(b.budgetFit).toBe("unrealistic");
    expect(b.notes.length).toBeGreaterThan(0);
  });

  it("flags an unrealistic timeline", () => {
    expect(estimate({ ...base, timelineId: "t1" }).timelineFit).toBe("unrealistic");
  });

  it("is comfortable when budget and time are generous", () => {
    const b = estimate({ ...base, budgetId: "b4", timelineId: "t4" });
    expect(b.budgetFit).toBe("comfortable");
    expect(b.timelineFit).toBe("comfortable");
  });

  it("rejects invalid ids", () => {
    expect(() => estimate({ ...base, budgetId: "nope" })).toThrow();
  });
});

describe("matchCaseStudies", () => {
  it("ranks Evento first for events + realtime + payments", () => {
    expect(matchCaseStudies(base)[0].slug).toBe("evento-ticketing-scalability");
  });

  it("returns at most the limit and no zero scores", () => {
    const r = matchCaseStudies(base, 2);
    expect(r.length).toBeLessThanOrEqual(2);
    expect(r.every((c) => c.score > 0)).toBe(true);
  });
});

describe("formatInr", () => {
  it("formats lakhs", () => {
    expect(formatInr(1_200_000)).toBe("₹12 lakh");
    expect(formatInr(450_000)).toBe("₹4.5 lakh");
  });
});
