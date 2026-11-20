import type { AssessmentResult, Skill } from "./progress";
export type Check = {
  question: string;
  options: string[];
  correct: number;
  reason: string;
  topic: string;
  lesson: string;
};
export type Assessment = {
  id: string;
  title: string;
  skill: Skill;
  level: string;
  checks: Check[];
};
const check = (
  question: string,
  options: string[],
  correct: number,
  reason: string,
  topic: string,
  lesson: string,
): Check => ({ question, options, correct, reason, topic, lesson });
export const assessments: Assessment[] = [
  {
    id: "js-fundamentals",
    title: "JavaScript fundamentals",
    skill: "JavaScript",
    level: "Beginner",
    checks: [
      check(
        "What does const prevent?",
        [
          "Mutation of every nested value",
          "Reassignment of the binding",
          "Reading before declaration",
        ],
        1,
        "const fixes the binding, not the object's contents. Access before initialization still throws.",
        "Bindings",
        "javascript/javascript-fundamentals",
      ),
      check(
        "A closure reads an outer variable after it changes. Which value does it see?",
        ["The updated binding", "A frozen snapshot", "Always undefined"],
        0,
        "Closures capture lexical bindings. Each outer invocation creates a separate environment.",
        "Closures",
        "javascript/scope-and-closures",
      ),
      check(
        "What does [] === [] evaluate to?",
        ["true", "false", "A TypeError"],
        1,
        "Objects compare by identity. These are different array objects.",
        "Equality",
        "javascript/javascript-fundamentals",
      ),
      check(
        "What is returned by a function with no return statement?",
        ["null", "false", "undefined"],
        2,
        "A function that reaches its end returns undefined.",
        "Functions",
        "javascript/javascript-fundamentals",
      ),
    ],
  },
  {
    id: "advanced-js",
    title: "Advanced JavaScript",
    skill: "JavaScript",
    level: "Advanced",
    checks: [
      check(
        "Output: log('A'); setTimeout(() => log('B'), 0); Promise.resolve().then(() => log('C')); log('D');",
        ["A B C D", "A D C B", "A C D B"],
        1,
        "Synchronous code completes, then microtasks drain, then the timer task can run.",
        "Event loop",
        "javascript/the-event-loop",
      ),
      check(
        "Can recursively scheduled microtasks delay browser painting?",
        [
          "Yes, until the microtask checkpoint finishes",
          "No, every microtask paints",
          "Only inside a worker",
        ],
        0,
        "An unbounded microtask queue can starve tasks and rendering opportunities.",
        "Scheduling",
        "javascript/the-event-loop",
      ),
      check(
        "What does Promise.all do when one input rejects?",
        [
          "Cancels all requests",
          "Returns partial results",
          "Rejects without cancelling remaining work",
        ],
        2,
        "Promise.all is fail-fast, but does not cancel input operations.",
        "Promises",
        "javascript/promises",
      ),
      check(
        "Which resource may remain alive through a retained closure?",
        [
          "Only primitive values",
          "Any referenced object in its retained environment",
          "No values after return",
        ],
        1,
        "Reachable references keep objects alive; release listeners and retained closures when no longer needed.",
        "Memory",
        "javascript/scope-and-closures",
      ),
    ],
  },
  {
    id: "react-fundamentals",
    title: "React fundamentals",
    skill: "React",
    level: "Intermediate",
    checks: [
      check(
        "Does a component render guarantee a DOM update?",
        ["Yes", "No, React may commit no DOM changes", "Only with useState"],
        1,
        "Render computes UI. Commit applies changes that are actually required.",
        "Rendering",
        "react/jsx-and-rendering",
      ),
      check(
        "Why use a stable item ID as a list key?",
        ["To preserve identity across reordering", "To stop all renders", "To sort the list"],
        0,
        "Keys identify sibling instances so React can preserve the correct state.",
        "Identity",
        "react/reconciliation",
      ),
      check(
        "Which state update safely depends on previous state?",
        ["setCount(count++)", "count = count + 1", "setCount(c => c + 1)"],
        2,
        "The functional updater receives the queued previous state without relying on a stale render snapshot.",
        "State",
        "react/jsx-and-rendering",
      ),
      check(
        "What belongs in useEffect?",
        [
          "Calculating a filtered list from props",
          "Synchronizing with an external system",
          "Mutating props",
        ],
        1,
        "Effects synchronize external systems; derived rendering data usually belongs in render.",
        "Effects",
        "react/effects-and-lifecycle",
      ),
    ],
  },
  {
    id: "react-performance",
    title: "React performance",
    skill: "React",
    level: "Advanced",
    checks: [
      check(
        "Can React.memo prevent updates from consumed context?",
        ["Yes, always", "Only with useCallback", "No"],
        2,
        "memo primarily skips parent-driven renders for equal props; state and consumed context still update.",
        "Memoization",
        "react/reconciliation",
      ),
      check(
        "What should you do before memoizing every component?",
        [
          "Profile a representative slow interaction",
          "Disable Strict Mode",
          "Move all state to Context",
        ],
        0,
        "Measure a real bottleneck and consider memoization cost before adding complexity.",
        "Profiling",
        "react/performance-optimization",
      ),
      check(
        "A list of 100,000 rows is slow. What bounds mounted DOM nodes?",
        [
          "useCallback on the click handler",
          "Virtualizing the visible window",
          "Duplicating the list in state",
        ],
        1,
        "Windowing limits mounted elements; preserve accessibility and scroll identity when implementing it.",
        "Large lists",
        "react/performance-optimization",
      ),
      check(
        "What is a dependency of useCallback that reads productId?",
        ["An empty list", "Only the setter", "productId"],
        2,
        "Reactive values referenced inside callbacks belong in dependencies to avoid stale closures.",
        "Dependencies",
        "react/effects-and-lifecycle",
      ),
    ],
  },
  {
    id: "typescript",
    title: "TypeScript",
    skill: "TypeScript",
    level: "Intermediate",
    checks: [
      check(
        "What relationship does identity<T>(value: T): T preserve?",
        [
          "Output has the input's inferred type",
          "All values become unknown",
          "Runtime validation of input",
        ],
        0,
        "Generics preserve compile-time relationships. Types do not validate untrusted runtime data.",
        "Generics",
        "typescript/generics",
      ),
      check(
        "How should you access a property of unknown?",
        [
          "Cast to any immediately",
          "Narrow or validate the value first",
          "Use a non-null assertion",
        ],
        1,
        "unknown requires evidence such as typeof or a validator before safe access.",
        "Narrowing",
        "typescript/type-narrowing",
      ),
      check(
        "What remains after TypeScript compiles an interface?",
        ["A runtime validator", "A JavaScript class", "No interface at runtime"],
        2,
        "Interfaces are erased. Validate API data separately at runtime.",
        "Runtime boundaries",
        "typescript/type-fundamentals",
      ),
      check(
        "For a discriminated union, what enables branch-specific access?",
        [
          "A shared literal discriminant",
          "Identical property names everywhere",
          "Using Object instead",
        ],
        0,
        "Checking a literal tag narrows to the matching union member.",
        "Unions",
        "typescript/union-and-intersection-types",
      ),
    ],
  },
  {
    id: "system-design",
    title: "Frontend system design",
    skill: "Frontend system design",
    level: "Senior engineer",
    checks: [
      check(
        "What must be included in a private data cache key?",
        [
          "Only the resource name",
          "User/tenant scope and request parameters",
          "A random number per render",
        ],
        1,
        "Cache identity must isolate private scopes and represent the actual requested resource.",
        "Caching",
        "system-design/data-fetching-and-caching",
      ),
      check(
        "Where must authorization be enforced?",
        ["In the sidebar", "Only in the browser", "On the server for every protected operation"],
        2,
        "Hidden UI is not a security boundary; the server must verify permissions.",
        "Security",
        "engineering/authentication-and-authorization",
      ),
      check(
        "What should precede choosing micro-frontends?",
        [
          "Ownership, deployment and operational requirements",
          "Choosing a bundler",
          "Splitting every component into an app",
        ],
        0,
        "Independent delivery can justify federation, but it adds runtime, versioning and integration costs.",
        "Architecture",
        "system-design/micro-frontends",
      ),
      check(
        "What is essential for an optimistic mutation?",
        [
          "Never show errors",
          "Rollback or reconciliation on failure",
          "Invalidate every cache on each keystroke",
        ],
        1,
        "Optimistic state needs a way to reconcile rejection and conflicting updates.",
        "Mutations",
        "system-design/data-fetching-and-caching",
      ),
    ],
  },
];
export function scoreAssessment(
  assessment: Assessment,
  answers: number[],
  date: string,
): AssessmentResult {
  const correct = assessment.checks.filter((c, i) => answers[i] === c.correct).length;
  return {
    id: assessment.id,
    skill: assessment.skill,
    total: assessment.checks.length,
    correct,
    score: Math.round((correct / assessment.checks.length) * 100),
    weakTopics: assessment.checks.filter((c, i) => answers[i] !== c.correct).map((c) => c.topic),
    date,
    answers: [...answers],
  };
}
