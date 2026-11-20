import { useState, useEffect } from "react";
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
import { paths, slugify, pathProgress } from "@/lib/dev-data";
import { lessons } from "@/lib/devready/lessons";
import { ContentTools } from "./content-tools";
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
            <span className="badge cyan">
              {path.modules.filter((m) => lessons[`${pathId}/${slugify(m)}`]).length} published deep
              dives
            </span>
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
                  <span className="flex-1">
                    {module}
                    <span className="block text-[10px] text-muted-foreground mt-1">
                      {i < 4 ? "Beginner" : i < 10 ? "Intermediate" : "Advanced"} ·{" "}
                      {lessons[id] ? "Lesson + practical exercise" : "Curriculum outline"}
                    </span>
                  </span>
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
          <h2 className="font-semibold mb-4">Who this is for</h2>
          <p className="text-xs text-muted-foreground leading-7">
            {path.level === "Advanced"
              ? "Experienced engineers preparing to defend production architecture and senior-level trade-offs."
              : path.level === "Beginner"
                ? "Developers building a reliable foundation in web interfaces."
                : "Frontend developers strengthening implementation skills and interview explanations."}
          </p>
          <h2 className="font-semibold mt-6 mb-4">Before you begin</h2>
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
export function Lesson({ pathId, topicId }: { pathId: string; topicId: string }) {
  const store = useDev(),
    path = paths.find((p) => p.id === pathId);
  const index = path?.modules.findIndex((m) => slugify(m) === topicId) ?? -1;
  const title = path?.modules[index],
    id = `${pathId}/${topicId}`;
  const [quiz, setQuiz] = useState<Record<number, number>>({}),
    [checked, setChecked] = useState(false);
  useEffect(() => {
    if (store.loaded && title) store.visit(id, true);
  }, [id, store.loaded]);
  const content = lessons[id];
  if (!path || !title)
    return (
      <div className="empty">
        This topic is unavailable.
        <Link to="/learning-paths" className="block text-primary mt-3">
          Explore learning paths
        </Link>
      </div>
    );
  return (
    <>
      <Link
        to="/learning-paths/$pathId"
        params={{ pathId }}
        className="text-xs text-primary block mb-5"
      >
        {path.title} / Module {index + 1}
      </Link>
      <PageHeader
        title={title}
        description={
          content
            ? "Understand the mechanism. Apply it in production. Explain the trade-offs."
            : "Curriculum outline — the detailed lesson and scored check are still being prepared."
        }
      />
      <div className="flex gap-3">
        <Difficulty value={path.level} />
        <span className="badge">
          {content ? "Concept-specific deep dive" : "Curriculum outline"}
        </span>
      </div>
      <div className="content-layout">
        <article className="article">
          {content ? (
            <>
              <h2>What is this concept?</h2>
              <p>{content.concept}</p>
              <h2>Why does it exist?</h2>
              <p>{content.purpose}</p>
              <h2>Why is it important?</h2>
              <p>{content.importance}</p>
              <h2>How it works internally</h2>
              <p>{content.internal}</p>
              <h2>A mental model</h2>
              <div className="mental-model">
                {content.model.map((step, i) => (
                  <div key={step}>
                    <span className="badge cyan">{i + 1}</span>
                    <span>{step}</span>
                    {i < content.model.length - 1 && <ArrowRight size={15} />}
                  </div>
                ))}
              </div>
              <h2>Code example</h2>
              <CodeBlock
                code={content.code}
                language={
                  pathId === "typescript"
                    ? "TypeScript"
                    : pathId === "react"
                      ? "JSX"
                      : pathId === "html-css"
                        ? topicId === "grid"
                          ? "CSS"
                          : "HTML"
                        : "JavaScript"
                }
              />
              <h2>Production use cases</h2>
              <p>{content.production}</p>
              <h2>Common mistakes and anti-patterns</h2>
              <ul>
                {content.mistakes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <h2>Best practices</h2>
              <ul>
                {content.best.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <h2>Performance and architecture</h2>
              <p>{content.performance}</p>
              <h2>Interview-ready explanation</h2>
              <div className="callout">
                <p>{content.interview}</p>
              </div>
              <h2>Senior-level discussion</h2>
              <p>{content.senior}</p>
              <h2>Common follow-up questions</h2>
              <ul>
                {content.followups.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <h2>Practical exercise</h2>
              <div className="callout">
                <p>{content.exercise}</p>
              </div>
              <h2>Knowledge assessment</h2>
              {content.checks.length ? (
                <>
                  {content.checks.map((c, i) => (
                    <div className="mb-7" key={c.question}>
                      <h3>
                        {i + 1}. {c.question}
                      </h3>
                      {c.options.map((o, j) => (
                        <Button
                          key={o}
                          variant="ghost"
                          className={`quiz-option h-auto justify-start whitespace-normal ${quiz[i] === j ? "selected" : ""}`}
                          onClick={() => {
                            setQuiz((q) => ({ ...q, [i]: j }));
                            setChecked(false);
                          }}
                        >
                          <span className="text-muted-foreground mr-2">
                            {String.fromCharCode(65 + j)}
                          </span>
                          {o}
                        </Button>
                      ))}
                      {checked && (
                        <p className={quiz[i] === c.correct ? "!text-success" : "!text-warning"}>
                          {quiz[i] === c.correct
                            ? "Correct. "
                            : `Not quite. ${c.options[c.correct]}. `}
                          {c.reason}
                        </p>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    disabled={content.checks.some((_, i) => quiz[i] === undefined)}
                    onClick={() => setChecked(true)}
                  >
                    Check answers
                    <Check />
                  </Button>
                  {checked && (
                    <p aria-live="polite">
                      {content.checks.filter((c, i) => quiz[i] === c.correct).length} of{" "}
                      {content.checks.length} correct. For a saved skill score, take a full topic
                      assessment.
                    </p>
                  )}
                </>
              ) : (
                <p>
                  Complete the practical exercise and explain your decisions. A scored check for
                  this lesson is upcoming.
                </p>
              )}
            </>
          ) : (
            <>
              <h2>{title}: learning outline</h2>
              <p>
                This module remains in your learning path. A complete, concept-specific explanation,
                production example and assessment are not published yet.
              </p>
              <h3>Continue with a published lesson</h3>
              {path.modules
                .filter((m) => lessons[`${pathId}/${slugify(m)}`])
                .map((m) => (
                  <Link
                    key={m}
                    className="module-row"
                    to="/learning-paths/$pathId/$topicId"
                    params={{ pathId, topicId: slugify(m) }}
                  >
                    {m}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              <Button asChild variant="outline">
                <Link to="/assessments">Take a topic assessment</Link>
              </Button>
            </>
          )}
          <ContentTools key={id} id={id} title={title} />
          <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-6 mt-8">
            <Button
              variant={store.completed.includes(id) ? "secondary" : "default"}
              onClick={() => store.toggleComplete(id)}
            >
              <CheckCircle2 />
              {store.completed.includes(id)
                ? "Completed"
                : content
                  ? "Mark complete"
                  : "Mark outline reviewed"}
            </Button>
            {path.modules[index + 1] && (
              <Button asChild variant="outline">
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
              className="text-xs text-muted-foreground flex gap-2 items-center mt-5"
              to="/learning-paths/$pathId/$topicId"
              params={{ pathId, topicId: slugify(path.modules[index - 1] ?? "") }}
            >
              <ArrowLeft size={13} />
              Previous lesson
            </Link>
          )}
        </article>
        <aside className="lesson-aside">
          <div className="eyebrow mb-5">In this learning path</div>
          {path.modules.map((m, i) => (
            <Link
              key={m}
              className={`module-row !px-0 !text-xs ${i === index ? "text-primary" : ""}`}
              to="/learning-paths/$pathId/$topicId"
              params={{ pathId, topicId: slugify(m) }}
            >
              {store.completed.includes(`${pathId}/${slugify(m)}`) ? (
                <CheckCircle2 size={13} />
              ) : (
                <Circle size={10} />
              )}
              <span>
                {m}
                {!lessons[`${pathId}/${slugify(m)}`] && (
                  <span className="text-muted-foreground text-[10px] block">Outline</span>
                )}
              </span>
            </Link>
          ))}
        </aside>
      </div>
    </>
  );
}
