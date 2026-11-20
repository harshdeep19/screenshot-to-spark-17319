export type LearningPath = {
  id: string;
  title: string;
  description: string;
  symbol: string;
  tone: string;
  level: string;
  hours: number;
  progress: number;
  modules: string[];
  prerequisites: string;
};
export const paths: LearningPath[] = [
  {
    id: "javascript",
    title: "JavaScript Mastery",
    description:
      "Go beyond the syntax. Understand the language that powers the web, from execution context to advanced patterns.",
    symbol: "JS",
    tone: "js",
    level: "All levels",
    hours: 32,
    progress: 64,
    prerequisites: "Basic HTML and a curious mind",
    modules: [
      "JavaScript fundamentals",
      "Execution context",
      "Scope and closures",
      "Hoisting",
      "The this keyword",
      "Prototypes and inheritance",
      "Objects and arrays",
      "Array methods",
      "Promises",
      "Async / await",
      "The event loop",
      "Microtasks and macrotasks",
      "Error handling",
      "Memory management",
      "Browser APIs",
      "Performance optimization",
      "Advanced JavaScript patterns",
    ],
  },
  {
    id: "react",
    title: "React.js Mastery",
    description:
      "Build a mental model of React. Learn rendering, hooks, performance, and production-ready architecture.",
    symbol: "⚛",
    tone: "react",
    level: "Intermediate",
    hours: 40,
    progress: 42,
    prerequisites: "JavaScript fundamentals, promises and array methods",
    modules: [
      "React fundamentals",
      "JSX and rendering",
      "Components and props",
      "State management",
      "Hooks",
      "Effects and lifecycle",
      "useMemo and useCallback",
      "React.memo",
      "Context API",
      "Reducers",
      "Custom hooks",
      "Reconciliation",
      "Virtual DOM",
      "Fiber architecture",
      "Error boundaries",
      "Suspense",
      "Lazy loading",
      "Performance optimization",
      "React architecture",
      "Testing React applications",
    ],
  },
  {
    id: "typescript",
    title: "TypeScript for Frontend",
    description:
      "Write safer, more expressive code. Make the type system work for you, not against you.",
    symbol: "TS",
    tone: "ts",
    level: "Intermediate",
    hours: 24,
    progress: 28,
    prerequisites: "Comfortable writing JavaScript",
    modules: [
      "Type fundamentals",
      "Interfaces and type aliases",
      "Union and intersection types",
      "Generics",
      "Utility types",
      "Type narrowing",
      "Type inference",
      "Advanced types",
      "React with TypeScript",
      "API response typing",
      "Real-world TypeScript patterns",
    ],
  },
  {
    id: "nextjs",
    title: "Next.js Mastery",
    description:
      "Explore modern rendering, caching boundaries, and full-stack React application patterns.",
    symbol: "N",
    tone: "ts",
    level: "Intermediate",
    hours: 30,
    progress: 0,
    prerequisites: "React components, hooks and HTTP basics",
    modules: [
      "Next.js fundamentals",
      "App Router",
      "File-based routing",
      "Server and client components",
      "Server-side rendering",
      "Static generation",
      "Dynamic rendering",
      "Data fetching",
      "Caching",
      "Server actions",
      "Middleware",
      "Authentication",
      "Performance optimization",
      "Deployment",
    ],
  },
  {
    id: "html-css",
    title: "HTML & CSS Mastery",
    description:
      "Create accessible, resilient interfaces with a strong foundation in layout and browser rendering.",
    symbol: "#",
    tone: "react",
    level: "Beginner",
    hours: 20,
    progress: 15,
    prerequisites: "No prior experience required",
    modules: [
      "Semantic HTML",
      "Accessibility",
      "CSS fundamentals",
      "Flexbox",
      "Grid",
      "Positioning",
      "Responsive design",
      "CSS architecture",
      "Animations",
      "Browser rendering",
      "Web performance",
    ],
  },
  {
    id: "engineering",
    title: "Frontend Engineering",
    description:
      "Bridge the gap between writing components and shipping reliable production applications.",
    symbol: "</>",
    tone: "js",
    level: "Advanced",
    hours: 36,
    progress: 12,
    prerequisites: "JavaScript and React experience",
    modules: [
      "Browser architecture",
      "HTTP and networking",
      "REST APIs",
      "Authentication and authorization",
      "State management",
      "Caching",
      "Frontend security",
      "Performance",
      "Accessibility",
      "Web vitals",
      "Testing",
      "Build tools",
      "CI/CD",
      "Design systems",
    ],
  },
  {
    id: "system-design",
    title: "Frontend System Design",
    description:
      "Think in systems. Design scalable interfaces and defend meaningful architectural trade-offs.",
    symbol: "⌘",
    tone: "ts",
    level: "Advanced",
    hours: 28,
    progress: 8,
    prerequisites: "Production frontend development experience",
    modules: [
      "Component architecture",
      "Application architecture",
      "Folder structures",
      "State management architecture",
      "Data fetching and caching",
      "Rendering strategies",
      "SSR, CSR and SSG",
      "Scalability",
      "Micro-frontends",
      "Module Federation",
      "Authentication in large applications",
      "Multi-tenancy",
      "Performance architecture",
      "Real-world system design",
    ],
  },
];
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export type Question = {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: string;
  answer: string;
  explanation: string;
  code: string;
  followups: string[];
};
export const questions: Question[] = [
  {
    id: "closures",
    title: "How do closures work in JavaScript?",
    category: "JavaScript",
    difficulty: "Medium",
    type: "Conceptual",
    answer:
      "A closure is a function together with references to its surrounding lexical environment. It can access those bindings even after the outer function returns.",
    explanation:
      "Functions capture bindings, not frozen copies of values. Every call to the outer function creates a distinct environment. This makes closures useful for private state, factories, and callbacks, but also means retained references can keep large objects in memory.",
    code: "function createCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst counter = createCounter();\ncounter(); // 1\ncounter(); // 2",
    followups: [
      "Do closures capture values or bindings?",
      "How can closures cause a memory leak?",
      "Why does var behave differently from let in a loop?",
    ],
  },
  {
    id: "event-loop",
    title: "Explain the event loop and microtask queue.",
    category: "JavaScript",
    difficulty: "Medium",
    type: "Frequently asked",
    answer:
      "JavaScript runs one task at a time. After the current stack clears, the browser drains the microtask queue before proceeding to another task and possible rendering.",
    explanation:
      "Promise reactions and queueMicrotask callbacks are microtasks; timers schedule tasks. A timer delay is a minimum, not an execution guarantee. Recursively scheduling microtasks can starve rendering and input.",
    code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");\n// A, D, C, B',
    followups: [
      "When does the browser render?",
      "Can a microtask schedule another microtask?",
      "Why is setTimeout not exact?",
    ],
  },
  {
    id: "react-rendering",
    title: "What causes a React component to re-render?",
    category: "React",
    difficulty: "Easy",
    type: "Frequently asked",
    answer:
      "A component may render when its state changes, its parent renders, or a context it consumes changes. Rendering does not necessarily mean the DOM changes.",
    explanation:
      "React computes the next UI during render, then commits required changes. memo can skip parent-driven renders when props are unchanged, but does not block local state or consumed context updates.",
    code: "const Profile = memo(function Profile({ name }) {\n  return <h2>{name}</h2>;\n});\n// Stable props allow a parent-driven render to be skipped.",
    followups: [
      "What is the difference between render and commit?",
      "When does React.memo help?",
      "Can memo block context updates?",
    ],
  },
  {
    id: "useeffect",
    title: "How do you prevent race conditions in useEffect?",
    category: "React",
    difficulty: "Hard",
    type: "Practical scenario",
    answer:
      "Cancel obsolete requests where supported and guard against applying stale results. Every effect should clean up work that no longer belongs to the current render.",
    explanation:
      "Network responses can arrive out of order. AbortController saves resources when fetch supports cancellation. An ignore flag additionally prevents obsolete responses from updating state. Include every reactive dependency.",
    code: 'useEffect(() => {\n  const controller = new AbortController();\n  fetch(`/api/users/${id}`, { signal: controller.signal })\n    .then(r => r.json())\n    .then(setUser)\n    .catch(e => { if (e.name !== "AbortError") setError(e); });\n  return () => controller.abort();\n}, [id]);',
    followups: [
      "What happens in Strict Mode?",
      "Should you derive state inside an effect?",
      "How would a query library help?",
    ],
  },
  {
    id: "generics",
    title: "When should you use TypeScript generics?",
    category: "TypeScript",
    difficulty: "Medium",
    type: "Conceptual",
    answer:
      "Use generics to preserve relationships between types across function arguments, results, or reusable data structures without losing information to any.",
    explanation:
      "A generic identity function returns the same inferred type supplied by the caller. Constraints describe the minimum shape required while preserving the more specific input type.",
    code: 'function first<T>(items: readonly T[]): T | undefined {\n  return items[0];\n}\nconst item = first(["React", "Vue"]); // string | undefined',
    followups: [
      "How do constraints differ from concrete types?",
      "What are default type parameters?",
      "How does inference work?",
    ],
  },
  {
    id: "web-vitals",
    title: "How would you diagnose a slow interaction?",
    category: "Performance",
    difficulty: "Hard",
    type: "Practical scenario",
    answer:
      "Measure INP in the field, reproduce with performance traces, and separate input delay, handler processing, and presentation delay before optimizing.",
    explanation:
      "Investigate long main-thread tasks, excessive rendering and expensive layout. Break up work, avoid layout thrashing and reduce unnecessary synchronous work. Validate improvements on representative devices.",
    code: "// Yield between batches rather than monopolizing the main thread.\nfor (const batch of batches) {\n  processBatch(batch);\n  await new Promise(resolve => setTimeout(resolve, 0));\n}",
    followups: [
      "How does INP differ from LCP?",
      "What is a long task?",
      "When would a Web Worker help?",
    ],
  },
  {
    id: "accessibility",
    title: "What makes a modal accessible?",
    category: "HTML",
    difficulty: "Medium",
    type: "Practical scenario",
    answer:
      "An accessible modal has a name, appropriate dialog semantics, managed keyboard focus, Escape dismissal, and an inert background while open.",
    explanation:
      "Move focus into the dialog, trap it within the modal, and restore it to the trigger when closed. Prefer native dialog or a tested accessible primitive rather than a custom focus implementation.",
    code: '<dialog aria-labelledby="dialog-title">\n  <h2 id="dialog-title">Confirm deletion</h2>\n  <button>Cancel</button>\n  <button>Delete</button>\n</dialog>',
    followups: [
      "Where should initial focus go?",
      "What is aria-modal?",
      "How do you test without a mouse?",
    ],
  },
  {
    id: "caching",
    title: "Design a frontend caching strategy.",
    category: "Frontend architecture",
    difficulty: "Hard",
    type: "Practical scenario",
    answer:
      "Separate server-state caches from UI state. Define stable cache keys, freshness policies, invalidation rules, and an explicit optimistic update rollback strategy.",
    explanation:
      "Cache identity must include parameters and user scope. A stale-while-revalidate model can keep navigation fast, while mutation-driven invalidation avoids outdated screens. Never reuse private data between users.",
    code: 'const queryKey = ["projects", userId, { page, status }];\n// After a successful mutation, invalidate related cache entries.\nqueryClient.invalidateQueries({ queryKey: ["projects", userId] });',
    followups: [
      "When should data expire?",
      "How do you handle optimistic errors?",
      "How do you prevent cross-user cache leakage?",
    ],
  },
  {
    id: "css-grid",
    title: "When would you choose Grid over Flexbox?",
    category: "CSS",
    difficulty: "Easy",
    type: "Conceptual",
    answer:
      "Choose Grid for two-dimensional layout and Flexbox for one-dimensional distribution. They work well together at different levels of an interface.",
    explanation:
      "Grid coordinates rows and columns. Flexbox distributes space along one primary axis. Use intrinsic sizing and minmax to let content adapt rather than hardcoding every screen size.",
    code: ".layout {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 16px;\n}",
    followups: [
      "What does minmax do?",
      "How does auto-fit differ from auto-fill?",
      "What is min-width: 0 useful for?",
    ],
  },
];
export type Challenge = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  example: string;
  solution: string;
  complexity: string;
  hint: string;
};
export const challenges: Challenge[] = [
  {
    id: "debounce",
    title: "Implement debounce",
    category: "JavaScript",
    difficulty: "Medium",
    description:
      "Implement debounce(fn, delay). The returned function should postpone invoking fn until delay milliseconds have elapsed since its last invocation. Preserve arguments and the calling context.",
    example:
      'const save = debounce(saveDraft, 300);\nsave("a"); save("ab"); save("abc");\n// Only saveDraft("abc") runs after 300 ms of inactivity.',
    solution:
      "function debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}",
    complexity: "O(1) per call; retains the latest arguments until execution.",
    hint: "Keep a timer in a closure. Clear the previous timer before scheduling a new one.",
  },
  {
    id: "two-sum",
    title: "Two Sum",
    category: "DSA Patterns",
    difficulty: "Easy",
    description:
      "Given an integer array and a target, return indices of two distinct elements whose sum equals the target. Assume exactly one valid pair exists.",
    example: "nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]",
    solution:
      "function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (seen.has(complement)) return [seen.get(complement), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}",
    complexity: "O(n) expected time and O(n) space.",
    hint: "Store previously seen values in a hash map. Look for the complement before inserting.",
  },
  {
    id: "flatten",
    title: "Flatten an array",
    category: "JavaScript",
    difficulty: "Medium",
    description:
      "Flatten an arbitrarily nested array without using Array.prototype.flat. Preserve element order.",
    example: "Input: [1, [2, [3]], 4]\nOutput: [1, 2, 3, 4]",
    solution:
      "function flatten(items) {\n  const result = [];\n  for (const item of items) {\n    if (Array.isArray(item)) result.push(...flatten(item));\n    else result.push(item);\n  }\n  return result;\n}",
    complexity:
      "Visits every element; recursive spread and intermediate arrays add copying overhead. Deep nesting can overflow the call stack.",
    hint: "Use Array.isArray to identify nesting and recurse into each subarray.",
  },
  {
    id: "autocomplete",
    title: "Build an autocomplete",
    category: "React Machine Coding",
    difficulty: "Hard",
    description:
      "Build a searchable suggestion input with debounced queries, keyboard navigation, loading and empty states. Prevent stale network responses from replacing current results.",
    example: 'Type "rea" → React, React Router\nArrow keys navigate. Enter selects. Escape closes.',
    solution:
      "// Reference architecture\n// 1. Controlled query and selected value\n// 2. Debounce query changes by 250ms\n// 3. Fetch with AbortController cleanup\n// 4. Track activeIndex for keyboard navigation\n// 5. Use combobox / listbox ARIA semantics",
    complexity: "Rendering O(k) suggestions; cache repeated searches.",
    hint: "Separate query, selection and highlighted suggestion. Use a tested combobox primitive.",
  },
  {
    id: "event-emitter",
    title: "Build an event emitter",
    category: "JavaScript",
    difficulty: "Hard",
    description:
      "Implement on, off and emit. Support several listeners per event and return an unsubscribe function from on.",
    example: 'const off = emitter.on("save", console.log);\nemitter.emit("save", "done");\noff();',
    solution:
      "function createEmitter() {\n  const events = new Map();\n  return {\n    on(event, fn) {\n      if (!events.has(event)) events.set(event, new Set());\n      events.get(event).add(fn);\n      return () => events.get(event)?.delete(fn);\n    },\n    emit(event, ...args) {\n      for (const fn of [...(events.get(event) ?? [])]) fn(...args);\n    }\n  };\n}",
    complexity: "O(1) expected registration; O(n) emission for n listeners.",
    hint: "Use a Map from event name to Set of callbacks.",
  },
  {
    id: "tabs",
    title: "Build accessible tabs",
    category: "React Machine Coding",
    difficulty: "Medium",
    description:
      "Implement a tab list and panels with controlled selection, arrow-key navigation, and correct ARIA relationships.",
    example: "Tabs: Overview | Details | Activity\nOnly the selected panel is visible.",
    solution:
      "// Use a tested tabs primitive.\n// Keep value in state and associate each trigger\n// with its panel using stable ids.\n// Support ArrowLeft / ArrowRight and Home / End.",
    complexity: "O(1) selection with lazily mounted panels.",
    hint: "Only the selected tab should be in the normal tab order.",
  },
];
export const designProblems = [
  "Design a scalable dashboard",
  "Design an e-commerce frontend",
  "Design a social media feed",
  "Design a notification system",
  "Design a reusable component library",
  "Design a large form engine",
  "Design a real-time collaboration app",
  "Design a multi-tenant SaaS application",
  "Design a micro-frontend architecture",
];
export const companies = [
  "Amazon",
  "Microsoft",
  "Adobe",
  "Walmart",
  "Atlassian",
  "Flipkart",
  "Razorpay",
  "PhonePe",
  "Swiggy",
  "Infosys",
];
export const pageHead = (title: string, description: string) => ({
  meta: [
    { title: `${title} · DevReady` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · DevReady` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
export function toggleItem(items: string[], id: string) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}
export function pathProgress(path: LearningPath, completed: string[]) {
  const count = path.modules.filter((module) =>
    completed.includes(`${path.id}/${slugify(module)}`),
  ).length;
  return Math.min(
    100,
    path.progress + Math.round((count / path.modules.length) * (100 - path.progress)),
  );
}
