import type { Challenge } from "../dev-data";
export const extraChallenges: Challenge[] = [
  {
    id: "binary-search",
    title: "Binary search",
    category: "DSA Patterns",
    difficulty: "Easy",
    description:
      "Find target in an ascending integer array. Return its index or -1 when absent. Do not modify the input.",
    example: "Input: [1,3,5,7], target=5\nOutput: 2",
    solution:
      "function binarySearch(nums, target) {\n  let low=0, high=nums.length-1;\n  while(low<=high) {\n    const mid=low+Math.floor((high-low)/2);\n    if(nums[mid]===target) return mid;\n    if(nums[mid]<target) low=mid+1;\n    else high=mid-1;\n  }\n  return -1;\n}",
    complexity: "O(log n) time, O(1) extra space.",
    hint: "Use inclusive low/high bounds and ensure each iteration removes mid from the search interval.",
  },
  {
    id: "valid-palindrome",
    title: "Valid palindrome",
    category: "DSA Patterns",
    difficulty: "Easy",
    description:
      "Return whether a string is a palindrome after ignoring non-ASCII-alphanumeric characters and case.",
    example: "Input: 'A man, a plan, a canal: Panama'\nOutput: true",
    solution:
      "function isPalindrome(text) {\n  const s=text.toLowerCase().replace(/[^a-z0-9]/g,'');\n  let l=0,r=s.length-1;\n  while(l<r) if(s[l++]!==s[r--]) return false;\n  return true;\n}",
    complexity:
      "O(n) time and O(n) space with normalization; scanning in place can use O(1) auxiliary space.",
    hint: "Use two pointers; define normalization precisely rather than silently changing Unicode semantics.",
  },
  {
    id: "longest-substring",
    title: "Longest substring without repeats",
    category: "DSA Patterns",
    difficulty: "Medium",
    description:
      "Return the length of the longest substring containing no repeated characters. Treat input as Unicode code points.",
    example: "Input: 'abcabcbb'\nOutput: 3",
    solution:
      "function longestSubstring(text) {\n  const chars=Array.from(text), seen=new Map();\n  let left=0,best=0;\n  for(let right=0;right<chars.length;right++) {\n    const previous=seen.get(chars[right]);\n    if(previous!==undefined) left=Math.max(left,previous+1);\n    seen.set(chars[right],right);\n    best=Math.max(best,right-left+1);\n  }\n  return best;\n}",
    complexity: "O(n) time, O(n) space including code-point conversion.",
    hint: "A sliding window advances its left edge past a repeated character without moving backwards.",
  },
  {
    id: "memoization",
    title: "Memoize a unary function",
    category: "Frontend Utilities",
    difficulty: "Medium",
    description:
      "Memoize a synchronous pure function of one primitive argument using a Map. Cache falsy results correctly and preserve calling context on a cache miss.",
    example: "const square=memoize(x=>x*x);\nsquare(3); square(3); // underlying fn runs once",
    solution:
      "function memoize(fn) {\n  const cache=new Map();\n  return function(value) {\n    if(cache.has(value)) return cache.get(value);\n    const result=fn.call(this,value);\n    cache.set(value,result);\n    return result;\n  };\n}",
    complexity:
      "Expected O(1) lookup, O(k) retained entries. The wrapped function must be pure with respect to the key.",
    hint: "Use Map.has, not truthiness, and discuss cache eviction for unbounded inputs.",
  },
  {
    id: "currying",
    title: "Curry a fixed-arity function",
    category: "JavaScript",
    difficulty: "Medium",
    description:
      "Implement curry(fn) for a fixed-arity function without default or rest parameters. Collect arguments until fn.length arguments are available.",
    example: "const sum=curry((a,b,c)=>a+b+c);\nsum(1)(2)(3); // 6\nsum(1,2)(3); // 6",
    solution:
      "function curry(fn) {\n  function collect(args) {\n    return function(...next) {\n      const all=[...args,...next];\n      return all.length>=fn.length ? fn(...all) : collect(all);\n    };\n  }\n  return collect([]);\n}",
    complexity:
      "Each collection copies accumulated arguments. State the fixed-arity and context limitations.",
    hint: "Return another collector until the argument count reaches the declared arity.",
  },
  {
    id: "type-safe-result",
    title: "Model a typed API result",
    category: "TypeScript",
    difficulty: "Medium",
    description:
      "Create a discriminated Result<T> union for success and failure, then implement mapResult without any. This challenge is review-only; TypeScript compilation is not provided.",
    example: "mapResult({ ok:true, value:2 }, x=>x*3)\n// { ok:true, value:6 }",
    solution:
      "type Result<T> = { ok:true; value:T } | { ok:false; error:string };\nfunction mapResult<T,U>(result:Result<T>, fn:(value:T)=>U):Result<U> {\n  return result.ok ? { ok:true, value:fn(result.value) } : result;\n}",
    complexity: "O(1) wrapping plus the mapper's cost.",
    hint: "Narrow on the literal ok discriminant before accessing the success value.",
  },
  {
    id: "event-delegation",
    title: "Delegate dynamic list events",
    category: "DOM & Browser",
    difficulty: "Medium",
    description:
      "Attach one listener to a list that handles clicks on dynamically inserted action buttons. Match the nearest button and verify it belongs to this list. Provide teardown.",
    example:
      "<ul id='list'><li><button data-action='remove'>Remove</button></li></ul>\nClicking a nested icon should activate its button.",
    solution:
      "function delegate(list, onAction) {\n  function handle(event) {\n    if(!(event.target instanceof Element)) return;\n    const button=event.target.closest('button[data-action]');\n    if(!button || !list.contains(button)) return;\n    onAction(button.dataset.action,button);\n  }\n  list.addEventListener('click',handle);\n  return ()=>list.removeEventListener('click',handle);\n}",
    complexity: "One listener; closest walks ancestor depth O(h).",
    hint: "Use closest instead of matching event.target directly, and remove the same listener reference during cleanup.",
  },
  {
    id: "todo",
    title: "Build a todo application",
    category: "React Machine Coding",
    difficulty: "Easy",
    description:
      "Build a controlled todo list with adding, completing, deleting and filtering. Use stable IDs, accessible labels and an empty state. This challenge is design/review-only.",
    example: "Add 'Review closures' → mark complete → filter active → completed item disappears",
    solution:
      "function TodoApp() {\n  const [items,setItems]=useState([]);\n  const [text,setText]=useState('');\n  function add(e) {\n    e.preventDefault();\n    if(!text.trim()) return;\n    setItems(xs=>[...xs,{id:crypto.randomUUID(),text:text.trim(),done:false}]);\n    setText('');\n  }\n  // Render a labelled form, checkbox rows keyed by id,\n  // and filters derived from items; do not duplicate filtered state.\n}",
    complexity: "O(n) filtering and immutable updates for n items.",
    hint: "Derive filtered items from one source of truth; functional updates avoid stale queued changes.",
  },
];
