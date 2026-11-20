import {
  skills,
  skillScores,
  daysRemaining,
  type Profile,
  type AssessmentResult,
  type Skill,
} from "./progress";
export type Milestone = {
  id: string;
  week: number;
  skill: Skill;
  title: string;
  lesson: string;
  challenge: string;
  tasks: string[];
};
const links: Record<Skill, [string, string]> = {
  JavaScript: ["javascript/the-event-loop", "debounce"],
  TypeScript: ["typescript/generics", "event-emitter"],
  React: ["react/effects-and-lifecycle", "autocomplete"],
  "HTML/CSS": ["html-css/accessibility", "tabs"],
  "Frontend architecture": ["system-design/component-architecture", "event-emitter"],
  "Performance optimisation": ["react/performance-optimization", "debounce"],
  DSA: ["javascript/objects-and-arrays", "two-sum"],
  "Frontend system design": ["system-design/data-fetching-and-caching", "autocomplete"],
  Testing: ["react/testing-react-applications", "flatten"],
  "Browser fundamentals": ["engineering/browser-architecture", "debounce"],
};
export function generateRoadmap(
  profile: Profile,
  role: string,
  results: AssessmentResult[],
  weeks: number,
  today: string,
): Milestone[] {
  const remaining = daysRemaining(profile.interviewDate, today);
  const length =
    remaining !== null && remaining >= 0
      ? Math.max(1, Math.min(weeks, Math.ceil(remaining / 7)))
      : weeks;
  const scores = skillScores(results);
  const priority = [...skills].sort((a, b) => {
    const rank = (s: Skill) =>
      (profile.weak.includes(s) ? -100 : 0) +
      (profile.strong.includes(s) ? 100 : 0) +
      (scores.find((x) => x.skill === s)?.score ?? 50) +
      ((role.includes("Senior") || role === "Tech Lead") && s.includes("design") ? -20 : 0) +
      (profile.level === "Beginner" && s === "JavaScript" ? -30 : 0);
    return rank(a) - rank(b);
  });
  return Array.from({ length }, (_, i) => {
    const skill = priority[i % priority.length] ?? "JavaScript",
      [lesson, challenge] = links[skill];
    return {
      id: `${role}-${skill}-${i}-${profile.interviewDate}-${profile.dailyMinutes}`,
      week: i + 1,
      skill,
      title: `${skill}: ${profile.level === "Beginner" ? "build the foundation" : "explain, implement, defend"}`,
      lesson,
      challenge,
      tasks: [
        `Study and annotate the linked lesson (${Math.round(profile.dailyMinutes * 0.4)} min/day)`,
        `Implement and test ${challenge.replaceAll("-", " ")} (${Math.round(profile.dailyMinutes * 0.4)} min/day)`,
        "Build one small production scenario with loading, error and cleanup handling",
        "Revise your mistakes and explain one trade-off aloud",
        `Complete a timed self-guided interview (${Math.max(5, Math.round(profile.dailyMinutes * 0.2))} min)`,
      ],
    };
  });
}
