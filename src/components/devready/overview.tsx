import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Flame,
  Target,
  BookOpen,
  Code2,
  Activity,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDev } from "@/lib/dev-store";
import { paths, slugify, pathProgress } from "@/lib/dev-data";
import {
  skillScores,
  learningStreak,
  weeklyActivity,
  daysRemaining,
  dayKey,
} from "@/lib/devready/progress";
import { EngineeringArt, PathCard, Progress, SectionLink } from "./common";
export function Overview() {
  const store = useDev(),
    scores = skillScores(store.results),
    assessed = scores.filter((s) => s.score !== null);
  const average = assessed.length
    ? Math.round(assessed.reduce((n, s) => n + (s.score ?? 0), 0) / assessed.length)
    : null;
  const weak = assessed.filter((s) => (s.score ?? 100) < 75),
    mastered = assessed.filter((s) => (s.score ?? 0) >= 75);
  const [lastPath, lastTopic] = store.lastLesson.split("/");
  const path = paths.find((p) => p.id === lastPath) ?? paths[0];
  const topic =
    path?.modules.find((m) => slugify(m) === lastTopic) ??
    path?.modules[0] ??
    "JavaScript fundamentals";
  const lessons = store.completed.filter((id) =>
    paths.some((p) => id.startsWith(`${p.id}/`)),
  ).length;
  const week = weeklyActivity(store.activity),
    total = week.reduce((n, d) => n + d.count, 0),
    remaining = daysRemaining(store.profile.interviewDate);
  const daily = [
    `Learn: ${topic}`,
    "Practice: implement debounce",
    "Assess: check your JavaScript foundations",
  ];
  const today = dayKey();
  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow mb-3">YOUR PREPARATION COMMAND CENTRE</div>
          <h1 className="page-title">
            {store.profile.name
              ? `Welcome back, ${store.profile.name}`
              : "Make your next role a reality."}
          </h1>
          <p className="page-subtitle">
            {store.target} · {store.profile.goal}
          </p>
        </div>
        <div className="streak">
          <Flame size={24} />
          <div>
            <strong>{learningStreak(store.activity)}-day learning streak</strong>
            {total} learning actions in the last 7 days
          </div>
        </div>
      </div>
      <section className="prep-banner">
        <div>
          <span className="badge cyan">LEARN → PRACTICE → IMPROVE</span>
          <h2>
            {store.lastLesson ? "Pick up where you left off." : "A strong foundation starts here."}
          </h2>
          <p>
            {path?.title} · {topic}
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Button asChild>
              <Link
                to="/learning-paths/$pathId/$topicId"
                params={{ pathId: path?.id ?? "javascript", topicId: slugify(topic) }}
              >
                {store.lastLesson ? "Resume learning" : "Start preparation"}
                <ArrowRight size={14} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/assessments">
                Assess your skills
                <Target size={14} />
              </Link>
            </Button>
          </div>
          <div className="max-w-sm mt-5">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Current path</span>
              <span>{path ? pathProgress(path, store.completed) : 0}% complete</span>
            </div>
            <Progress value={path ? pathProgress(path, store.completed) : 0} />
          </div>
        </div>
        <EngineeringArt />
      </section>
      <div className="overview-grid">
        {[
          {
            label: "Assessed readiness",
            value: average === null ? "—" : `${average}%`,
            caption: `${assessed.length} of 10 skills assessed`,
            icon: Target,
          },
          {
            label: "Lessons completed",
            value: String(lessons),
            caption: `${paths.reduce((n, p) => n + p.modules.length, 0)} lessons in your paths`,
            icon: BookOpen,
          },
          {
            label: "Challenges solved",
            value: String(store.solved.length),
            caption: "Supported tests passed",
            icon: Code2,
          },
          {
            label: "Weekly activity",
            value: String(total),
            caption: "Visits, checks and completed work",
            icon: Activity,
          },
        ].map((s) => (
          <div className="panel stat-card" key={s.label}>
            <div className="stat-top">
              <span>{s.label}</span>
              <s.icon size={15} />
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-caption">{s.caption}</div>
          </div>
        ))}
      </div>
      <div className="dashboard-columns">
        <div>
          <SectionLink title="Your learning paths" to="/learning-paths" />
          <div className="learning-cards">
            {paths.slice(0, 3).map((p) => (
              <PathCard key={p.id} path={p} compact />
            ))}
          </div>
          <div className="section-heading">
            <h2>Learning activity</h2>
            <span className="badge">Last 7 days</span>
          </div>
          <div className="activity-panel border-y border-border">
            <div className="activity-header">
              <div>
                <strong className="text-xl">
                  {total}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    learning actions
                  </span>
                </strong>
                <p className="text-xs text-muted-foreground mt-2">
                  {week.filter((d) => d.count).length} active days
                </p>
              </div>
              <Activity className="text-cyan" size={20} />
            </div>
            <svg
              className="activity-chart"
              viewBox="0 0 580 120"
              role="img"
              aria-label={week.map((d) => `${d.label}: ${d.count} actions`).join(", ")}
            >
              <path className="grid-line" d="M30 15h535M30 45h535M30 75h535" />
              {week.map((d, i) => {
                const height = (d.count / Math.max(1, ...week.map((x) => x.count))) * 75;
                return (
                  <g key={d.date}>
                    <rect
                      className={d.count ? "bar" : "bar-muted"}
                      x={52 + i * 76}
                      y={90 - height}
                      width="28"
                      height={Math.max(2, height)}
                      rx="3"
                    />
                    <text x={66 + i * 76} y="112" textAnchor="middle">
                      {d.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="section-heading">
            <h2>Recommended next steps</h2>
            <span className="badge">{weak.length ? "Focus your gaps" : "Build evidence"}</span>
          </div>
          <div className="border-y border-border">
            <Link to="/assessments" className="recommend-row">
              <span className="recommend-icon">
                <Target size={16} />
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-medium">
                  {weak.length
                    ? `Revisit ${weak.map((s) => s.skill).join(", ")}`
                    : "Find your starting point"}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">
                  {weak.length
                    ? weak.flatMap((s) => s.weakTopics).join(" · ")
                    : "Take a topic assessment before estimating readiness."}
                </p>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link to="/coding-arena" className="recommend-row">
              <span className="recommend-icon">
                <Code2 size={16} />
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-medium">Turn knowledge into tested code</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Practice an unfinished challenge.
                </p>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link to="/workspace" className="recommend-row">
              <span className="recommend-icon">
                <BookOpen size={16} />
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-medium">Review your saved topics</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  {store.difficult.length} marked difficult ·{" "}
                  {Object.values(store.reminders).filter((d) => d && d <= today).length} revisions
                  due
                </p>
              </div>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="dashboard-side">
          <section>
            <div className="section-heading">
              <h2>Today’s learning plan</h2>
              <span className="text-xs text-muted-foreground">~60 min</span>
            </div>
            <div className="border-y border-border py-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-3">
                <span>
                  {daily.filter((_, i) => store.checklist.includes(`daily-${today}-${i}`)).length}{" "}
                  of 3 completed
                </span>
                <span>{today}</span>
              </div>
              <Progress
                value={
                  (daily.filter((_, i) => store.checklist.includes(`daily-${today}-${i}`)).length /
                    3) *
                  100
                }
              />
              {daily.map((task, i) => (
                <label className="plan-row" key={task}>
                  <input
                    className="check-control"
                    type="checkbox"
                    checked={store.checklist.includes(`daily-${today}-${i}`)}
                    onChange={() => store.toggleCheck(`daily-${today}-${i}`)}
                  />
                  <div>
                    <h3>{task}</h3>
                    <p>{["20 min · Lesson", "30 min · Coding", "10 min · Assessment"][i]}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
          <section>
            <div className="section-heading">
              <h2>Skill readiness</h2>
              <Target size={15} className="text-cyan" />
            </div>
            <div className="border-y border-border py-4">
              <div className="flex justify-between text-xs mb-5">
                <span className="text-success">{mastered.length} strong areas</span>
                <span className="text-warning">{weak.length} need improvement</span>
              </div>
              {scores.map((s) => (
                <div className="readiness-item" key={s.skill}>
                  <div className="flex justify-between gap-2 mb-2">
                    <span>{s.skill}</span>
                    <span className={s.score === null ? "text-muted-foreground" : "text-cyan"}>
                      {s.score === null ? "Unassessed" : `${s.score}%`}
                    </span>
                  </div>
                  {s.score !== null && <Progress value={s.score} tone="cyan" />}
                </div>
              ))}
              <p className="text-[10px] leading-5 text-muted-foreground border-t border-border pt-3 mt-4">
                Based on latest topic assessments, not lesson completion. Partial coverage is not
                overall interview readiness.
              </p>
            </div>
          </section>
          <section className="countdown mt-6">
            <CalendarDays size={22} className="text-primary" />
            <h2 className="font-semibold mt-3">
              {remaining === null
                ? "Your interview timeline"
                : remaining < 0
                  ? "Interview date passed"
                  : `${remaining} days to your interview`}
            </h2>
            <p className="text-xs text-muted-foreground leading-6 mt-2">
              {remaining === null
                ? "Set a date and daily study time to plan your preparation."
                : remaining <= 7
                  ? "Prioritise weak topics, revision and timed explanations."
                  : "Balance concept depth with coding and weekly review."}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/career-roadmap">
                Plan preparation
                <ArrowRight size={13} />
              </Link>
            </Button>
          </section>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-8">
        <Button asChild variant="outline">
          <Link to="/workspace">Edit preparation goals</Link>
        </Button>
        <span className="text-xs text-muted-foreground">
          Personal progress · saved in this browser
        </span>
      </div>
    </>
  );
}
