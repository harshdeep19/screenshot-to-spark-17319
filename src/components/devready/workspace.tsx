import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  Check,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Bookmark,
  FileText,
  Target,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDev } from "@/lib/dev-store";
import { questions, paths, companies, slugify } from "@/lib/dev-data";
import { PageHeader, Progress } from "./common";
export function InterviewStudio() {
  const store = useDev();
  const [round, setRound] = useState("JavaScript screening");
  const [company, setCompany] = useState("Amazon");
  const [answer, setAnswer] = useState("");
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [feedback, setFeedback] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [rating, setRating] = useState("Needs practice");
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);
  const question = questions[questionIndex % questions.length];
  return (
    <>
      <PageHeader
        label="Prepare with intention"
        title="Interview studio"
        description="Bring your knowledge together. Practice your explanations, structure your answers, and find your next focus."
      />
      <div className="filter-bar">
        <select
          className="experience"
          aria-label="Interview round"
          value={round}
          onChange={(e) => setRound(e.target.value)}
        >
          {[
            "JavaScript screening",
            "React technical round",
            "Machine coding",
            "Frontend system design",
            "Managerial round",
            "Techno-managerial round",
            "HR round",
          ].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select
          className="experience"
          aria-label="Interview experience level"
          value={store.experience}
          onChange={(e) => store.setExperience(e.target.value)}
        >
          {["Fresher", "1–3 years", "3–5 years", "5–8 years", "8+ years"].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <span className="badge cyan">Self-guided practice</span>
      </div>
      <div className="content-layout">
        <div>
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <span className="badge violet">
                <Mic size={12} />
                {round}
              </span>
              <span className="font-mono text-muted-foreground">
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </span>
            </div>
            <h2 className="text-xl font-semibold mt-7 mb-5">
              {round.includes("system")
                ? "How would you design a scalable data-heavy dashboard?"
                : round.includes("Managerial") || round === "HR round"
                  ? "Describe a technical disagreement and how you resolved it."
                  : question?.title}
            </h2>
            <textarea
              className="field min-h-48"
              placeholder="Structure your answer: concept → example → trade-off..."
              aria-label="Your interview answer"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setFeedback(false);
              }}
            />
            <div className="flex flex-wrap gap-3 mt-4">
              <Button variant="outline" onClick={() => setRunning((r) => !r)}>
                {running ? <Pause /> : <Play />}
                {running ? "Pause timer" : "Start timer"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Reset timer"
                aria-label="Reset timer"
                onClick={() => {
                  setSeconds(0);
                  setRunning(false);
                }}
              >
                <RotateCcw />
              </Button>
              <Button
                variant="secondary"
                className="ml-auto"
                onClick={() => {
                  setQuestionIndex((i) => i + 1);
                  setAnswer("");
                  setFeedback(false);
                }}
              >
                Next prompt
                <ArrowRight />
              </Button>
            </div>
            <label className="block text-xs mt-7 text-muted-foreground">
              Self-evaluation
              <select
                className="field mt-2"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option>Needs practice</option>
                <option>Getting there</option>
                <option>Confident explanation</option>
              </select>
            </label>
            <Button
              className="mt-4"
              disabled={!answer.trim()}
              onClick={() => {
                setFeedback(true);
                setRunning(false);
              }}
            >
              Review my practice
              <Check />
            </Button>
            {feedback && (
              <div className="callout">
                <h3 className="font-semibold mb-3">Your self-review: {rating}</h3>
                <p className="text-xs text-muted-foreground leading-7">
                  Compare your response with these fixed review prompts: Did you define the concept
                  clearly? Did you give a concrete example? Did you explain a trade-off and a
                  failure case?
                </p>
                <p className="text-[10px] text-muted-foreground mt-3">
                  Predefined review guide — your answer has not been evaluated by AI. AI-powered
                  evaluation is a future feature.
                </p>
              </div>
            )}
          </div>
          <div className="section-heading">
            <h2>Company preparation</h2>
          </div>
          <div className="filter-bar">
            {companies.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={company === c ? "secondary" : "ghost"}
                onClick={() => setCompany(c)}
              >
                {c}
              </Button>
            ))}
          </div>
          <h3 className="font-semibold">{company} · Preparation collection</h3>
          <p className="text-xs text-muted-foreground mt-2 mb-5">
            Curated practice, not verified questions from {company}.
          </p>
          {questions.slice(0, 3).map((q) => (
            <Link
              className="module-row"
              key={q.id}
              to="/interview-questions/$questionId"
              params={{ questionId: q.id }}
            >
              {q.title}
              <ArrowRight size={13} />
            </Link>
          ))}
        </div>
        <aside>
          <h2 className="font-semibold mb-5">Your preparation checklist</h2>
          {[
            "Explain the event loop without notes",
            "Discuss React render vs. commit",
            "Implement debounce from memory",
            "Review an architecture case study",
            "Prepare two project stories",
            "Practice a concise introduction",
          ].map((item, i) => (
            <label className="plan-row" key={item}>
              <input
                type="checkbox"
                className="check-control"
                checked={store.checklist.includes(`interview-${i}`)}
                onChange={() => store.toggleCheck(`interview-${i}`)}
              />
              <h3>{item}</h3>
            </label>
          ))}
          <p className="text-xs text-muted-foreground leading-7 mt-7">
            For {store.experience} experience, focus on explaining both the implementation and the
            decisions behind it.
          </p>
        </aside>
      </div>
    </>
  );
}
const roadmaps: Record<string, string[]> = {
  "Frontend Developer": [
    "Web foundations",
    "JavaScript fluency",
    "React essentials",
    "Build and interview",
  ],
  "Mid-level Developer": [
    "JavaScript internals",
    "Reliable React patterns",
    "Testing and performance",
    "Production project and interviews",
  ],
  "Senior Frontend Engineer": [
    "Deep JavaScript & TypeScript",
    "React architecture & performance",
    "Frontend system design",
    "Engineering communication & interviews",
  ],
  "Tech Lead": [
    "Architecture and boundaries",
    "Reliability and delivery",
    "Technical leadership",
    "Design reviews and coaching",
  ],
  "Full-stack Developer": [
    "HTTP and data modeling",
    "Server and API foundations",
    "Authentication and reliability",
    "End-to-end product project",
  ],
};
export function CareerRoadmap() {
  const store = useDev();
  const [role, setRole] = useState(store.target);
  const [stack, setStack] = useState("React + TypeScript");
  const [duration, setDuration] = useState("8 weeks");
  const [generated, setGenerated] = useState({ role: store.target, stack, duration });
  const steps = roadmaps[generated.role] ?? roadmaps["Senior Frontend Engineer"] ?? [];
  return (
    <>
      <PageHeader
        label="One deliberate step at a time"
        title="Your career roadmap"
        description="Turn a big career goal into an achievable weekly plan. Choose a direction and make it yours."
      />
      <div className="filter-bar">
        {[
          { label: "Target role", value: role, set: setRole, items: Object.keys(roadmaps) },
          {
            label: "Technology stack",
            value: stack,
            set: setStack,
            items: ["React + TypeScript", "Next.js + React", "JavaScript + Web APIs"],
          },
          {
            label: "Preparation duration",
            value: duration,
            set: setDuration,
            items: ["4 weeks", "8 weeks", "12 weeks"],
          },
        ].map((item) => (
          <label key={item.label} className="text-[10px] text-muted-foreground">
            {item.label}
            <select
              className="field mt-2"
              value={item.value}
              onChange={(e) => item.set(e.target.value)}
            >
              {item.items.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
        ))}
        <Button
          className="self-end"
          onClick={() => {
            setGenerated({ role, stack, duration });
            store.setTarget(role);
          }}
        >
          Create my roadmap
          <ArrowRight />
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 my-8">
        <span className="badge violet">{generated.role}</span>
        <span className="badge">{generated.stack}</span>
        <span className="badge">{generated.duration}</span>
        <span className="badge cyan">Sample preparation plan</span>
      </div>
      <div className="content-layout">
        <div className="timeline">
          {steps.map((step, i) => {
            const weeks = Number.parseInt(generated.duration) / 4;
            return (
              <section className="milestone" key={step}>
                <span className="eyebrow">
                  Week {Math.floor(i * weeks) + 1}
                  {weeks > 1 ? `–${Math.floor((i + 1) * weeks)}` : ""}
                </span>
                <h2>{step}</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Focus on understanding the mechanism and demonstrating it in a working interface.
                </p>
                {[
                  `Study: ${step.toLowerCase()}`,
                  `Practice ${i + 2} focused coding challenges`,
                  `Build: ${["a searchable project list", "an accessible component library", "a data-heavy dashboard", "a portfolio case study"][i]}`,
                  "Explain one technical trade-off aloud",
                ].map((task, j) => (
                  <label className="plan-row" key={task}>
                    <input
                      className="check-control"
                      type="checkbox"
                      checked={store.checklist.includes(`roadmap-${generated.role}-${i}-${j}`)}
                      onChange={() => store.toggleCheck(`roadmap-${generated.role}-${i}-${j}`)}
                    />
                    <h3>{task}</h3>
                  </label>
                ))}
              </section>
            );
          })}
        </div>
        <aside>
          <h2 className="font-semibold mb-4">Your north star</h2>
          <p className="text-xs text-muted-foreground leading-7">
            Consistency over cramming. Aim for {store.goal} focused hours each week, including time
            to build, reflect and explain.
          </p>
          <div className="callout">
            <Target className="text-primary mb-3" size={20} />
            <p className="text-xs leading-7">
              A roadmap is a guide, not a deadline. Adjust the pace to your needs.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/learning-paths">
              Explore learning paths
              <ArrowRight />
            </Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
export function Workspace() {
  const store = useDev();
  const [tab, setTab] = useState("Saved content");
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState({ id: "", title: "", body: "" });
  return (
    <>
      <PageHeader
        label="Everything you’re building toward"
        title="My workspace"
        description="Your saved ideas, learning progress, and notes — a little home for your next chapter."
      >
        <Button
          onClick={() => {
            setNote({ id: crypto.randomUUID(), title: "", body: "" });
            setEditing(true);
          }}
        >
          <Plus />
          New note
        </Button>
      </PageHeader>
      <div className="tabs-row">
        {["Saved content", "Personal notes", "Learning history", "Preparation goals"].map((t) => (
          <Button
            key={t}
            variant="ghost"
            className={tab === t ? "selected" : ""}
            onClick={() => setTab(t)}
          >
            {t}
            {t === "Saved content" && <span className="badge">{store.bookmarks.length}</span>}
          </Button>
        ))}
      </div>
      {tab === "Personal notes" ? (
        store.notes.length ? (
          <div className="note-grid">
            {store.notes.map((n) => (
              <div className="panel note" key={n.id}>
                <div className="flex items-center justify-between">
                  <FileText className="text-primary" size={18} />
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit note"
                      aria-label={`Edit ${n.title}`}
                      onClick={() => {
                        setNote(n);
                        setEditing(true);
                      }}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete note"
                      aria-label={`Delete ${n.title}`}
                      onClick={() => store.deleteNote(n.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                <h2 className="font-semibold mt-4 mb-3">{n.title}</h2>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-7">
                  {n.body}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">
            <FileText className="mx-auto mb-4 text-primary" />
            <h2 className="text-foreground font-semibold">Make an idea your own.</h2>
            <p className="mt-2 text-xs">Your notes will live here, saved in this browser.</p>
          </div>
        )
      ) : tab === "Preparation goals" ? (
        <div className="max-w-xl">
          <label className="block mb-6 text-xs">
            Your target role
            <input
              className="field mt-2"
              value={store.target}
              onChange={(e) => store.setTarget(e.target.value)}
            />
          </label>
          <label className="block text-xs">
            Weekly learning goal (hours)
            <input
              type="number"
              min="1"
              max="40"
              className="field mt-2"
              value={store.goal}
              onChange={(e) => store.setGoal(Math.min(40, Math.max(1, Number(e.target.value))))}
            />
          </label>
          <Button asChild className="mt-6">
            <Link to="/career-roadmap">
              Open your roadmap
              <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="panel">
          {(tab === "Learning history" ? store.completed : store.bookmarks).map((id) => {
            const [kind, slug] = id.split("/");
            const q = questions.find((q) => q.id === slug);
            const path = paths.find((p) => p.id === kind);
            const title =
              path?.modules.find((m) => slugify(m) === slug) ??
              q?.title ??
              slug?.replaceAll("-", " ") ??
              id;
            const content = (
              <>
                <span className="recommend-icon">
                  {tab === "Learning history" ? <Check size={15} /> : <Bookmark size={15} />}
                </span>
                <div className="flex-1">
                  <h3 className="text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{path?.title ?? kind}</p>
                </div>
                <ArrowRight size={14} />
              </>
            );
            return (
              <div key={id}>
                {path ? (
                  <Link
                    className="recommend-row"
                    to="/learning-paths/$pathId/$topicId"
                    params={{ pathId: path.id, topicId: slug ?? "" }}
                  >
                    {content}
                  </Link>
                ) : kind === "question" ? (
                  <Link
                    className="recommend-row"
                    to="/interview-questions/$questionId"
                    params={{ questionId: slug ?? "" }}
                  >
                    {content}
                  </Link>
                ) : kind === "practice" ? (
                  <Link
                    className="recommend-row"
                    to="/coding-arena/$challengeId"
                    params={{ challengeId: slug ?? "" }}
                  >
                    {content}
                  </Link>
                ) : (
                  <Link
                    className="recommend-row"
                    to="/system-design/$problemId"
                    params={{ problemId: slug ?? "" }}
                  >
                    {content}
                  </Link>
                )}
              </div>
            );
          })}
          {!(tab === "Learning history" ? store.completed : store.bookmarks).length && (
            <div className="empty">
              <Bookmark className="mx-auto text-primary mb-4" />
              <h2 className="font-semibold text-foreground">
                {tab === "Learning history"
                  ? "Your next lesson is waiting."
                  : "Keep the ideas worth coming back to."}
              </h2>
              <p className="text-xs mt-2 mb-5">
                {tab === "Learning history"
                  ? "Complete a lesson or review a question to start your history."
                  : "Bookmark a lesson or question to find it here."}
              </p>
              <Button variant="outline" asChild>
                <Link to="/learning-paths">
                  Explore learning
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogTitle>
            {store.notes.some((n) => n.id === note.id) ? "Edit your note" : "Capture an idea"}
          </DialogTitle>
          <DialogDescription>Notes are saved locally in this browser.</DialogDescription>
          <input
            className="field"
            aria-label="Note title"
            placeholder="Give your note a title"
            value={note.title}
            onChange={(e) => setNote((n) => ({ ...n, title: e.target.value }))}
          />
          <textarea
            className="field min-h-48"
            aria-label="Note body"
            placeholder="Your insight, example, or question..."
            value={note.body}
            onChange={(e) => setNote((n) => ({ ...n, body: e.target.value }))}
          />
          <Button
            disabled={!note.title.trim() || !note.body.trim()}
            onClick={() => {
              store.saveNote(note);
              setEditing(false);
              setTab("Personal notes");
            }}
          >
            Save note
            <Check />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
