import { useState } from "react";
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
import { PageHeader, Difficulty, CodeBlock, ArchitectureDiagram } from "./common";
export function QuestionsHub() {
  const store = useDev();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [difficulty, setDifficulty] = useState("All difficulties");
  const [status, setStatus] = useState("All questions");
  const [type, setType] = useState("All types");
  const list = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(query.toLowerCase()) &&
      (category === "All topics" || q.category === category) &&
      (difficulty === "All difficulties" || q.difficulty === difficulty) &&
      (type === "All types" || q.type === type) &&
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
  const store = useDev();
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
      <Difficulty value={question.difficulty} />
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
            <p>
              Imagine debugging an interface where several updates happen at once. Trace the
              sequence of events, isolate what owns the data, and use the example above to verify
              your assumptions before changing the implementation.
            </p>
            <h2>Common mistakes</h2>
            <p>
              Avoid confusing an observed result with a guarantee. Explain the conditions that make
              your example correct, and consider cleanup and failure cases as well as the happy
              path.
            </p>
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
            <p>
              Explain the resource costs, error modes and team-maintenance implications. Measure the
              bottleneck before introducing complexity, and describe a test that validates your
              chosen contract.
            </p>
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
              .filter((q) => q.id !== questionId)
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
            variant={store.completed.includes(`question/${questionId}`) ? "secondary" : "default"}
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
        {["All challenges", "JavaScript", "DSA Patterns", "React Machine Coding"].map((value) => (
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
        Sample-solution practice. This prototype does not execute arbitrary code.
      </p>
    </>
  );
}
export function ChallengeDetail({ challengeId }: { challengeId: string }) {
  const challenge = challenges.find((c) => c.id === challengeId);
  const [code, setCode] = useState(
    "// Write your approach here\n\nfunction solution() {\n  // Your implementation\n}\n",
  );
  const [language, setLanguage] = useState("JavaScript");
  const [output, setOutput] = useState(false);
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const store = useDev();
  if (!challenge) return <div className="empty">Challenge unavailable.</div>;
  return (
    <>
      <PageHeader
        label={`${challenge.category} · ~30 min`}
        title={challenge.title}
        description="Think through the requirements, write your approach, and compare it with a reference solution."
      />
      <div className="editor-grid">
        <article className="article">
          <Difficulty value={challenge.difficulty} />
          <h2>Problem statement</h2>
          <p>{challenge.description}</p>
          <h3>Example</h3>
          <CodeBlock code={challenge.example} language="Input / output" />
          <h3>Requirements & constraints</h3>
          <ul>
            <li>Preserve the behavior described above.</li>
            <li>Handle empty inputs and boundary values.</li>
            <li>Do not use external libraries to replace the core implementation.</li>
          </ul>
          <Button variant="outline" onClick={() => setHint((value) => !value)}>
            <Lightbulb />
            {hint ? "Hide hint" : "Need a hint?"}
          </Button>
          {hint && (
            <div className="callout">
              <p>{challenge.hint}</p>
            </div>
          )}
          <h3>Complexity discussion</h3>
          <p>{challenge.complexity}</p>
        </article>
        <div>
          <div className="panel overflow-hidden">
            <div className="code-header">
              <div className="flex items-center gap-2">
                <Code2 size={14} />
                <span>solution.{language === "TypeScript" ? "ts" : "js"}</span>
              </div>
              <select
                className="experience"
                aria-label="Code language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
                setOutput(false);
              }}
            />
            <div className="flex items-center justify-between p-4 border-t border-border">
              <span className="text-[10px] text-muted-foreground">Reference simulation only</span>
              <Button size="sm" onClick={() => setOutput(true)}>
                <Play size={12} />
                Preview sample
              </Button>
            </div>
            <div className="output">
              <div className="text-muted-foreground mb-2">OUTPUT</div>
              {output ? (
                <>
                  <span className="text-success">Reference example preview</span>
                  <br />
                  {challenge.example}
                  <br />
                  <span className="text-warning">Your code was not executed or graded.</span>
                </>
              ) : (
                <span className="text-muted-foreground">Sample output will appear here.</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <Button variant="outline" onClick={() => setSolution((value) => !value)}>
              {solution ? "Hide reference" : "View reference solution"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => store.toggleComplete(`practice/${challengeId}`)}
            >
              <Check />
              {store.completed.includes(`practice/${challengeId}`) ? "Reviewed" : "Mark reviewed"}
            </Button>
          </div>
          {solution && (
            <>
              <CodeBlock code={challenge.solution} />
              <p className="text-xs text-muted-foreground leading-7">
                {challenge.hint} Complexity: {challenge.complexity}
              </p>
            </>
          )}
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
            <p>
              {
                [
                  "Data-heavy interfaces, scoped caching and rendering boundaries.",
                  "Product discovery, resilient checkout and fast experiences.",
                  "Pagination, freshness and optimistic interactions.",
                ][i % 3]
              }
            </p>
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
  const title = designProblems.find((p) => slugify(p) === problemId);
  const [tab, setTab] = useState("Requirements");
  const store = useDev();
  if (!title) return <div className="empty">Design problem unavailable.</div>;
  return (
    <>
      <PageHeader
        label="Architecture case study"
        title={title}
        description="Start with the constraints. Make the boundaries visible. Explain why your design works."
      />
      <div className="tabs-row">
        {["Requirements", "Architecture", "Data & caching", "Trade-offs"].map((t) => (
          <Button
            key={t}
            variant="ghost"
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
            <h2>Clarify the scope first</h2>
            <p>
              Who uses this interface? Which workflows matter most? What is the expected data
              volume, freshness and device mix? Clarify offline needs and whether multiple users
              collaborate.
            </p>
            <h3>Functional requirements</h3>
            <ul>
              <li>Display and filter domain data with shareable navigation state.</li>
              <li>Support authenticated actions and user-scoped views.</li>
              <li>Show loading, empty, partial and error states.</li>
              <li>Update the interface after successful user actions.</li>
            </ul>
            <h3>Non-functional requirements</h3>
            <ul>
              <li>Accessible keyboard and assistive-technology flows.</li>
              <li>Responsive interactions on representative low-end devices.</li>
              <li>Reliable recovery from unavailable or slow services.</li>
              <li>Observable performance and failure metrics.</li>
            </ul>
          </>
        ) : tab === "Architecture" ? (
          <>
            <h2>Component boundaries</h2>
            <ArchitectureDiagram />
            <p>
              Use an application shell for identity and navigation. Feature views own workflow
              state. A query layer owns remote-data lifetimes, while reusable UI primitives remain
              independent of business logic.
            </p>
            <h3>Rendering strategy</h3>
            <p>
              Render public content on the server where it improves first paint and discovery. Keep
              private, interactive workflows client-driven with an explicit loading boundary. Avoid
              shipping large visualizations before they are needed.
            </p>
          </>
        ) : tab === "Data & caching" ? (
          <>
            <h2>Follow the data</h2>
            <p>
              User intent updates URL or local UI state. Typed query keys identify the remote
              resource. Successful mutations invalidate affected queries; optimistic changes have a
              rollback path.
            </p>
            <CodeBlock
              code={
                "GET /projects?cursor=abc&status=active\nResponse: { items: Project[], nextCursor: string | null }\n\nPATCH /projects/:id\nBody: { name: string, version: number }"
              }
              language="API contract"
            />
            <h3>Caching strategy</h3>
            <p>
              Include user and tenant scope in cache keys. Set freshness based on the workflow, not
              a global arbitrary timeout. Clear private caches at account changes. Prefer cursor
              pagination for frequently changing datasets.
            </p>
            <h3>State management</h3>
            <p>
              Keep ephemeral input state close to the view. Put shareable filters in the URL. Avoid
              copying server data into a second global store that can fall out of sync.
            </p>
          </>
        ) : (
          <>
            <h2>Defend the decisions</h2>
            <h3>Performance</h3>
            <p>
              Measure LCP and INP. Virtualize only when data volume warrants it, split heavy
              bundles, and avoid layout thrashing during interactions.
            </p>
            <h3>Security</h3>
            <p>
              Authorization must be enforced on the server. Never trust hidden buttons as a
              permission boundary. Escape untrusted content, scope cached data, and apply a content
              security policy.
            </p>
            <h3>Trade-offs</h3>
            <p>
              A BFF can simplify clients but introduces another deployment boundary. Optimistic
              updates improve perceived speed but require conflict handling. Micro-frontends add
              independent ownership at the cost of runtime and organizational complexity.
            </p>
          </>
        )}
        <div className="callout">
          <h3 className="!mt-0">Your discussion prompt</h3>
          <p>
            What would you simplify for a small team, and what would you change at ten times the
            traffic? Name the signal that tells you it is time to change.
          </p>
        </div>
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
