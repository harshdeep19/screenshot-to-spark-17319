export const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "HTML/CSS",
  "Frontend architecture",
  "Performance optimisation",
  "DSA",
  "Frontend system design",
  "Testing",
  "Browser fundamentals",
] as const;
export type Skill = (typeof skills)[number];
export type AssessmentResult = {
  id: string;
  skill: Skill;
  score: number;
  total: number;
  correct: number;
  weakTopics: string[];
  date: string;
  answers: number[];
};
export type Activity = { date: string; ids: string[] };
export type Profile = {
  name: string;
  interviewDate: string;
  dailyMinutes: number;
  level: string;
  companies: string;
  strong: Skill[];
  weak: Skill[];
  goal: string;
};
export const defaultProfile: Profile = {
  name: "",
  interviewDate: "",
  dailyMinutes: 60,
  level: "Intermediate",
  companies: "",
  strong: [],
  weak: [],
  goal: "Prepare for a frontend technical interview",
};
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function daysRemaining(target: string, today = dayKey()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(target)) return null;
  const date = Date.parse(`${target}T00:00:00Z`),
    now = Date.parse(`${today}T00:00:00Z`);
  return Number.isFinite(date) && Number.isFinite(now) ? Math.ceil((date - now) / 86400000) : null;
}
export function recordActivity(activity: Activity[], id: string, date = dayKey()): Activity[] {
  const entry = activity.find((a) => a.date === date);
  if (entry?.ids.includes(id)) return activity;
  return entry
    ? activity.map((a) => (a.date === date ? { ...a, ids: [...a.ids, id] } : a))
    : [...activity, { date, ids: [id] }];
}
export function learningStreak(activity: Activity[], today = dayKey()) {
  const active = new Set(activity.filter((a) => a.ids.length).map((a) => a.date));
  const date = new Date(`${today}T12:00:00`);
  if (!active.has(today)) date.setDate(date.getDate() - 1);
  let count = 0;
  while (active.has(dayKey(date))) {
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}
export function skillScores(results: AssessmentResult[]) {
  return skills.map((skill) => {
    const latest = new Map<string, AssessmentResult>();
    results.filter((r) => r.skill === skill).forEach((r) => latest.set(r.id, r));
    const items = [...latest.values()];
    return {
      skill,
      score: items.length
        ? Math.round(items.reduce((n, r) => n + r.score, 0) / items.length)
        : null,
      weakTopics: [...new Set(items.flatMap((r) => r.weakTopics))],
    };
  });
}
export function weeklyActivity(activity: Activity[], today = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - 6 + i);
    return {
      date: dayKey(date),
      label: date.toLocaleDateString("en", { weekday: "short" }),
      count: activity.find((a) => a.date === dayKey(date))?.ids.length ?? 0,
    };
  });
}
