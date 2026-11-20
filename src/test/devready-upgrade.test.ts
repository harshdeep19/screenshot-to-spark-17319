import { describe, expect, it } from "vitest";
import { assessments, scoreAssessment } from "@/lib/devready/assessments";
import {
  dayKey,
  daysRemaining,
  learningStreak,
  recordActivity,
  skillScores,
  defaultProfile,
} from "@/lib/devready/progress";
import { generateRoadmap } from "@/lib/devready/roadmap";
import { gradeSamples, runnerSpecs } from "@/lib/devready/challenge-tests";
import { paths, pathProgress } from "@/lib/dev-data";
describe("Evidence-based preparation", () => {
  it("new paths start at zero and completion is actual modules only", () => {
    for (const p of paths) expect(pathProgress(p, [])).toBe(0);
  });
  it("all ten requested skills are unassessed without results", () => {
    const scores = skillScores([]);
    expect(scores).toHaveLength(10);
    expect(scores.every((s) => s.score === null)).toBe(true);
  });
  it("an assessment scores correct answers and identifies weak topics", () => {
    const a = assessments[0];
    if (!a) throw Error("Missing assessment");
    const r = scoreAssessment(a, [1, 0, 0, 0], "2026-11-20");
    expect(r.score).toBe(50);
    expect(r.correct).toBe(2);
    expect(r.weakTopics).toEqual(["Equality", "Functions"]);
  });
  it("latest assessment result replaces the previous result for readiness", () => {
    const a = assessments[0];
    if (!a) throw Error("Missing assessment");
    const results = [
      scoreAssessment(a, [0, 1, 0, 0], "2026-11-19"),
      scoreAssessment(
        a,
        a.checks.map((c) => c.correct),
        "2026-11-20",
      ),
    ];
    expect(skillScores(results).find((s) => s.skill === "JavaScript")?.score).toBe(100);
  });
  it("activity is distinct per day and supports a real streak", () => {
    const activity = recordActivity(
      recordActivity([], "lesson", "2026-11-19"),
      "lesson",
      "2026-11-20",
    );
    expect(recordActivity(activity, "lesson", "2026-11-20")).toEqual(activity);
    expect(learningStreak(activity, "2026-11-20")).toBe(2);
    expect(learningStreak(activity, "2026-11-22")).toBe(0);
  });
  it("countdown uses calendar days, with no date represented as unconfigured", () => {
    expect(daysRemaining("2026-11-27", "2026-11-20")).toBe(7);
    expect(daysRemaining("", "2026-11-20")).toBeNull();
  });
  it("weak areas lead and interview date limits weekly plans", () => {
    const plan = generateRoadmap(
      { ...defaultProfile, weak: ["TypeScript"], interviewDate: "2026-12-04" },
      "Senior Frontend Engineer",
      [],
      8,
      "2026-11-20",
    );
    expect(plan).toHaveLength(2);
    expect(plan[0]?.skill).toBe("TypeScript");
  });
  it("supported challenge grading rejects incorrect output", () => {
    const spec = runnerSpecs["two-sum"];
    if (!spec) throw Error("Missing tests");
    expect(
      gradeSamples(spec.tests, [
        [0, 1],
        [0, 1],
        [0, 2],
      ]).every((t) => t.passed),
    ).toBe(true);
    expect(gradeSamples(spec.tests, [[], [], []]).some((t) => t.passed)).toBe(false);
  });
  it("milestone IDs stay stable across study days for the same plan", () => {
    const before = generateRoadmap(defaultProfile, "Senior Frontend Engineer", [], 8, "2026-11-20");
    const after = generateRoadmap(defaultProfile, "Senior Frontend Engineer", [], 8, "2026-11-21");
    expect(before.map(m => m.id)).toEqual(after.map(m => m.id));
  });
});
