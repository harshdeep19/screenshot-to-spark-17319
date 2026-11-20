export type QuestionDetailContent = { production: string; mistakes: string; senior: string };
export const questionDetails: Record<string, QuestionDetailContent> = {
  closures: {
    production:
      "A debounced save retains a timer and the latest arguments. Each component instance needs its own closure, and teardown should cancel pending work and release listeners.",
    mistakes:
      "Do not describe closures as frozen copies. A long-lived callback can retain large objects. A React callback from an old render can still read that render's bindings.",
    senior:
      "Discuss retained heap objects, listener ownership and cleanup. In React, distinguish lexical bindings from render snapshots; dependencies and functional state updaters address different stale-value scenarios.",
  },
  "event-loop": {
    production:
      "A large spreadsheet import can monopolize the main thread. Process bounded batches and yield between tasks, or move CPU-heavy work to a Web Worker. Promises alone do not create parallel execution.",
    mistakes:
      "A zero-delay timer is not immediate. Draining an unbounded microtask chain can starve painting. A task ending creates a rendering opportunity, not a guarantee of a paint.",
    senior:
      "Separate input delay, handler processing and presentation delay when diagnosing INP. Explain why awaiting a resolved promise does not necessarily yield to rendering.",
  },
  "react-rendering": {
    production:
      "An editable list needs stable record IDs as keys so state stays with each row across reorderings. Memoization is only useful after identifying real parent-driven render work.",
    mistakes:
      "Do not equate render with DOM mutation or assume memo blocks consumed context. Mutating state while keeping object identity can hide changes.",
    senior:
      "Explain render purity, restartable work and commit effects. Profile render and layout separately; splitting state ownership can be more effective than memoizing every component.",
  },
  useeffect: {
    production:
      "A search request for an old query may complete after a new query. Abort obsolete work and guard application of stale results. Show pending, error and empty states independently.",
    mistakes:
      "Omitting dependencies can close over stale values. Cleanup runs before changed-dependency setup, not just on unmount. fetch needs HTTP status checks in addition to rejection handling.",
    senior:
      "Discuss request ownership, caching, deduplication, error recovery and cancellation. AbortController cannot undo an already completed request or every downstream asynchronous transformation; use an obsolete-result guard when needed.",
  },
  generics: {
    production:
      "A typed data table relates row types to column accessors. Runtime API responses still need parsing before being trusted as the inferred row type.",
    mistakes:
      "A type parameter used only once may add complexity without a useful relationship. any erases evidence, and a cast does not validate JSON.",
    senior:
      "Prefer APIs that infer useful types and produce understandable diagnostics. Very complex conditional types may degrade editor responsiveness; represent asynchronous states with discriminated unions.",
  },
  "web-vitals": {
    production:
      "A filter interaction in a large dashboard may be slow because of queued main-thread work, synchronous transforms or layout. Record a trace on a representative device and address the dominant phase.",
    mistakes:
      "Do not optimize only average developer-machine timings. LCP measures loading, not interaction responsiveness. Changing handlers without measuring presentation delay can miss the bottleneck.",
    senior:
      "Correlate field INP by device and interaction with laboratory traces. Define a performance budget and compare percentiles before and after a change, guarding against layout and accessibility regressions.",
  },
  accessibility: {
    production:
      "A destructive-action modal should name its purpose, focus a safe initial control, contain Tab navigation and restore focus to the trigger after dismissal.",
    mistakes:
      "aria-modal does not implement a focus trap. A visually hidden background can remain interactive. A placeholder is not an accessible label.",
    senior:
      "Discuss nested dialogs, removed triggers, async errors and mobile screen-reader behavior. Use a tested primitive and verify keyboard plus assistive-technology flows, not just static ARIA attributes.",
  },
  caching: {
    production:
      "A multi-tenant project table keys requests by tenant, user, filters and page. After an edit, reconcile the affected record and invalidate related summaries without leaking another tenant's data.",
    mistakes:
      "A resource-only key can mix private scopes. A global freshness timeout ignores workflow semantics. Optimistic updates without rollback leave impossible UI states after errors.",
    senior:
      "Define identity, freshness, invalidation and conflict policy independently. Explain cancelling old requests and clearing private caches during tenant switches, plus reconnect and retry behavior.",
  },
  "css-grid": {
    production:
      "Use Grid to align dashboard columns and Flexbox within a widget's action row. Bound intrinsic minimums to available width and test long localized labels.",
    mistakes:
      "A fixed minimum wider than its container causes overflow. min-width:auto can prevent a child from shrinking. CSS visual reordering can conflict with keyboard and reading order.",
    senior:
      "Reason in content constraints, not device labels. Compare intrinsic sizing with breakpoint-driven layouts, and test zoom, localization, dynamic data and DOM reading order.",
  },
};
