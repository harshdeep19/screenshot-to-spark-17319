import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  Clock,
  Target,
  BookOpen,
  Code2,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Zap,
  Bookmark,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDev } from "@/lib/dev-store";
import { paths } from "@/lib/dev-data";
import { EngineeringArt, PathCard, Progress, SectionLink } from "./common";
export function Overview() {
  const store = useDev();
  const plan = [
    {
      title: "Understand the JavaScript event loop",
      meta: "JavaScript Mastery · 20 min",
      tag: "Lesson",
      tone: "violet",
    },
    {
      title: "Solve: Implement debounce",
      meta: "Coding Arena · 30 min",
      tag: "Practice",
      tone: "cyan",
    },
    {
      title: "React rendering & reconciliation",
      meta: "React.js Mastery · 25 min",
      tag: "Lesson",
      tone: "violet",
    },
  ];
  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow mb-3 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-success" />
            YOUR NEXT CHAPTER STARTS HERE
          </div>
          <h1 className="page-title">
            Welcome back, Alex <span className="inline-block text-2xl">👋</span>
          </h1>
          <p className="page-subtitle">
            A little progress, every day. Let’s build the engineer you want to be.
          </p>
        </div>
        <div className="streak">
          <Flame size={24} />
          <div>
            <strong>7-day learning streak</strong>Keep the momentum going
          </div>
        </div>
      </div>
      <section className="feature-banner">
        <div>
          <span className="badge violet">
            <Sparkles size={10} />
            YOUR LEARNING JOURNEY
          </span>
          <h2>Don’t just prepare. Become ready.</h2>
          <p>
            You’re making real progress toward your next role.
            <br />
            Pick up where you left off — one concept at a time.
          </p>
          <div className="flex items-center gap-5 mt-5">
            <Button size="sm" asChild>
              <Link
                to="/learning-paths/$pathId/$topicId"
                params={{ pathId: "javascript", topicId: "the-event-loop" }}
              >
                Resume learning
                <ArrowRight size={13} />
              </Link>
            </Button>
            <span className="text-[10px] text-muted-foreground hidden sm:flex items-center gap-1">
              <Clock size={11} />
              Your next lesson · 20 min
            </span>
          </div>
        </div>
        <EngineeringArt />
      </section>
      <div className="overview-grid">
        {[
          {
            label: "Overall preparation",
            value: `${38 + store.completed.length}%`,
            suffix: "",
            icon: Target,
            caption: "+6% from last week",
            tone: "text-success",
          },
          {
            label: "Lessons completed",
            value: String(24 + store.completed.filter((x) => x.includes("/")).length),
            suffix: "/ 128",
            icon: BookOpen,
            caption: "A stronger foundation, every lesson",
            tone: "text-muted-foreground",
          },
          {
            label: "Challenges solved",
            value: "18",
            suffix: "/ 86",
            icon: Code2,
            caption: "4 solved this week",
            tone: "text-cyan",
          },
          {
            label: "Learning this week",
            value: "5.5",
            suffix: `/ ${store.goal} hrs`,
            icon: Clock,
            caption: "You’re on track. Keep it up.",
            tone: "text-muted-foreground",
          },
        ].map((stat, i) => (
          <div className="panel stat-card" key={stat.label}>
            <div className="stat-top">
              <span>{stat.label}</span>
              <stat.icon size={14} />
            </div>
            <div className="stat-value">
              {stat.value}
              <span>{stat.suffix}</span>
            </div>
            {i === 0 ? (
              <>
                <Progress value={Math.min(100, 38 + store.completed.length)} />
                <div className={`stat-caption ${stat.tone} mt-3 flex items-center gap-1`}>
                  <TrendingUp size={10} />
                  {stat.caption}
                </div>
              </>
            ) : (
              <div className={`stat-caption ${stat.tone}`}>{stat.caption}</div>
            )}
          </div>
        ))}
      </div>
      <div className="dashboard-columns">
        <div>
          <SectionLink title="Continue learning" to="/learning-paths" />
          <div className="learning-cards">
            {paths.slice(0, 3).map((path) => (
              <PathCard key={path.id} path={path} compact />
            ))}
          </div>
          <div className="section-heading">
            <h2>Your learning activity</h2>
            <span className="badge">
              This week <span className="text-muted-foreground">⌄</span>
            </span>
          </div>
          <div className="panel activity-panel">
            <div className="activity-header">
              <div>
                <strong className="text-xl font-semibold">
                  5.5 <span className="text-xs font-normal text-muted-foreground">hours</span>
                </strong>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Time invested in your next chapter
                </p>
              </div>
              <span className="badge green">
                <TrendingUp size={11} /> 22% vs. last week
              </span>
            </div>
            <svg
              className="activity-chart"
              viewBox="0 0 580 120"
              role="img"
              aria-label="Weekly study hours: Monday 0.7, Tuesday 1.1, Wednesday 0.6, Thursday 1.4, Friday 1.0, Saturday 0.7, Sunday 0"
            >
              <path className="grid-line" d="M30 15h535M30 45h535M30 75h535" />
              {["1.5h", "1h", "0.5h"].map((text, i) => (
                <text key={text} x="0" y={18 + i * 30}>
                  {text}
                </text>
              ))}
              {[42, 62, 34, 82, 57, 43, 0].map((height, i) => (
                <g key={i}>
                  <rect
                    className={i === 3 ? "bar" : "bar-muted"}
                    x={52 + i * 76}
                    y={92 - height}
                    width="28"
                    height={height || 3}
                    rx="3"
                  />
                  <text x={66 + i * 76} y="115" textAnchor="middle">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </text>
                </g>
              ))}
            </svg>
            <div className="activity-footer">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Consistency beats intensity. You learned on 6 of 7 days.
            </div>
          </div>
          <SectionLink title="Picked for your next step" to="/interview-questions" />
          <div className="panel">
            <Link
              to="/interview-questions/$questionId"
              params={{ questionId: "useeffect" }}
              className="recommend-row"
            >
              <span className="recommend-icon">
                <Zap size={15} />
              </span>
              <div className="flex-1">
                <h3 className="text-[11px] font-medium">
                  Beyond useEffect: thinking in synchronization
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1">
                  React · Recommended for your skill gaps
                </p>
              </div>
              <span className="badge violet hidden sm:inline-flex">Advanced</span>
              <ArrowUpRight size={14} className="text-muted-foreground" />
            </Link>
            <Link
              to="/system-design/$problemId"
              params={{ problemId: "design-a-scalable-dashboard" }}
              className="recommend-row"
            >
              <span className="recommend-icon">
                <Network size={15} />
              </span>
              <div className="flex-1">
                <h3 className="text-[11px] font-medium">Design a scalable frontend dashboard</h3>
                <p className="text-[10px] text-muted-foreground mt-1">
                  System Design · Build your architecture intuition
                </p>
              </div>
              <span className="badge cyan hidden sm:inline-flex">Case study</span>
              <ArrowUpRight size={14} className="text-muted-foreground" />
            </Link>
          </div>
        </div>
        <div className="dashboard-side">
          <section>
            <div className="section-heading">
              <h2>Today’s learning plan</h2>
              <span className="text-[10px] text-muted-foreground">3 tasks</span>
            </div>
            <div className="panel plan-panel">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                <span>
                  {plan.filter((_, i) => store.checklist.includes(`daily-${i}`)).length} of 3
                  completed
                </span>
                <span>~75 min</span>
              </div>
              <Progress
                value={
                  (plan.filter((_, i) => store.checklist.includes(`daily-${i}`)).length / 3) * 100
                }
              />
              {plan.map((task, i) => (
                <label className="plan-row" key={task.title}>
                  <input
                    className="check-control"
                    type="checkbox"
                    checked={store.checklist.includes(`daily-${i}`)}
                    onChange={() => store.toggleCheck(`daily-${i}`)}
                  />
                  <div>
                    <h3
                      className={
                        store.checklist.includes(`daily-${i}`)
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {task.title}
                    </h3>
                    <p>{task.meta}</p>
                    <span className={`badge ${task.tone} mt-2`}>{task.tag}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>
          <section>
            <div className="section-heading">
              <h2>Interview readiness</h2>
              <Target size={14} className="text-muted-foreground" />
            </div>
            <div className="panel readiness">
              <div className="readiness-ring">
                <div className="ring">
                  <svg viewBox="0 0 80 80">
                    <circle className="ring-track" cx="40" cy="40" r="34" />
                    <circle
                      className="ring-value"
                      cx="40"
                      cy="40"
                      r="34"
                      strokeDasharray="213.6"
                      strokeDashoffset="81.2"
                    />
                  </svg>
                  <strong>
                    62<span className="sr-only">percent</span>
                  </strong>
                </div>
                <div>
                  <span className="badge cyan mb-2">Building confidence</span>
                  <p className="text-[10px] text-muted-foreground leading-5">
                    Strong foundations.
                    <br />
                    Let’s close the gaps.
                  </p>
                </div>
              </div>
              {[
                ["JavaScript", 78],
                ["React", 65],
                ["TypeScript", 42],
                ["Architecture", 38],
                ["Coding", 60],
                ["System design", 32],
                ["Communication", 70],
              ].map(([skill, value]) => (
                <div className="skill-row" key={skill}>
                  <span>{skill}</span>
                  <Progress value={Number(value)} tone={Number(value) > 60 ? "cyan" : ""} />
                  <span className="text-right">{value}%</span>
                </div>
              ))}
              <p className="text-[9px] text-muted-foreground leading-4 border-t border-border pt-3 mt-4">
                A practice-based indicator, not a prediction of interview success.
              </p>
            </div>
          </section>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/coding-arena">
            <Code2 />
            Practice coding
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/workspace">
            <Bookmark />
            Review bookmarks
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/career-roadmap">
            <Target />
            My roadmap
          </Link>
        </Button>
        <span className="badge ml-auto">Demo learning activity · saved locally</span>
      </div>
    </>
  );
}
