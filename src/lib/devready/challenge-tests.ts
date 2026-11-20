export type SampleTest = { name: string; expression: string; expected: unknown };
export type RunnerSpec = {
  starter: string;
  tests: SampleTest[];
  requirements: string[];
  alternative: string;
};
export const runnerSpecs: Record<string, RunnerSpec> = {
  "two-sum": {
    starter:
      "function twoSum(nums, target) {\n  // Return the indices of two distinct elements.\n  return [];\n}",
    tests: [
      { name: "Basic pair", expression: "twoSum([2,7,11,15],9)", expected: [0, 1] },
      { name: "Duplicate values", expression: "twoSum([3,3],6)", expected: [0, 1] },
      { name: "Negative values", expression: "twoSum([-3,4,3,90],0)", expected: [0, 2] },
    ],
    requirements: [
      "Exactly one pair exists in the provided samples.",
      "Return earlier index first; never reuse the same element.",
      "Use numeric values and zero-based indices.",
    ],
    alternative:
      "A nested scan uses O(n²) time and O(1) extra space; a hash map trades O(n) space for expected O(n) time.",
  },
  flatten: {
    starter:
      "function flatten(items) {\n  // Preserve left-to-right order without Array.flat.\n  return [];\n}",
    tests: [
      { name: "Nested array", expression: "flatten([1,[2,[3]],4])", expected: [1, 2, 3, 4] },
      { name: "Empty input", expression: "flatten([])", expected: [] },
      {
        name: "Mixed values",
        expression: "flatten([null,[false,['x']]])",
        expected: [null, false, "x"],
      },
    ],
    requirements: [
      "Inputs contain nested arrays and scalar values.",
      "Preserve order and values, including null and false.",
      "Do not call Array.prototype.flat.",
    ],
    alternative:
      "An iterative stack avoids recursion depth limits. Push children in reverse order to preserve left-to-right output.",
  },
  debounce: {
    starter:
      "function debounce(fn, delay) {\n  // Retain a timer and the latest arguments.\n  return function (...args) {\n    fn.apply(this, args);\n  };\n}",
    tests: [
      {
        name: "Last call wins",
        expression:
          "(async () => { const values=[]; const fn=debounce(x=>values.push(x),20); fn('a'); fn('b'); await new Promise(r=>setTimeout(r,50)); return values; })()",
        expected: ["b"],
      },
      {
        name: "Calling context",
        expression:
          "(async () => { let result=0; const obj={ base:10, run:debounce(function(x){ result=this.base+x; },10) }; obj.run(2); await new Promise(r=>setTimeout(r,40)); return result; })()",
        expected: 12,
      },
      {
        name: "No early call",
        expression:
          "(() => { let count=0; const run=debounce(()=>count++,25); run(); return count; })()",
        expected: 0,
      },
    ],
    requirements: [
      "Invoke only after inactivity for delay milliseconds.",
      "Preserve the latest arguments and calling context.",
      "These timing samples are functional checks, not precision-timer guarantees.",
    ],
    alternative:
      "A leading-edge variant runs immediately and suppresses repeated calls during the delay. Cancellation and flush methods are useful production extensions.",
  },
  "event-emitter": {
    starter:
      "function createEmitter() {\n  return {\n    on(event, fn) { return () => {}; },\n    off(event, fn) {},\n    emit(event, ...args) {}\n  };\n}",
    tests: [
      {
        name: "Multiple listeners",
        expression:
          "(() => {const e=createEmitter(), out=[]; e.on('x',v=>out.push(v)); e.on('x',v=>out.push(v*2)); e.emit('x',3); return out;})()",
        expected: [3, 6],
      },
      {
        name: "Unsubscribe",
        expression:
          "(() => {const e=createEmitter(), out=[];const off=e.on('x',v=>out.push(v));off();e.emit('x',1);return out;})()",
        expected: [],
      },
      {
        name: "Explicit off",
        expression:
          "(() => {const e=createEmitter(), out=[];const fn=v=>out.push(v);e.on('x',fn);e.off('x',fn);e.emit('x',1);return out;})()",
        expected: [],
      },
    ],
    requirements: [
      "Expose on, off and emit.",
      "on returns an unsubscribe function.",
      "Support multiple listeners and ignore unknown event names.",
    ],
    alternative:
      "Snapshot listeners during emit to define mutation behavior. Decide whether one failing listener should stop the rest.",
  },
};
export type TestOutput = { name: string; passed: boolean; actual: string; expected: string };
export function gradeSamples(tests: SampleTest[], values: unknown[]): TestOutput[] {
  return tests.map((t, i) => ({
    name: t.name,
    passed: JSON.stringify(values[i]) === JSON.stringify(t.expected),
    actual: JSON.stringify(values[i]) ?? "undefined",
    expected: JSON.stringify(t.expected),
  }));
}

runnerSpecs["binary-search"] = {
  starter: "function binarySearch(nums, target) { return -1; }",
  tests: [
    { name: "Found", expression: "binarySearch([1,3,5,7],5)", expected: 2 },
    { name: "Absent", expression: "binarySearch([1,3,5],4)", expected: -1 },
    { name: "Empty", expression: "binarySearch([],1)", expected: -1 },
  ],
  requirements: [
    "Ascending numeric input; no mutations.",
    "Return an index or -1.",
    "Handle an empty array.",
  ],
  alternative: "Linear scan uses O(n) time and requires no sorted input.",
};
runnerSpecs["valid-palindrome"] = {
  starter: "function isPalindrome(text) { return false; }",
  tests: [
    {
      name: "Normalized phrase",
      expression: "isPalindrome('A man, a plan, a canal: Panama')",
      expected: true,
    },
    { name: "Not palindrome", expression: "isPalindrome('race a car')", expected: false },
    { name: "Empty", expression: "isPalindrome('')", expected: true },
  ],
  requirements: [
    "Ignore non-ASCII-alphanumeric characters and case.",
    "Empty normalized input is a palindrome.",
  ],
  alternative: "Two pointers can skip punctuation directly to avoid creating a normalized copy.",
};
runnerSpecs["longest-substring"] = {
  starter: "function longestSubstring(text) { return 0; }",
  tests: [
    { name: "Repeated pattern", expression: "longestSubstring('abcabcbb')", expected: 3 },
    { name: "Left edge never goes backwards", expression: "longestSubstring('abba')", expected: 2 },
    { name: "Code points", expression: "longestSubstring('😀a😀')", expected: 2 },
  ],
  requirements: [
    "Treat characters as Unicode code points.",
    "Return length, not the substring.",
    "Do not move the window start backwards.",
  ],
  alternative:
    "An expanding scan per start position uses O(n²) time; a sliding window reuses previous work.",
};
