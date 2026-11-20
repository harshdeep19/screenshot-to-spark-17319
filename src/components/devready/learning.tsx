import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  BookOpen,
  Clock,
  Check,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDev } from "@/lib/dev-store";
import { paths, questions, slugify, pathProgress } from "@/lib/dev-data";
import {
  PageHeader,
  PathCard,
  Progress,
  CodeBlock,
  Difficulty,
  ArchitectureDiagram,
} from "./common";
export function LearningPaths() {
  const [filter, setFilter] = useState("All paths");
  return (
    <>
      <PageHeader
        label="A foundation for your next chapter"
        title="Learning paths"
        description="Go beyond knowing the answer. Build a deep understanding, one connected concept at a time."
      />
      <div className="filter-bar">
        {["All paths", "Beginner", "Intermediate", "Advanced"].map((value) => (
          <Button
            key={value}
            variant={filter === value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter(value)}
          >
            {value}
          </Button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">7 curated paths</span>
      </div>
      <div className="path-grid">
        {paths
          .filter(
            (p) =>
              filter === "All paths" ||
              p.level === filter ||
              (filter === "Beginner" && p.level === "All levels"),
          )
          .map((path) => (
            <PathCard key={path.id} path={path} />
          ))}
      </div>
    </>
  );
}
export function PathDetail({ pathId }: { pathId: string }) {
  const path = paths.find((p) => p.id === pathId);
  const store = useDev();
  if (!path)
    return (
      <div className="empty">
        This learning path is unavailable.
        <Link to="/learning-paths" className="block text-primary mt-3">
          Explore all paths
        </Link>
      </div>
    );
  return (
    <>
      <PageHeader label="Structured learning" title={path.title} description={path.description}>
        <div className={`tech-symbol ${path.tone} mb-0`}>{path.symbol}</div>
      </PageHeader>
      <div className="content-layout">
        <div>
          <div className="flex gap-3 mb-6">
            <Difficulty value={path.level} />
            <span className="badge">
              <Clock size={11} />
              {path.hours} hours
            </span>
            <span className="badge">{path.modules.length} modules</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-3">
            <span>Your path progress</span>
            <span>{pathProgress(path, store.completed)}%</span>
          </div>
          <Progress value={pathProgress(path, store.completed)} />
          <div className="section-heading">
            <h2>Your learning journey</h2>
            <span className="text-xs text-muted-foreground">Learn at your pace</span>
          </div>
          <div className="panel">
            {path.modules.map((module, i) => {
              const id = `${path.id}/${slugify(module)}`;
              return (
                <Link
                  key={module}
                  className="module-row"
                  to="/learning-paths/$pathId/$topicId"
                  params={{ pathId: path.id, topicId: slugify(module) }}
                >
                  <span className="module-number">{String(i + 1).padStart(2, "0")}</span>
                  {store.completed.includes(id) ? (
                    <CheckCircle2 size={15} className="text-success" />
                  ) : (
                    <BookOpen size={15} className="text-muted-foreground" />
                  )}
                  <span className="flex-1">{module}</span>
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">
                    {12 + (i % 4) * 5} min
                  </span>
                  <ArrowRight size={14} />
                </Link>
              );
            })}
          </div>
        </div>
        <aside className="lesson-aside">
          <h2 className="font-semibold mb-4">Before you begin</h2>
          <p className="text-xs text-muted-foreground leading-7">{path.prerequisites}</p>
          <h2 className="font-semibold mt-7 mb-3">What you’ll take away</h2>
          <ul className="space-y-3 text-xs text-muted-foreground">
            {[
              "A working mental model",
              "Production-focused patterns",
              "Interview-ready explanations",
              "Practical knowledge checks",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <Check size={14} className="text-cyan" />
                {item}
              </li>
            ))}
          </ul>
          <Button className="mt-7 w-full" asChild>
            <Link
              to="/learning-paths/$pathId/$topicId"
              params={{ pathId: path.id, topicId: slugify(path.modules[0] ?? "") }}
            >
              Start learning
              <ArrowRight />
            </Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
const lessonMap: Record<string, string> = {
  "scope-and-closures": "closures",
  "the-event-loop": "event-loop",
  "microtasks-and-macrotasks": "event-loop",
  generics: "generics",
  hooks: "react-rendering",
  "effects-and-lifecycle": "useeffect",
  reconciliation: "react-rendering",
  "performance-optimization": "web-vitals",
  accessibility: "accessibility",
  grid: "css-grid",
  caching: "caching",
  "data-fetching-and-caching": "caching",
};
export function Lesson({ pathId, topicId }: { pathId: string; topicId: string }) {
  const path = paths.find((p) => p.id === pathId);
  const index = path?.modules.findIndex((m) => slugify(m) === topicId) ?? -1;
  const title = path?.modules[index];
  const store = useDev();
  const [quiz, setQuiz] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  if (!path || !title)
    return (
      <div className="empty">
        This topic is unavailable.
        <Link to="/learning-paths" className="block text-primary mt-3">
          Explore learning paths
        </Link>
      </div>
    );
  const source = questions.find((q) => q.id === lessonMap[topicId]);
  const id = `${pathId}/${topicId}`;
  const generic = {
    answer: `${title} is part of designing interfaces that remain understandable as requirements evolve. Begin with a small working example, identify the responsibilities involved, and make the boundaries explicit.`,
    explanation: `In ${path.title}, this topic connects to how data, behavior and rendering fit together. Trace an input through the system: what changes, who owns it, and which parts must react? Prefer a small, explicit contract over hidden coupling.`,
    code:
      pathId === "typescript"
        ? 'type Result<T> =\n  | { status: "success"; data: T }\n  | { status: "error"; message: string };\n\nfunction read<T>(result: Result<T>) {\n  if (result.status === "success") return result.data;\n  throw new Error(result.message);\n}'
        : pathId === "html-css"
          ? '<main>\n  <section aria-labelledby="section-title">\n    <h1 id="section-title">Your projects</h1>\n    <ul><li>Engineering workspace</li></ul>\n  </section>\n</main>'
          : "function createStore(initialValue) {\n  let value = initialValue;\n  const listeners = new Set();\n  return {\n    get: () => value,\n    set(next) {\n      value = next;\n      listeners.forEach(fn => fn(value));\n    },\n    subscribe(fn) {\n      listeners.add(fn);\n      return () => listeners.delete(fn);\n    }\n  };\n}",
    followups: [
      "Which state or resources does this approach own?",
      "What trade-offs change at production scale?",
      "How would you test the failure cases?",
    ],
  };
  const content = source ?? generic;
  const isEvent = source?.id === "event-loop";
  const quizItems = isEvent
    ? [
        {
          question: "What is the output of the example above?",
          options: ["A, B, C, D", "A, D, C, B", "A, C, D, B"],
          correct: 1,
          reason:
            "Synchronous calls finish first. Promise callbacks run as microtasks before the timer task.",
        },
        {
          question: "Can an endless chain of microtasks delay rendering?",
          options: [
            "Yes, the queue must drain",
            "No, each microtask triggers a paint",
            "Only if setTimeout is used",
          ],
          correct: 0,
          reason:
            "The browser drains microtasks before moving to the next task and rendering opportunity.",
        },
        {
          question: "What does a zero-millisecond timer guarantee?",
          options: [
            "Immediate execution",
            "Execution before promises",
            "A scheduled task, not an exact time",
          ],
          correct: 2,
          reason:
            "Timers schedule tasks that become eligible after the delay; the stack and queues still control execution.",
        },
      ]
    : [
        {
          question: "Which approach leads to a stronger engineering explanation?",
          options: [
            "Memorize an API name",
            "Describe the mechanism and its trade-offs",
            "Skip the failure cases",
          ],
          correct: 1,
          reason: "Mechanisms and constraints reveal understanding beyond memorizing syntax.",
        },
        {
          question: "What should you validate before adding an optimization?",
          options: [
            "Its measurable effect on the actual bottleneck",
            "Whether it makes the code longer",
            "Whether every team uses it",
          ],
          correct: 0,
          reason: "Profile first. Added complexity should have a measurable benefit.",
        },
        {
          question: "What belongs in a production-ready implementation?",
          options: [
            "Only the happy path",
            "No cleanup",
            "Explicit error handling and resource cleanup",
          ],
          correct: 2,
          reason: "Failure handling and cleanup keep the system reliable.",
        },
      ];
  return (
    <>
      <div className="flex gap-3 mb-5">
        <Link to="/learning-paths/$pathId" params={{ pathId }} className="text-xs text-primary">
          {path.title}
        </Link>
        <span className="text-xs text-muted-foreground">/ Module {index + 1}</span>
      </div>
      <PageHeader
        title={title}
        description="Understand the mechanics. Connect the concept. Explain it with confidence."
      >
        <Button
          variant="outline"
          size="icon"
          aria-label="Bookmark lesson"
          title="Bookmark lesson"
          onClick={() => store.toggleBookmark(id)}
        >
          <Bookmark className={store.bookmarks.includes(id) ? "fill-primary text-primary" : ""} />
        </Button>
      </PageHeader>
      <div className="flex gap-3">
        <span className="badge">
          <Clock size={11} />
          20 min read
        </span>
        <Difficulty value={path.level} />
        <span className="badge">{source ? "Featured deep dive" : "Foundation lesson"}</span>
      </div>
      <div className="content-layout">
        <article className="article">
          <h2>Concept overview</h2>
          <p>{content.answer}</p>
          <h2>Why it matters</h2>
          <p>
            {isEvent
              ? "Understanding scheduling lets you predict execution order, avoid blocking the UI, and diagnose asynchronous bugs. It is the foundation for smooth interactions and correct coordination of promises, timers, and browser events."
              : `Understanding ${title.toLowerCase()} helps you reason about behavior rather than trial-and-error your way through bugs. In production, clear mental models make code reviews, debugging and architectural decisions more effective.`}
          </p>
          <h2>How it works internally</h2>
          <p>{content.explanation}</p>
          {isEvent ? (
            <div className="panel p-5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <span className="badge violet">Call stack</span>
              <ArrowRight size={16} />
              <span className="badge cyan">Drain microtasks</span>
              <ArrowRight size={16} />
              <span className="badge green">Render opportunity</span>
              <ArrowRight size={16} />
              <span className="badge">Next task</span>
            </div>
          ) : pathId === "system-design" || pathId === "engineering" ? (
            <ArchitectureDiagram />
          ) : null}
          <h2>Make it concrete</h2>
          <CodeBlock
            code={content.code}
            language={pathId === "typescript" ? "TypeScript" : "JavaScript"}
          />
          <p>
            {isEvent
              ? "“A” and “D” run synchronously. The resolved promise schedules “C” as a microtask, which runs once the stack is empty. Only then does the timer task print “B”."
              : "Read the example as a sequence of responsibilities. Identify the input, the state it owns, the output contract and any cleanup. Then consider how you would test each boundary independently."}
          </p>
          <h2>Practical use cases</h2>
          <p>
            {source?.id === "closures"
              ? "Use closures for debounced handlers, data encapsulation, memoized computations and subscription cleanup. Each instance can maintain independent state without a class."
              : isEvent
                ? "Debounced search, non-blocking batch processing and predictable UI updates all rely on correct scheduling. A Promise does not automatically move expensive work off the main thread."
                : "Apply this model in a searchable data table: separate input state, request state, displayed results and error handling. Keep each change local and make ownership visible."}
          </p>
          <h2>Common mistakes</h2>
          <ul>
            <li>
              {isEvent
                ? "Assuming setTimeout(fn, 0) means “run immediately”."
                : "Copying a pattern without understanding the lifetime of the values it retains."}
            </li>
            <li>
              {isEvent
                ? "Using promises to “make” expensive synchronous code non-blocking."
                : "Optimizing a theoretical bottleneck without a performance trace."}
            </li>
            <li>
              {isEvent
                ? "Continuously scheduling microtasks and starving rendering."
                : "Forgetting cancellation, cleanup, or errors when the user leaves the screen."}
            </li>
          </ul>
          <h2>Performance and trade-offs</h2>
          <p>
            {isEvent
              ? "Yielding work improves responsiveness but adds scheduling overhead. For CPU-heavy tasks, consider a Web Worker. For small batches, yield between chunks and validate the impact with a main-thread trace."
              : "Every abstraction has a cost. Balance memory, execution time, clarity and maintenance. Profile representative inputs and explain why the simplest correct approach is or is not sufficient."}
          </p>
          <div className="callout">
            <h3 className="!mt-0 text-primary">Your interview-ready answer</h3>
            <p>{content.answer}</p>
          </div>
          <h2>Senior-level perspective</h2>
          <p>
            {source?.explanation ??
              "At scale, consistency of contracts matters more than clever syntax. Describe how this design behaves under failure, concurrent updates and changing requirements. Define measurable success criteria and show how you would verify them."}
          </p>
          <h2>Follow-up questions</h2>
          <ul>
            {content.followups.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <h2>Check your understanding</h2>
          {quizItems.map((item, i) => (
            <div key={item.question} className="mb-7">
              <h3>
                {i + 1}. {item.question}
              </h3>
              {item.options.map((option, j) => (
                <Button
                  variant="ghost"
                  key={option}
                  className={`quiz-option justify-start h-auto whitespace-normal ${quiz[i] === j ? "selected" : ""}`}
                  onClick={() => {
                    setQuiz((q) => ({ ...q, [i]: j }));
                    setChecked(false);
                  }}
                >
                  <span className="text-muted-foreground mr-2">{String.fromCharCode(65 + j)}</span>
                  {option}
                </Button>
              ))}
              {checked && (
                <p className={quiz[i] === item.correct ? "!text-success" : "!text-warning"}>
                  {quiz[i] === item.correct
                    ? "Correct. "
                    : `Not quite. ${item.options[item.correct]}. `}
                  {item.reason}
                </p>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            disabled={Object.keys(quiz).length < 3}
            onClick={() => setChecked(true)}
          >
            Check answers
            <Check />
          </Button>
          <div className="flex justify-between gap-3 border-t border-border mt-10 pt-6">
            <Button
              variant={store.completed.includes(id) ? "secondary" : "default"}
              onClick={() => store.toggleComplete(id)}
            >
              <CheckCircle2 />
              {store.completed.includes(id) ? "Completed" : "Mark complete"}
            </Button>
            {path.modules[index + 1] && (
              <Button variant="outline" asChild>
                <Link
                  to="/learning-paths/$pathId/$topicId"
                  params={{ pathId, topicId: slugify(path.modules[index + 1] ?? "") }}
                >
                  Next lesson
                  <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
          {path.modules[index - 1] && (
            <Link
              className="text-xs text-muted-foreground flex items-center gap-2 mt-5"
              to="/learning-paths/$pathId/$topicId"
              params={{ pathId, topicId: slugify(path.modules[index - 1] ?? "") }}
            >
              <ArrowLeft size={12} />
              Previous lesson
            </Link>
          )}
        </article>
        <aside className="lesson-aside">
          <div className="eyebrow mb-5">In this learning path</div>
          {path.modules.map((module, i) => (
            <Link
              key={module}
              className={`module-row !px-0 !text-[11px] ${i === index ? "text-primary" : ""}`}
              to="/learning-paths/$pathId/$topicId"
              params={{ pathId, topicId: slugify(module) }}
            >
              {store.completed.includes(`${pathId}/${slugify(module)}`) ? (
                <CheckCircle2 size={13} />
              ) : (
                <Circle size={10} />
              )}
              <span>{module}</span>
            </Link>
          ))}
        </aside>
      </div>
    </>
  );
}
