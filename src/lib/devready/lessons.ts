import { assessments, type Check } from "./assessments";
export type LessonContent = {
  concept: string;
  purpose: string;
  importance: string;
  internal: string;
  model: string[];
  code: string;
  production: string;
  mistakes: string[];
  best: string[];
  performance: string;
  interview: string;
  senior: string;
  followups: string[];
  exercise: string;
  checks: Check[];
};
const checks = (id: string, topics: string[]) =>
  assessments.find((a) => a.id === id)?.checks.filter((c) => topics.includes(c.topic)) ?? [];
export const lessons: Record<string, LessonContent> = {
  "javascript/javascript-fundamentals": {
    concept:
      "JavaScript values fall into primitive types (undefined, null, boolean, number, bigint, string and symbol) and objects. Variables are bindings to those values; the binding and the value have different rules.",
    purpose:
      "A dynamic language lets web pages react to user input without declaring a static type for every variable. Its flexibility requires explicit contracts at application boundaries.",
    importance:
      "Understanding identity, mutation and coercion explains bugs in form input, comparisons, state updates and API parsing.",
    internal:
      "let and const are lexical declarations. Their bindings exist before initialization but cannot be accessed in the temporal dead zone. const prevents rebinding; it does not freeze an object. Object equality compares identity, while primitive equality compares values without coercion when using ===.",
    model: ["Binding", "Value or object reference", "Operations", "New value or mutation"],
    code: 'const account = { name: "Mira" };\naccount.name = "Sam"; // object mutation is allowed\nconst copy = { ...account };\nconsole.log(account === copy); // false\nconsole.log(Number("42") + 1); // 43\nconsole.log("42" + 1); // "421"',
    production:
      "A number input produces a string. Convert intentionally and validate Number.isFinite before calculating a total. When updating React state, create a new object so identity accurately represents a change.",
    mistakes: [
      "Treating const as deep immutability.",
      "Comparing two separately created objects and expecting structural equality.",
      "Accepting implicit coercion for money or quantities.",
    ],
    best: [
      "Use const by default and let for intentional reassignment.",
      "Validate values from forms and APIs at the boundary.",
      "Prefer === and explicit conversions in business calculations.",
    ],
    performance:
      "Object spreads create shallow copies, not deep clones. Copying very large structures on every interaction can be expensive; measure before choosing a persistent data structure or finer state boundary.",
    interview:
      "Variables bind to values. Primitives compare by value and objects by identity. const fixes a binding, not the object, and JavaScript can coerce operands unless I convert and validate explicitly.",
    senior:
      "Define whether data is mutable, which module owns changes and what callers may retain. TypeScript cannot validate untrusted runtime data. Avoid a global freeze policy without considering nested references and hot paths.",
    followups: [
      "What does Object.is do differently from ===?",
      "Why is a spread copy shallow?",
      "What happens to NaN in comparisons?",
    ],
    exercise:
      "Write parseQuantity(value) that converts a non-empty string to a non-negative integer and rejects invalid, fractional or infinite values. Test empty input, '0', '12', '-1', '1.5' and 'abc'.",
    checks: checks("js-fundamentals", ["Bindings", "Equality", "Functions"]),
  },
  "javascript/execution-context": {
    concept:
      "An execution context records the environment needed to run a script or function: its lexical bindings, outer environment and this binding.",
    purpose:
      "Nested functions and method calls need a reliable way to resolve identifiers and distinguish active invocations.",
    importance:
      "Execution contexts explain why local variables are independent per call, why recursive functions grow the stack and why moving a callback can change this.",
    internal:
      "Calling a function creates a function context and pushes it onto the call stack. Identifier lookup walks lexical environments, based on where code was defined rather than who called it. When execution returns, the context leaves the stack, but environments referenced by closures may survive.",
    model: ["Function call", "Create context", "Resolve lexical names", "Return / pop stack"],
    code: 'const label = "outer";\nfunction makeReader() {\n  const label = "inner";\n  return function read() { return label; };\n}\nconst read = makeReader();\nconsole.log(read()); // inner',
    production:
      "A recursive tree renderer or parser can exhaust the call stack on deep user-provided data. An iterative stack gives you an explicit depth budget and more predictable error handling.",
    mistakes: [
      "Confusing the call stack with the scope chain.",
      "Assuming returned functions lose all access to locals.",
      "Relying on the caller's scope to resolve an identifier.",
    ],
    best: [
      "Trace definition sites for identifier lookup.",
      "Bound recursion depth for untrusted structures.",
      "Treat function invocation and lexical lifetime as separate concepts.",
    ],
    performance:
      "Large synchronous stacks block the main thread. Stack depth and retained environments are separate memory costs. An asynchronous boundary removes the current call stack but does not discard closed-over data.",
    interview:
      "A function call gets an execution context on the stack. Its lexical environment resolves names through definition-time scope, while the stack describes the active calling sequence.",
    senior:
      "Distinguish synchronous exceptions from promise rejections when tracing a production failure. Async stack traces are a debugging aid, not proof that the original synchronous context remains active.",
    followups: [
      "How does this differ for an arrow function?",
      "Can a context leave the stack while its environment survives?",
      "What is the temporal dead zone?",
    ],
    exercise:
      "Trace three nested calls, draw the stack at the innermost call, then return a closure and identify which environment it retains.",
    checks: checks("js-fundamentals", ["Closures"]),
  },
  "javascript/scope-and-closures": {
    concept:
      "A closure is a function with access to its definition-time lexical environment. It captures bindings, not immutable copies of their values.",
    purpose:
      "Functions must retain access to the variables they were defined with, even when used later as callbacks or returned from a factory.",
    importance:
      "Closures underpin event handlers, debounce, module encapsulation and hooks. They also explain stale values and memory retention.",
    internal:
      "Every factory call creates a distinct environment. A returned function holds a reference to that environment. Reads observe the current binding within it. A new React render creates new bindings, so an old callback may retain a previous render's values.",
    model: ["Factory invocation", "Lexical environment", "Returned callback", "Retained bindings"],
    code: "function createCounter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    read: () => count\n  };\n}\nconst a = createCounter();\nconst b = createCounter();\na.increment();\nconsole.log(a.read(), b.read()); // 1, 0",
    production:
      "A debounced save handler retains the latest arguments and a timer in one environment. Remove listeners and cancel timers on teardown so closed-over UI data is not retained indefinitely.",
    mistakes: [
      "Calling a closure a frozen snapshot in every context.",
      "Retaining a large object in a long-lived event listener.",
      "Using var in a loop and expecting a fresh per-iteration binding.",
    ],
    best: [
      "Make retained state small and explicit.",
      "Provide unsubscribe/cancel cleanup for long-lived callbacks.",
      "Use functional React state updates when relying on queued previous state.",
    ],
    performance:
      "Closure creation is usually cheap compared with rendering or network work. Reachability, rather than whether a function has returned, determines whether captured objects can be collected.",
    interview:
      "A closure is a function plus its lexical environment. Each outer call creates its own bindings, which remain reachable while a returned callback references them.",
    senior:
      "Explain the lifetime of subscriptions and request callbacks, not just the syntax. A closure can be correct in a factory but stale relative to the current render; dependencies and cancellation solve different parts of that problem.",
    followups: [
      "Why do let and var behave differently in loops?",
      "How would you prove a retained listener leaks memory?",
      "How do React render snapshots affect callbacks?",
    ],
    exercise:
      "Implement a counter factory with increment, decrement and reset. Create two counters and verify changing one does not affect the other. Then implement debounce using the same environment model.",
    checks: checks("js-fundamentals", ["Closures"]).concat(checks("advanced-js", ["Memory"])),
  },
  "javascript/promises": {
    concept:
      "A Promise represents the eventual outcome of an operation. It can be pending, fulfilled or rejected; once settled, its outcome cannot be changed.",
    purpose:
      "Promises compose asynchronous outcomes without nesting every continuation and error handler as a callback.",
    importance:
      "Correct promise composition prevents floating errors, unnecessary serial requests and mistaken assumptions about cancellation.",
    internal:
      "The Promise constructor's executor runs synchronously. Reactions registered by then run asynchronously as microtasks. then returns a new promise that adopts the callback's returned value or promise; thrown errors become rejections. Promise.all preserves input order and rejects when an input rejects, without cancelling the underlying operations.",
    model: ["Start operation", "Pending", "Settle once", "Queue reaction"],
    code: 'async function loadDashboard() {\n  const [profile, projects] = await Promise.all([\n    fetch("/api/profile").then(r => {\n      if (!r.ok) throw new Error("Profile unavailable");\n      return r.json();\n    }),\n    fetch("/api/projects").then(r => r.json())\n  ]);\n  return { profile, projects };\n}',
    production:
      "Fetch independent dashboard resources concurrently. Use allSettled for partial success, AbortController for cancellation and a bounded pool rather than launching thousands of requests at once.",
    mistakes: [
      "Thinking creating a promise moves CPU work to another thread.",
      "Forgetting to return the inner promise from then.",
      "Assuming Promise.all cancels remaining requests on rejection.",
    ],
    best: [
      "Return or await asynchronous work whose errors matter.",
      "Validate HTTP status; fetch does not reject on every HTTP error.",
      "Choose fail-fast or partial success deliberately.",
    ],
    performance:
      "Concurrent requests reduce latency for independent resources, but unbounded concurrency overloads services. Use workers for CPU-heavy computation rather than Promise.resolve().",
    interview:
      "Promises represent eventual outcomes and chain via microtask reactions. then returns a new promise. Promise.all joins independent operations in input order, with fail-fast rejection but no cancellation.",
    senior:
      "Define request budgets, partial failure behavior, cancellation and retry idempotency. A retry of a non-idempotent mutation can duplicate side effects even if the browser saw a network error.",
    followups: [
      "How do allSettled and race differ?",
      "When does a then callback run?",
      "How do you limit concurrency?",
    ],
    exercise:
      "Write loadCards(urls) with at most three in-flight requests. Preserve input ordering and return individual success or error records. Test one rejection and one slow response.",
    checks: checks("advanced-js", ["Promises"]),
  },
  "javascript/the-event-loop": {
    concept:
      "The browser event loop coordinates tasks, microtask checkpoints and rendering opportunities around single-threaded JavaScript execution.",
    purpose:
      "Inputs, timers and network completions need to run without interrupting an active JavaScript stack.",
    importance:
      "Scheduling determines observable order and responsiveness. A long handler or an unbounded microtask chain delays input and painting.",
    internal:
      "A task runs to completion. At a microtask checkpoint the browser drains queued promise reactions and queueMicrotask callbacks, including newly queued microtasks. The browser may then update rendering when appropriate; a paint is not guaranteed after every task. Timer delays make tasks eligible, not immediate.",
    model: ["Run task", "Drain microtasks", "Rendering opportunity", "Next task"],
    code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");\n// A, D, C, B',
    production:
      "Break a large import into batches and yield between tasks. Use a Web Worker for substantial CPU work. For visual updates, coordinate with requestAnimationFrame rather than assuming a timer aligns with paint.",
    mistakes: [
      "Assuming setTimeout(fn, 0) means immediate execution.",
      "Using promise chains to make CPU work non-blocking.",
      "Recursively filling the microtask queue and starving rendering.",
    ],
    best: [
      "Keep interactive handlers short.",
      "Use measured traces to locate long tasks.",
      "Separate CPU work, scheduling and network concurrency.",
    ],
    performance:
      "Yielding improves fairness but adds overhead. Pick a batch size using representative low-end devices. Timers may be clamped and background tabs are throttled, so never treat them as a precise clock.",
    interview:
      "JavaScript runs a task to completion, then microtasks drain before another task. Rendering happens at browser-controlled opportunities. Promises are microtasks and timers schedule tasks, so zero delay is not an execution guarantee.",
    senior:
      "Explain input delay, handler duration and presentation delay separately when investigating INP. An asynchronous function still executes synchronously until its first suspension; awaiting a resolved promise may not yield a rendering opportunity.",
    followups: [
      "Can a microtask enqueue another microtask?",
      "Does await guarantee a paint?",
      "When would a Web Worker be preferable?",
    ],
    exercise:
      "Predict the order of nested promise callbacks and a timer, verify in a browser, then replace a 100,000-item synchronous loop with batches that yield between tasks.",
    checks: checks("advanced-js", ["Event loop", "Scheduling"]),
  },
  "react/jsx-and-rendering": {
    concept:
      "React rendering computes a description of the desired UI. Committing applies the required host changes; rendering a component does not imply its DOM changed.",
    purpose:
      "A declarative UI needs to reconcile changing state with an existing interface while preserving component identity.",
    importance:
      "Separating render from commit makes side effects, state snapshots and performance profiling understandable.",
    internal:
      "A state update schedules work. React calls components to compute their next output and reconciles elements by type, key and position. The render phase must be pure and can be restarted. The commit phase applies changes and runs layout-related work; effects synchronize external systems separately.",
    model: ["State update", "Pure render", "Reconciliation", "Commit"],
    code: "function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => {\n    setCount(c => c + 1);\n    setCount(c => c + 1);\n  }}>{count}</button>;\n}\n// One click queues two increments.",
    production:
      "When rows reorder, use stable record IDs as keys. Otherwise an input's local state can become associated with a different row. Keep request creation out of render.",
    mistakes: [
      "Equating every render with a DOM mutation.",
      "Mutating state objects and retaining the same identity.",
      "Using array indices as keys for reorderable lists.",
    ],
    best: [
      "Keep render pure.",
      "Use functional updates for changes based on queued state.",
      "Choose state boundaries near the features that own changes.",
    ],
    performance:
      "Measure render and commit durations separately. React.memo can reduce parent-driven work for stable props but adds comparison cost and cannot block local state or consumed context changes.",
    interview:
      "React renders to compute the next UI and commits required changes. Type, key and position determine identity. State belongs to a render snapshot, while functional updaters operate on queued previous state.",
    senior:
      "Discuss restartable rendering, external-store consistency and the difference between expensive computation and expensive layout. Strict Mode's development checks help reveal impure rendering rather than being a production double-render contract.",
    followups: [
      "What causes a component render?",
      "How do keys affect state lifetime?",
      "When does memo help?",
    ],
    exercise:
      "Build a reorderable list with editable rows. Compare index keys and stable IDs, then explain why edits follow the wrong item with unstable identity.",
    checks: checks("react-fundamentals", ["Rendering", "Identity", "State"]),
  },
  "react/effects-and-lifecycle": {
    concept:
      "An effect synchronizes a committed component with an external system. Its cleanup undoes synchronization that no longer belongs to the current render.",
    purpose:
      "Connections, subscriptions, timers and requests must track reactive values and stop when their owner changes or unmounts.",
    importance:
      "Effects without correct dependencies and cleanup produce stale data, duplicate listeners and race conditions.",
    internal:
      "After a commit, React runs an effect when its dependencies changed according to Object.is. Before re-running it, React invokes the previous cleanup. An effect's callback closes over that render's values. Development Strict Mode runs an extra setup/cleanup cycle to test symmetry.",
    model: ["Commit", "Effect setup", "Dependency change", "Cleanup → setup"],
    code: 'useEffect(() => {\n  let ignore = false;\n  const controller = new AbortController();\n  async function load() {\n    try {\n      const r = await fetch(`/api/users/${id}`, { signal: controller.signal });\n      if (!r.ok) throw new Error("Request failed");\n      const user = await r.json();\n      if (!ignore) setUser(user);\n    } catch (e) {\n      if (!ignore && e.name !== "AbortError") setError(e);\n    }\n  }\n  load();\n  return () => { ignore = true; controller.abort(); };\n}, [id]);',
    production:
      "A user search can return requests out of order. Abort obsolete fetches and guard application of stale results; abort alone does not cancel every possible downstream transformation.",
    mistakes: [
      "Omitting dependencies to suppress re-runs.",
      "Using effects for values that can be derived during render.",
      "Treating cleanup only as unmount behavior.",
    ],
    best: [
      "Make setup and cleanup symmetric.",
      "List reactive dependencies rather than disabling lint rules.",
      "Prefer a query layer for cache identity, request deduplication and retries.",
    ],
    performance:
      "Effect-driven data loading can introduce waterfalls. Start independent requests together and keep expensive transformations out of the effect's synchronous setup when they block interactions.",
    interview:
      "Effects synchronize external systems after commit. Dependencies identify which render values the synchronization uses, and cleanup invalidates obsolete work before setup runs again or the component leaves.",
    senior:
      "Cancellation, stale-response guards and cache invalidation solve different concerns. Discuss ownership, error states, retry policy and server rendering: effects do not run on the server.",
    followups: [
      "Why does Strict Mode run setup twice in development?",
      "When do you need useLayoutEffect?",
      "Why isn't a filtered list usually effect state?",
    ],
    exercise:
      "Build a user lookup that switches IDs rapidly. Add a deliberately slow response and verify it never replaces a newer selection. Verify cleanup on unmount.",
    checks: checks("react-fundamentals", ["Effects"]).concat(
      checks("react-performance", ["Dependencies"]),
    ),
  },
  "typescript/generics": {
    concept:
      "Generics express relationships between input and output types without erasing information to any or forcing one concrete type.",
    purpose:
      "Reusable functions and structures need to preserve callers' specific types while enforcing only the operations they require.",
    importance:
      "A generic fetch result, collection helper or component prop contract preserves useful type inference across boundaries.",
    internal:
      "Type parameters are compile-time placeholders inferred from arguments or supplied explicitly. Constraints limit acceptable types, but retain their specific shape. Types are erased at runtime; a generic signature does not validate JSON.",
    model: ["Caller type", "Infer T", "Apply constraint", "Preserve relationship"],
    code: 'function first<T>(items: readonly T[]): T | undefined {\n  return items[0];\n}\nfunction getId<T extends { id: string }>(value: T): string {\n  return value.id;\n}\nconst item = first([{ id: "a", name: "Mira" }]);\n// { id: string; name: string } | undefined',
    production:
      "A typed table can relate its rows to column accessors. Parse API data with a runtime validator before treating it as T; do not cast arbitrary JSON and claim type safety.",
    mistakes: [
      "Using a type parameter only once with no meaningful relationship.",
      "Replacing unknown with any at an API boundary.",
      "Claiming generics add runtime validation.",
    ],
    best: [
      "Constrain only the shape your implementation needs.",
      "Allow inference where it stays clear.",
      "Represent empty results honestly with undefined or a tagged union.",
    ],
    performance:
      "Generics have no direct runtime execution cost after erasure. Very complex recursive or conditional types can slow editor and compiler feedback; balance expressiveness with maintainable diagnostics.",
    interview:
      "Generics preserve type relationships in reusable APIs. A constraint establishes a minimum shape while inference keeps the caller's more specific type. They disappear at runtime.",
    senior:
      "Design APIs for inference and understandable errors. Prefer discriminated unions over broad optional fields for state machines, and validate runtime boundaries independently from static types.",
    followups: [
      "How does extends constrain a parameter?",
      "What is a default type parameter?",
      "When is unknown better than T?",
    ],
    exercise:
      "Implement groupBy<T, K extends PropertyKey>(items, keyOf) and type its result. Test empty input and keys returned by the selector without using any.",
    checks: checks("typescript", ["Generics", "Runtime boundaries"]),
  },
  "html-css/semantic-html": {
    concept:
      "Semantic HTML conveys the role and structure of content using elements such as main, nav, headings, lists, buttons and form labels.",
    purpose:
      "Browsers and assistive technology need machine-readable structure beyond visual styling.",
    importance:
      "A styled div does not automatically provide focus behavior, keyboard activation or an accessible name. Correct elements reduce custom interaction code.",
    internal:
      "The browser builds a DOM and derives an accessibility tree using native semantics and supported ARIA attributes. Native controls bring keyboard behavior; ARIA describes semantics but does not implement interaction.",
    model: ["HTML structure", "DOM", "Accessibility tree", "Assistive navigation"],
    code: '<main>\n  <h1>Projects</h1>\n  <form>\n    <label for="search">Search projects</label>\n    <input id="search" type="search" />\n    <button type="submit">Search</button>\n  </form>\n  <ul><li><a href="/projects/alpha">Alpha</a></li></ul>\n</main>',
    production:
      "A dashboard with clear landmarks and labelled controls lets keyboard and screen-reader users reach search, navigation and results without traversing every decorative element.",
    mistakes: [
      "Using div click handlers instead of buttons.",
      "Replacing labels with placeholders.",
      "Adding ARIA roles without the matching keyboard interaction.",
    ],
    best: [
      "Start with native elements.",
      "Keep heading hierarchy meaningful.",
      "Test keyboard focus and accessible names with real controls.",
    ],
    performance:
      "Semantic structure generally costs less code than custom controls. Avoid unnecessary DOM nesting, but do not remove useful structure solely to reduce node counts.",
    interview:
      "Semantic elements communicate structure and often provide built-in behavior. ARIA can fill gaps, but it does not add keyboard support, so native HTML is the first choice.",
    senior:
      "Treat accessibility as part of the feature contract and regression tests. Dynamic dialogs, notifications and errors require focus and announcement decisions beyond choosing the right tag.",
    followups: [
      "When would aria-label be appropriate?",
      "What distinguishes a link from a button?",
      "Does role='button' add keyboard behavior?",
    ],
    exercise:
      "Build a labelled search form and results list using only native semantic elements. Navigate it without a mouse and inspect its accessible names.",
    checks: [],
  },
  "html-css/grid": {
    concept:
      "CSS Grid is a two-dimensional layout system that coordinates rows and columns. Flexbox primarily distributes items along one axis.",
    purpose:
      "Complex aligned layouts need a shared track system without manually positioning each element.",
    importance:
      "Intrinsic tracks and minmax allow interfaces to adapt to available space and content rather than a fragile set of fixed pixel widths.",
    internal:
      "The grid sizing algorithm resolves track constraints and distributes available space. fr represents a share of remaining space. minmax defines minimum and maximum bounds, while auto-fit collapses empty repeated tracks.",
    model: ["Container width", "Track constraints", "Place items", "Distribute space"],
    code: ".projects {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));\n  gap: 16px;\n}\n.project { min-width: 0; overflow-wrap: anywhere; }",
    production:
      "A project collection can grow from one column on a phone to several columns on desktop without hardcoding a breakpoint for every width. Combine Grid for the page with Flexbox for a row of actions.",
    mistakes: [
      "Using a 240px minimum that overflows a narrower container.",
      "Ignoring min-width: auto for long content.",
      "Changing visual order while leaving confusing keyboard order.",
    ],
    best: [
      "Use minmax(0, 1fr) for tracks that must shrink.",
      "Bound minimum card width to available space.",
      "Keep DOM reading order aligned with meaningful visual order.",
    ],
    performance:
      "Layout cost grows with DOM complexity and interdependent sizing. Avoid repeated read/write layout cycles in JavaScript; native layout handles resizing without per-frame measurement code.",
    interview:
      "Grid aligns rows and columns, while Flexbox is primarily one-dimensional. Intrinsic sizing, fr and minmax distribute available space while respecting content constraints.",
    senior:
      "Explain responsive behavior using content constraints, not just device labels. Check localization, zoom, long unbroken strings and accessible reading order when changing layout.",
    followups: [
      "How do auto-fit and auto-fill differ?",
      "Why use min-width: 0?",
      "When is Flexbox the simpler choice?",
    ],
    exercise:
      "Build a project grid that works in a 220px container and a 1200px container. Include one long unbroken title and verify no horizontal overflow.",
    checks: [],
  },
};
// Only equivalent concepts share content. Other modules remain explicitly scoped outlines.
lessons["javascript/microtasks-and-macrotasks"] = lessons[
  "javascript/the-event-loop"
] as LessonContent;
lessons["react/react-fundamentals"] = lessons["react/jsx-and-rendering"] as LessonContent;
lessons["react/reconciliation"] = {
  ...(lessons["react/jsx-and-rendering"] as LessonContent),
  concept:
    "Reconciliation matches the previous and next element trees using type, key and position to decide which component instances and host nodes can be reused.",
  exercise:
    "Build two counters and toggle their order. Preserve state with stable keys, then deliberately change a key to demonstrate a reset.",
};

lessons["html-css/accessibility"] = {
  ...(lessons["html-css/semantic-html"] as LessonContent),
  concept:
    "Web accessibility makes interfaces perceivable, operable, understandable and robust for people with varied input methods and assistive technologies.",
  purpose:
    "Visual appearance does not convey all information or behavior. Keyboard and screen-reader users need names, relationships, focus management and meaningful state changes.",
  internal:
    "The browser exposes an accessibility tree derived from DOM semantics and ARIA. Focus determines keyboard ownership, while live regions announce selected dynamic changes. An aria attribute describes semantics but does not implement behavior.",
  code: '<dialog aria-labelledby="confirm-title">\n  <h2 id="confirm-title">Delete this project?</h2>\n  <p>This action cannot be undone.</p>\n  <button type="button">Cancel</button>\n  <button type="button">Delete</button>\n</dialog>\n<!-- Open with showModal(), manage initial focus and restore focus on close. -->',
  production:
    "Use a tested dialog primitive for destructive actions. Choose safe initial focus, keep background content inert, support Escape and restore focus to the trigger or a logical successor.",
  mistakes: [
    "Assuming aria-modal creates keyboard trapping.",
    "Using color alone to show validation errors.",
    "Removing a focused element without moving focus logically.",
  ],
  exercise:
    "Build a confirmation dialog with a tested primitive. Verify Tab containment, Escape, accessible name and restored trigger focus. Test a trigger removed by the confirmed action.",
  checks: [
    {
      question: "Does aria-modal alone implement keyboard focus trapping?",
      options: ["Yes", "No, interaction must be implemented separately", "Only in React"],
      correct: 1,
      reason:
        "ARIA describes the modal state, not its keyboard behavior. Use native modal dialog behavior or a tested primitive.",
      topic: "Dialog behavior",
      lesson: "html-css/accessibility",
    },
  ],
};
const grid = lessons["html-css/grid"];
if (grid)
  grid.checks = [
    {
      question: "Which system coordinates rows and columns?",
      options: ["Grid", "Flexbox only", "Absolute positioning only"],
      correct: 0,
      reason: "Grid is two-dimensional. Flexbox handles one main axis at a time.",
      topic: "Layout",
      lesson: "html-css/grid",
    },
  ];
