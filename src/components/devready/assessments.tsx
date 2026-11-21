import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, RotateCcw, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assessments, scoreAssessment, type Assessment } from "@/lib/devready/assessments";
import { dayKey } from "@/lib/devready/progress";
import { useDev } from "@/lib/dev-store";
import { PageHeader, Difficulty, Progress } from "./common";
export function Assessments() {
  const store = useDev(),
    [active, setActive] = useState<Assessment | null>(null),
    [answers, setAnswers] = useState<number[]>([]),
    [submitted, setSubmitted] = useState(false);
  const result = active && submitted ? scoreAssessment(active, answers, dayKey()) : null;
  return (
    <>
      <PageHeader
        label="Evidence over assumptions"
        title="Skill assessments"
        description="Find what you understand, uncover gaps, and choose your next focused lesson."
      />
      {active ? (
        <>
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <Button variant="outline" onClick={() => setActive(null)}>
              All assessments
            </Button>
            <Difficulty value={active.level} />
            <span className="badge cyan">{active.skill}</span>
          </div>
          <div className="assessment-heading">
            <h2 className="text-xl font-semibold">{active.title}</h2>
            <span className="text-sm text-muted-foreground" aria-live="polite">
              {active.checks.filter((_, i) => answers[i] !== undefined).length} of{" "}
              {active.checks.length} answered
            </span>
          </div>
          {!submitted && (
            <Progress
              value={
                (active.checks.filter((_, i) => answers[i] !== undefined).length /
                  active.checks.length) *
                100
              }
            />
          )}
          {result && (
            <section className="assessment-summary mb-7" role="status" aria-live="polite">
              <div>
                <div className="eyebrow">ASSESSMENT RESULT</div>
                <strong className="text-4xl block mt-3">{result.score}%</strong>
                <p className="text-muted-foreground mt-2">
                  {result.correct} correct · {result.total - result.correct} incorrect
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">
                  {result.weakTopics.length
                    ? "Your next focus"
                    : "Strong result — continue to deeper practice"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {result.weakTopics.join(" · ") ||
                    "All checks answered correctly in this assessment."}
                </p>
                {active.checks
                  .filter((c, i) => answers[i] !== c.correct)
                  .map((c) => {
                    const [pathId, topicId] = c.lesson.split("/");
                    return (
                      <Link
                        key={c.topic}
                        className="module-row !px-0"
                        to="/learning-paths/$pathId/$topicId"
                        params={{
                          pathId: pathId ?? "javascript",
                          topicId: topicId ?? "the-event-loop",
                        }}
                      >
                        {c.topic}
                        <ArrowRight size={14} />
                      </Link>
                    );
                  })}
                <Link
                  to="/assessments"
                  onClick={() => setActive(null)}
                  className="text-primary text-sm"
                >
                  Choose your next assessment →
                </Link>
              </div>
            </section>
          )}
          <article className="article assessment-questions">
            {active.checks.map((c, i) => (
              <section
                className="assessment-question"
                aria-labelledby={`assessment-question-${i}`}
                key={c.question}
              >
                <span className="eyebrow">{c.topic}</span>
                <h3 id={`assessment-question-${i}`}>
                  {i + 1}. {c.question}
                </h3>
                {c.options.map((option, j) => (
                  <Button
                    key={option}
                    variant="ghost"
                    disabled={submitted}
                    aria-pressed={answers[i] === j}
                    className={`quiz-option h-auto justify-start whitespace-normal ${answers[i] === j ? "selected" : ""} ${submitted && j === c.correct ? "answer-correct" : submitted && answers[i] === j ? "answer-incorrect" : ""}`}
                    onClick={() =>
                      setAnswers((a) => {
                        const next = [...a];
                        next[i] = j;
                        return next;
                      })
                    }
                  >
                    <span className="text-muted-foreground mr-2">
                      {String.fromCharCode(65 + j)}
                    </span>
                    {option}
                  </Button>
                ))}
                {submitted && (
                  <p className={answers[i] === c.correct ? "!text-success" : "!text-warning"}>
                    {answers[i] === c.correct
                      ? "Correct. "
                      : `Incorrect. Answer: ${c.options[c.correct]}. `}
                    {c.reason}
                  </p>
                )}
              </section>
            ))}
            <div className="assessment-submit">
              <Button
                disabled={!submitted && active.checks.some((_, i) => answers[i] === undefined)}
                onClick={() => {
                  if (submitted) {
                    setAnswers([]);
                    setSubmitted(false);
                  } else {
                    store.saveResult(scoreAssessment(active, answers, dayKey()));
                    setSubmitted(true);
                  }
                }}
              >
                {submitted ? <RotateCcw /> : <CheckCircle2 />}
                {submitted ? "Retake assessment" : "Submit assessment"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {submitted ? "Result saved in this browser" : "Answer every question to submit"}
              </span>
            </div>
          </article>
        </>
      ) : (
        <>
          <div className="assessment-heading text-sm text-muted-foreground">
            <span>6 focused assessments · 4 checks each</span>
            <span>Results saved in this browser</span>
          </div>
          <div className="path-grid">
            {assessments.map((a) => {
              const latest = store.results.filter((r) => r.id === a.id).at(-1);
              return (
                <div className="panel path-card" key={a.id}>
                  <div className="flex justify-between mb-6">
                    <Target className="text-cyan" />
                    <Difficulty value={a.level} />
                  </div>
                  <h2>{a.title}</h2>
                  <p>{a.checks.map((c) => c.topic).join(" · ")}</p>
                  <div className="flex justify-between text-xs mt-auto pt-5 mb-3">
                    <span>{latest ? `Latest: ${latest.score}%` : "Not assessed"}</span>
                    <span className="text-muted-foreground">~5 minutes</span>
                  </div>
                  {latest && <Progress value={latest.score} />}
                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={() => {
                      setActive(a);
                      setAnswers([]);
                      setSubmitted(false);
                    }}
                  >
                    {latest ? "Retake" : "Start assessment"}
                    <ArrowRight size={14} />
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
