# DevReady experience upgrade

## Preserve what works
Keep the existing DevReady identity, all seven learning paths, public URLs, navigation, search, themes, quizzes, bookmarks, notes, completion tracking and interview timer. Improve the existing application rather than replace it.

## Review findings
- The dashboard mixes saved progress with invented starting counts, study hours, streaks and readiness scores. Learning paths also begin with sample progress.
- Most lessons reuse generic explanations and knowledge checks; only a small group has concept-specific content. Lesson notes and last-visited resume are missing.
- Interview questions already have filters and explanation tabs, but lack answer-first interview mode and revision tracking.
- The coding editor works, but its preview only displays reference output; submitted code is not executed or tested.
- System design cases share one general framework rather than case-specific requirements and architectures.
- Roadmaps react to the selected role and duration, but not skill gaps, daily availability or interview dates. There is no topic assessment centre.
- Browser-local saving exists; there is no connected account or cloud storage.

## Implementation order

### 1. Preparation command centre
- Replace sample metrics with actual saved activity and completion counts; begin new workspaces at zero.
- Show the learner's editable name, goal, target role and optional interview date with countdown.
- Resume the last visited lesson and show its module and actual path progress.
- Distinguish assessed skills from unassessed skills across all ten requested areas. Calculate assessment scores independently of lesson completion; reviewed coding examples do not count as solved challenges.
- Record learning activity by date for the weekly activity view and streak. Track daily tasks separately each day.
- Recommend next steps from assessment gaps and unfinished work, with clear starting suggestions when no assessments exist.

### 2. Learning depth and lesson workflow
- Retain every existing module and URL; organise modules by beginner, intermediate and advanced levels and add audience, prerequisites and assignment links.
- Use typed, concept-specific lesson content for the requested 15-part structure, including mental models, small code examples, production cases, mistakes, trade-offs, interview discussions, practical exercises and scored checks.
- Start with JavaScript fundamentals, execution context, closures, promises, event loop, React rendering, effects, TypeScript generics, accessible HTML and CSS Grid; extend the remaining paths in subsequent content batches rather than relabel repeated filler as deep instruction.
- Preserve lesson sidebar and previous/next navigation; add lesson-linked notes, difficulty marking and last-visited tracking.

### 3. Practice environments
- Add answer-first Interview Mode: write an answer before revealing the explanation, then self-review and schedule revision. Expand topic, difficulty, experience and question-type filters as corresponding content is added.
- Keep the existing coding editor, hints and reference access. Add problem-specific starter code, constraints, test cases and alternatives.
- Execute supported JavaScript sample tests in a disposable, isolated browser environment with a timeout and visible results. Unsupported challenges remain clearly review-only; TypeScript and React execution are not presented as working before implementation.
- Add missing coding categories and requested exercises in focused batches. Count a challenge as solved only after its supported tests pass.
- Give system design exercises distinct requirements, API/data flows, diagrams, caching, security, scaling and trade-offs; add bookmarks and design notes.

### 4. Roadmaps, assessments and revision
- Add inputs for experience, skill level, target companies, interview date, daily study time, strong areas and weak areas.
- Generate rules-based weekly milestones with links to lessons, coding assignments, revision and mock-interview practice. Adapt priorities using assessment results; keep completion associated with the generated plan.
- Add a dedicated assessment page with JavaScript fundamentals, advanced JavaScript, React fundamentals, React performance, TypeScript and system design assessments. Show score, answer explanations, weak topics, recommended lessons and next assessments.
- Expand My Workspace into a unified revision centre for all saved content, linked notes, recently studied topics, difficult topics and dated reminders.

## Boundaries
This phase keeps the existing browser-local workspace: no fake login, new cloud service, payment system or AI evaluation. Results and drafts survive refresh in the same browser but do not sync between devices. Future AI capabilities remain labelled upcoming, without non-functional action buttons. Preserve the published address; publishing the upgrade is separate.

## Technical details
Reuse TanStack Start, existing shared controls and semantic CSS tokens. Keep educational content, assessment scoring and roadmap rules in typed browser-safe modules; extend the existing hydrated React context with backward-compatible saved-state defaults. Keep views focused, leaf routes responsible for metadata, and code execution behind a replaceable runner interface. Maintain architecture rules in AGENTS.md.

## Verification
Add focused tests for actual path progress, assessment scoring, unassessed states, daily activity/streaks, countdowns, rules-based roadmap selection and supported challenge grading. Run existing and new relevant tests. Exercise real inputs through the preview: complete a lesson check, save linked notes, run passing and failing code, take an assessment, confirm dashboard results, generate a roadmap and revise saved items. Check reload persistence, all existing navigation, empty states, keyboard access, mobile/tablet/desktop layouts and current error logs.

Implement incrementally in this order; report any remaining content batches explicitly rather than claiming the full curriculum is complete.