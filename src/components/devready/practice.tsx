import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Play,
  Lightbulb,
  Code2,
  Network,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { questions, challenges, designProblems, slugify } from "@/lib/dev-data";
import { useDev } from "@/lib/dev-store";
import { questionDetails } from "@/lib/devready/question-details";
import { designCases } from "@/lib/devready/design-cases";
import { ContentTools } from "./content-tools";
import { runnerSpecs } from "@/lib/devready/challenge-tests";
import { runSamples, type RunResult } from "@/lib/devready/code-runner";
import { PageHeader, Difficulty, CodeBlock, ArchitectureDiagram } from "./common";
export function QuestionsHub() {
  const store = useDev();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [difficulty, setDifficulty] = useState("All difficulties");
  const [status, setStatus] = useState("All questions");
  const [type, setType] = useState("All types");
  const [experience, setExperience] = useState("All levels");
  const list = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(query.toLowerCase()) &&
      (category === "All topics" || q.category === category) &&
      (difficulty === "All difficulties" || q.difficulty === difficulty) &&
      (type === "All types" || q.type === type) &&
      (experience === "All levels" ||
        (q.difficulty === "Hard"
          ? "Senior engineer"
          : q.difficulty === "Medium"
            ? "Intermediate"
            : "Beginner") === experience) &&
      (status === "All questions" ||
        (status === "Bookmarked"
          ? store.bookmarks.includes(`question/${q.id}`)
          : status === "Learned"
            ? store.completed.includes(`question/${q.id}`)
            : !store.completed.includes(`question/${q.id}`))),
  );
  return (
    <>
      <PageHeader
        label="Understand. Explain. Connect."
        title="Interview questions"
        description="Thoughtfully curated questions that build understanding — not just a list of answers to memorize."
      />
      <div className="filter-bar">
        <input
          className="field max-w-[260px]"
          placeholder="Find a question..."
          aria-label="Find a question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="experience"
          aria-label="Question experience level"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          {["All levels", "Beginner", "Intermediate", "Senior engineer"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        {[
          {
            value: category,
            set: setCategory,
            items: ["All topics", ...new Set(questions.map((q) => q.category))],
          },
          {
            value: difficulty,
            set: setDifficulty,
            items: ["All difficulties", "Easy", "Medium", "Hard"],
          },
          {
            value: status,
            set: setStatus,
            items: ["All questions", "Bookmarked", "Learned", "Not learned"],
          },
          {
            value: type,
            set: setType,
            items: ["All types", "Conceptual", "Frequently asked", "Practical scenario"],
          },
        ].map((filter, i) => (
          <select
            key={i}
            className="experience"
            aria-label={["Topic", "Difficulty", "Question status", "Question type"][i]}
            value={filter.value}
            onChange={(e) => filter.set(e.target.value)}
          >
            {filter.items.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {list.length} questions · Curated sample collection
      </p>
      <div className="panel overflow-hidden">
        <table className="question-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Difficulty</th>
              <th>Topic</th>
              <th>Saved</th>
            </tr>
          </thead>
          <tbody>
            {list.map((q) => (
              <tr key={q.id}>
                <td>
                  <Link
                    to="/interview-questions/$questionId"
                    params={{ questionId: q.id }}
                    className="font-medium"
                  >
                    {q.title}
                  </Link>
                  <div className="text-[10px] text-muted-foreground mt-2">
                    {q.type}
                    {store.completed.includes(`question/${q.id}`) && " · Learned"}
                  </div>
                </td>
                <td>
                  <Difficulty value={q.difficulty} />
                </td>
                <td>
                  <span className="badge">{q.category}</span>
                </td>
                <td>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Bookmark ${q.title}`}
                    onClick={() => store.toggleBookmark(`question/${q.id}`)}
                  >
                    <Bookmark
                      className={
                        store.bookmarks.includes(`question/${q.id}`)
                          ? "text-primary fill-primary"
                          : ""
                      }
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <div className="empty">
            No questions match these filters.
            <Button
              className="block mx-auto mt-5"
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("All topics");
                setDifficulty("All difficulties");
                setStatus("All questions");
                setType("All types");
                setExperience("All levels");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
export function QuestionDetail({ questionId }: { questionId: string }) {
  const question = questions.find((q) => q.id === questionId);
  const [tab, setTab] = useState("Explanation");
  const [interview, setInterview] = useState(false),
    [revealed, setRevealed] = useState(false),
    [answer, setAnswer] = useState("");
  const store = useDev();
  useEffect(() => {
    if (store.loaded && question) store.visit(`question/${questionId}`);
  }, [questionId, store.loaded]);
  if (!question) return <div className="empty">Question unavailable.</div>;
  const index = questions.indexOf(question);
  return (
    <>
      <PageHeader
        label={`${question.category} · ${question.type}`}
        title={question.title}
        description="A better answer begins with a clearer mental model."
      >
        <Button
          variant="outline"
          size="icon"
          aria-label="Bookmark question"
          onClick={() => store.toggleBookmark(`question/${question.id}`)}
        >
          <Bookmark
            className={
              store.bookmarks.includes(`question/${question.id}`) ? "fill-primary text-primary" : ""
            }
          />
        </Button>
      </PageHeader>
      <div className="flex flex-wrap gap-3 items-center">
        <Difficulty value={question.difficulty} />
        <span className="badge">
          {question.difficulty === "Hard"
            ? "Senior engineer"
            : question.difficulty === "Medium"
              ? "Intermediate"
              : "Beginner"}
        </span>
        <Button
          variant={interview ? "secondary" : "outline"}
          size="sm"
          onClick={() => {
            setInterview(!interview);
            setRevealed(false);
          }}
        >
          Interview Mode
        </Button>
      </div>
      {interview && (
        <section className="content-tools">
          <h2 className="font-semibold mb-3">Your interview answer</h2>
          <textarea
            className="field min-h-40"
            aria-label="Answer before revealing solution"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Explain the concept, a concrete example, and one trade-off…"
          />
          <Button className="mt-4" disabled={!answer.trim()} onClick={() => setRevealed(true)}>
            Reveal and self-review
            <Check />
          </Button>
          {revealed && (
            <p className="text-xs text-muted-foreground mt-3">
              Compare clarity, correctness, examples and trade-offs with the explanation below. This
              is self-review, not automatic evaluation.
            </p>
          )}
        </section>
      )}
      {(!interview || revealed) && (
        <>
          <div className="tabs-row">
            {["Explanation", "Interview answer", "Senior discussion", "Follow-ups"].map((value) => (
              <Button
                key={value}
                variant="ghost"
                className={tab === value ? "selected" : ""}
                onClick={() => setTab(value)}
              >
                {value}
              </Button>
            ))}
          </div>
          <article className="article">
            {tab === "Explanation" ? (
              <>
                <h2>Short answer</h2>
                <p>{question.answer}</p>
                <h2>Under the hood</h2>
                <p>{question.explanation}</p>
                <CodeBlock code={question.code} />
                <h2>A real-world scenario</h2>
                <p>{questionDetails[questionId]?.production}</p>
                <h2>Common mistakes</h2>
                <p>{questionDetails[questionId]?.mistakes}</p>
              </>
            ) : tab === "Interview answer" ? (
              <div className="callout">
                <h3 className="!mt-0">A concise response you can actually say</h3>
                <p>{question.answer}</p>
                <p className="!mt-4">
                  Follow with a small example, then discuss one production trade-off. Keep the
                  explanation grounded in behavior you can demonstrate.
                </p>
              </div>
            ) : tab === "Senior discussion" ? (
              <>
                <h2>Reason about the boundaries</h2>
                <p>{question.explanation}</p>
                <h2>Make trade-offs explicit</h2>
                <p>{questionDetails[questionId]?.senior}</p>
              </>
            ) : (
              <>
                <h2>Go one level deeper</h2>
                {question.followups.map((q, i) => (
                  <div className="module-row" key={q}>
                    <span className="module-number">{i + 1}</span>
                    {q}
                  </div>
                ))}
                <h2>Related questions</h2>
                {questions
                  .filter((q) => q.id !== questionId && q.category === question.category)
                  .slice(0, 3)
                  .map((q) => (
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
              </>
            )}
            <div className="flex flex-wrap gap-3 mt-9">
              <Button
                onClick={() => store.toggleComplete(`question/${questionId}`)}
                variant={
                  store.completed.includes(`question/${questionId}`) ? "secondary" : "default"
                }
              >
                <CheckCircle2 />
                {store.completed.includes(`question/${questionId}`) ? "Learned" : "Mark as learned"}
              </Button>
              {questions[index + 1] && (
                <Button asChild variant="outline">
                  <Link
                    to="/interview-questions/$questionId"
                    params={{ questionId: questions[index + 1]?.id ?? "" }}
                  >
                    Next question
                    <ArrowRight />
                  </Link>
                </Button>
              )}
              {questions[index - 1] && (
                <Button asChild variant="ghost">
                  <Link
                    to="/interview-questions/$questionId"
                    params={{ questionId: questions[index - 1]?.id ?? "" }}
                  >
                    Previous question
                  </Link>
                </Button>
              )}
            </div>
          </article>
        </>
      )}
      <ContentTools key={questionId} id={`question/${questionId}`} title={question.title} />
    </>
  );
}
export function CodingArena() {
  const [filter, setFilter] = useState("All challenges");
  return (
    <>
      <PageHeader
        label="Turn understanding into implementation"
        title="Coding arena"
        description="Small challenges. Real engineering skills. Practice the patterns behind reliable frontend code."
      />
      <div className="filter-bar">
        {[
          "All challenges",
          "JavaScript",
          "DSA Patterns",
          "React Machine Coding",
          "TypeScript",
          "Frontend Utilities",
          "DOM & Browser",
        ].map((value) => (
          <Button
            key={value}
            variant={filter === value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="path-grid">
        {challenges
          .filter((c) => filter === "All challenges" || c.category === filter)
          .map((c) => (
            <Link
              key={c.id}
              className="panel path-card"
              to="/coding-arena/$challengeId"
              params={{ challengeId: c.id }}
            >
              <div className="flex justify-between mb-6">
                <div className="recommend-icon">
                  <Code2 size={18} />
                </div>
                <Difficulty value={c.difficulty} />
              </div>
              <h2>{c.title}</h2>
              <p>{c.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4">
                <span>{c.category}</span>
                <ArrowRight size={15} />
              </div>
            </Link>
          ))}
      </div>
      <p className="text-xs text-muted-foreground mt-7">
        JavaScript sample tests run in isolation for supported challenges. React and TypeScript
        challenges are review-only.
      </p>
    </>
  );
}
export function ChallengeDetail({ challengeId }: { challengeId: string }) {
  const store = useDev(),
    challenge = challenges.find((c) => c.id === challengeId),
    spec = runnerSpecs[challengeId];
  const [code, setCode] = useState(
      store.drafts[challengeId] ?? spec?.starter ?? "// Describe your implementation here\n",
    ),
    [language, setLanguage] = useState("JavaScript"),
    [output, setOutput] = useState<RunResult | null>(null),
    [busy, setBusy] = useState(false),
    [hint, setHint] = useState(false),
    [solution, setSolution] = useState(false);
  useEffect(() => {
    if (store.loaded) {
      setCode(
        store.drafts[challengeId] ?? spec?.starter ?? "// Describe your implementation here\n",
      );
      store.visit(`practice/${challengeId}`);
    }
  }, [challengeId, store.loaded]);
  if (!challenge) return <div className="empty">Challenge unavailable.</div>;
  return (
    <>
      <PageHeader
        label={`${challenge.category} · ~30 min`}
        title={challenge.title}
        description="Read the contract, test the edge cases, and explain your implementation."
      />
      <div className="editor-grid">
        <article className="article">
          <Difficulty value={challenge.difficulty} />
          <h2>Problem statement</h2>
          <p>{challenge.description}</p>
          <h3>Example input / output</h3>
          <CodeBlock code={challenge.example} language="Input / output" />
          <h3>Requirements & constraints</h3>
          <ul>
            {(
              spec?.requirements ?? [
                "Implement the described interaction with accessible controls.",
                "Handle loading, empty and error states.",
                "Preserve keyboard navigation and clean up external resources.",
              ]
            ).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <Button variant="outline" onClick={() => setHint(!hint)}>
            <Lightbulb />
            {hint ? "Hide hint" : "Need a hint?"}
          </Button>
          {hint && (
            <div className="callout">
              <p>{challenge.hint}</p>
            </div>
          )}
          <h3>Expected approach</h3>
          <p>{challenge.hint}</p>
          <h3>Complexity</h3>
          <p>{challenge.complexity}</p>
          <h3>Alternative approach</h3>
          <p>
            {spec?.alternative ??
              "Compare a minimal local-state implementation with a reusable controlled component. Explain the extra API complexity and accessibility responsibilities."}
          </p>
          {spec && (
            <>
              <h3>Sample test cases</h3>
              {spec.tests.map((t) => (
                <div key={t.name} className="mb-4">
                  <strong className="text-xs">{t.name}</strong>
                  <CodeBlock
                    code={`${t.expression}\nExpected: ${JSON.stringify(t.expected)}`}
                    language="Sample"
                  />
                </div>
              ))}
            </>
          )}
        </article>
        <div>
          <div className="panel overflow-hidden">
            <div className="code-header">
              <span>solution.{language === "TypeScript" ? "ts" : "js"}</span>
              <select
                aria-label="Code language"
                className="experience"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setOutput(null);
                }}
              >
                <option>JavaScript</option>
                <option>TypeScript</option>
              </select>
            </div>
            <textarea
              className="editor-input"
              aria-label="Code editor"
              spellCheck={false}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                store.saveDraft(challengeId, e.target.value);
                setOutput(null);
              }}
            />
            <div className="flex flex-wrap gap-3 items-center justify-between p-4 border-t border-border">
              <span className="text-[10px] text-muted-foreground">
                {spec && language === "JavaScript"
                  ? "Isolated sample tests · 3-second limit"
                  : "Review-only · no code execution"}
              </span>
              <Button
                size="sm"
                disabled={busy || !spec || language !== "JavaScript"}
                onClick={async () => {
                  if (!spec) return;
                  setBusy(true);
                  const result = await runSamples(code, spec.tests);
                  setOutput(result);
                  setBusy(false);
                  if (
                    !result.error &&
                    result.tests.length === spec.tests.length &&
                    result.tests.every((t) => t.passed)
                  )
                    store.markSolved(challengeId);
                }}
              >
                <Play size={13} />
                {busy ? "Running…" : "Run sample tests"}
              </Button>
            </div>
            <div className="output" aria-live="polite">
              <div className="text-muted-foreground mb-3">TEST RESULTS</div>
              {output ? (
                output.error ? (
                  <span className="text-warning">{output.error}</span>
                ) : (
                  <>
                    {output.tests.map((t) => (
                      <div className="test-result" key={t.name}>
                        <span className={t.passed ? "text-success" : "text-warning"}>
                          {t.passed ? "PASS" : "FAIL"} · {t.name}
                        </span>
                        <span>Actual: {t.actual}</span>
                        <span className="text-muted-foreground">Expected: {t.expected}</span>
                      </div>
                    ))}
                    <p className="text-muted-foreground mt-4">
                      Samples are not exhaustive and do not prove correctness for every input.
                    </p>
                  </>
                )
              ) : (
                <span className="text-muted-foreground">
                  {spec
                    ? "Write your implementation and run the supported samples."
                    : "No execution is available for this challenge. Compare your approach with the reference."}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <Button variant="outline" onClick={() => setSolution(!solution)}>
              {solution ? "Hide reference" : "View reference solution"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => store.toggleComplete(`practice/${challengeId}`)}
            >
              <Check />
              {store.completed.includes(`practice/${challengeId}`) ? "Reviewed" : "Mark reviewed"}
            </Button>
            {store.solved.includes(challengeId) && (
              <span className="badge green">Sample tests passed</span>
            )}
          </div>
          {solution && <CodeBlock code={challenge.solution} />}
          <ContentTools key={challengeId} id={`practice/${challengeId}`} title={challenge.title} />
        </div>
      </div>
    </>
  );
}
export function SystemDesign() {
  return (
    <>
      <PageHeader
        label="Think beyond the component"
        title="Frontend system design"
        description="Design for scale, explain your decisions, and become comfortable with the trade-offs that matter."
      />
      <div className="feature-banner mb-7">
        <div>
          <span className="badge cyan">SENIOR ENGINEERING</span>
          <h2>There isn’t one right architecture.</h2>
          <p>
            There is a well-reasoned one. Start with requirements, draw the boundaries, and make
            your trade-offs explicit.
          </p>
        </div>
        <div className="w-64 hidden sm:block">
          <ArchitectureDiagram />
        </div>
      </div>
      <div className="path-grid">
        {designProblems.map((title, i) => (
          <Link
            key={title}
            to="/system-design/$problemId"
            params={{ problemId: slugify(title) }}
            className="panel path-card"
          >
            <div className="flex justify-between mb-5">
              <Network className="text-cyan" size={22} />
              <span className="badge">{i < 3 ? "Featured case" : "Guided framework"}</span>
            </div>
            <h2>{title}</h2>
            <p>{designCases[slugify(title)]?.scope}</p>
            <div className="flex justify-between text-xs text-muted-foreground mt-4">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                45–60 min
              </span>
              <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
export function DesignDetail({ problemId }: { problemId: string }) {
  const store = useDev(),
    title = designProblems.find((p) => slugify(p) === problemId),
    content = designCases[problemId],
    [tab, setTab] = useState("Requirements");
  useEffect(() => {
    if (store.loaded && title) store.visit(`design/${problemId}`);
  }, [problemId, store.loaded]);
  if (!title || !content) return <div className="empty">Design problem unavailable.</div>;
  return (
    <>
      <PageHeader
        label="Frontend system design studio"
        title={title}
        description="Clarify the requirements, trace the data, and defend a design for this specific system."
      />
      <div className="tabs-row">
        {["Requirements", "Architecture", "Data & caching", "Trade-offs"].map((t) => (
          <Button
            variant="ghost"
            key={t}
            className={tab === t ? "selected" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      <article className="article">
        {tab === "Requirements" ? (
          <>
            <h2>Requirements gathering</h2>
            <p>{content.scope}</p>
            <h3>Functional requirements</h3>
            <ul>
              {content.functional.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h3>Non-functional requirements</h3>
            <ul>
              {content.nonfunctional.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </>
        ) : tab === "Architecture" ? (
          <>
            <h2>Component architecture</h2>
            <div className="system-flow">
              {content.components.map((x, i) => (
                <div key={x}>
                  <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                  <strong>{x}</strong>
                  {i < content.components.length - 1 && <ArrowRight size={18} />}
                </div>
              ))}
            </div>
            <h3>Data flow</h3>
            <p>{content.flow}</p>
            <h3>State management</h3>
            <p>{content.state}</p>
          </>
        ) : tab === "Data & caching" ? (
          <>
            <h2>API integration</h2>
            <CodeBlock code={content.api} language="API contract" />
            <h3>Caching strategy</h3>
            <p>{content.caching}</p>
            <h3>Data flow</h3>
            <p>{content.flow}</p>
          </>
        ) : (
          <>
            <h2>Performance and scalability</h2>
            <p>{content.performance}</p>
            <h3>Security</h3>
            <p>{content.security}</p>
            <h3>Trade-offs</h3>
            <p>{content.tradeoffs}</p>
            <h3>Interview follow-ups</h3>
            <ul>
              {content.followups.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </>
        )}
        <div className="callout">
          <h3 className="!mt-0">Your design assignment</h3>
          <p>
            Choose two measurable constraints, sketch the architecture, and describe one failure
            path. Explain which assumption would make you change this design.
          </p>
        </div>
        <ContentTools key={problemId} id={`design/${problemId}`} title={title} />
        <Button onClick={() => store.toggleComplete(`design/${problemId}`)}>
          <CheckCircle2 />
          {store.completed.includes(`design/${problemId}`)
            ? "Case study reviewed"
            : "Mark case study reviewed"}
        </Button>
      </article>
    </>
  );
}
