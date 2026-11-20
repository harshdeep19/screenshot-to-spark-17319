export type DesignCase = {
  scope: string;
  functional: string[];
  nonfunctional: string[];
  components: string[];
  flow: string;
  api: string;
  caching: string;
  state: string;
  performance: string;
  security: string;
  tradeoffs: string;
  followups: string[];
};
export const designCases: Record<string, DesignCase> = {
  "design-a-scalable-dashboard": {
    scope:
      "An operations dashboard shows live metrics to analysts across multiple teams. Clarify widget count, update frequency, data volume, export size and whether filters must be shareable.",
    functional: [
      "Filter metrics by date, team and segment with URL-backed state.",
      "Load widgets independently so one failed source does not blank the page.",
      "Drill into a paginated data table and export a server-generated report.",
    ],
    nonfunctional: [
      "Keep filter interactions responsive on low-end laptops.",
      "Display data freshness and partial failures explicitly.",
      "Isolate tenant data in requests and caches.",
    ],
    components: [
      "Dashboard shell",
      "Filter controller",
      "Widget boundary",
      "Query cache",
      "Metrics API",
    ],
    flow: "URL filters → normalized query keys → independent widget requests → partial rendering. Background refresh updates each widget without resetting filters.",
    api: "GET /metrics?tenant=acme&from=2026-11-01&to=2026-11-20\n{ series: [{ time, value }], updatedAt }\nGET /records?cursor=abc&limit=50\nPOST /exports { filters, format } → { jobId }",
    caching:
      "Scope keys by tenant, metric and filters. Set shorter freshness for live summaries and longer freshness for historical data. Invalidate affected widgets after mutations.",
    state:
      "URL owns shareable filters. Local state owns chart hover and panel expansion. The query layer owns request status and remote data; do not mirror every series in global state.",
    performance:
      "Lazy-load chart libraries, batch live updates and virtualize large tables only after profiling. Downsample dense series on the server while preserving spikes.",
    security:
      "Server authorization must apply to metrics, exports and drill-downs. Never rely on a hidden team selector. Escape user-supplied labels and avoid exposing raw sensitive events in client bundles.",
    tradeoffs:
      "A batch endpoint reduces round trips but couples failures. Independent endpoints improve isolation but need coordinated cancellation. Canvas scales for dense charts but needs a text or table alternative.",
    followups: [
      "What changes when 50 widgets refresh every second?",
      "How do you prevent stale filter results?",
      "How would you make an export recoverable after refresh?",
    ],
  },
  "design-an-e-commerce-frontend": {
    scope:
      "A storefront supports search, product detail, cart and checkout. Clarify inventory freshness, localized prices, payment boundaries and anonymous-to-signed-in cart merging.",
    functional: [
      "Search and filter products with shareable URLs.",
      "Keep cart totals consistent with server prices.",
      "Handle inventory changes and retryable checkout states.",
    ],
    nonfunctional: [
      "Fast public product pages and image loading.",
      "No duplicate order creation after a retry.",
      "Accessible checkout and clear payment errors.",
    ],
    components: ["Product route", "Catalog query", "Cart state", "Checkout machine", "Order API"],
    flow: "Product selection → cart draft → server quote → inventory check → payment redirect → verified order status. Client confirmation alone cannot establish a paid order.",
    api: "GET /products?query=keyboard&cursor=abc\nPOST /quotes { items, currency } → { quoteId, total, expiresAt }\nPOST /orders { quoteId, idempotencyKey }",
    caching:
      "Cache public catalog by locale and filters. Treat stock and checkout quotes as short-lived authoritative data. Invalidate cart pricing after quantity or currency changes.",
    state:
      "Local cart draft can be optimistic; server quote owns payable totals. Model checkout as explicit states rather than several contradictory booleans.",
    performance:
      "Serve appropriately sized product images, preload only the main image and split checkout code from catalog browsing. Measure field LCP and interaction latency.",
    security:
      "Use hosted payment collection, never store card details in browser state. Verify payment outcomes server-side. Enforce quantities and prices on the server.",
    tradeoffs:
      "SSR improves discovery but personalized prices complicate caching. Optimistic cart interactions feel fast but need reconciliation when inventory changes.",
    followups: [
      "How do you merge an anonymous cart?",
      "What happens when payment succeeds but the redirect fails?",
      "How do you avoid charging twice?",
    ],
  },
  "design-a-social-media-feed": {
    scope:
      "A feed contains ranked posts, media and reactions. Clarify ranking, cursor semantics, real-time updates and offline expectations.",
    functional: [
      "Load more posts with stable cursor pagination.",
      "Optimistically react with rollback on rejection.",
      "Surface new posts without jumping the reader's scroll position.",
    ],
    nonfunctional: [
      "Maintain scroll identity while data changes.",
      "Handle removed posts and duplicate pages.",
      "Provide accessible pagination alternatives to endless scrolling.",
    ],
    components: ["Feed route", "Cursor pager", "Post boundary", "Reaction queue", "Feed API"],
    flow: "Cursor request → deduplicate by stable post ID → append page → retain viewport anchor. Incoming posts are staged behind a new-content affordance.",
    api: "GET /feed?cursor=opaque&limit=20\n{ items: Post[], nextCursor, snapshotId }\nPUT /posts/:id/reaction { reaction, version }",
    caching:
      "Store pages under feed identity and viewer scope. Deduplicate across cursors. Avoid invalidating every page after one reaction; patch the affected post and reconcile with the server.",
    state:
      "The query layer owns pages. Local state owns visible anchor and pending new-post count. Optimistic reactions need a mutation ID or version to reject obsolete results.",
    performance:
      "Reserve media aspect ratios, lazy-load offscreen images and window long feeds with focus retention. Bound cached pages to control memory.",
    security:
      "Enforce visibility and block rules server-side. Sanitize rich text and proxy untrusted media as appropriate. Rate-limit reactions and uploads.",
    tradeoffs:
      "Offset pagination is simpler but unstable for changing feeds. Cursors improve continuity but complicate direct jumping and snapshot consistency.",
    followups: [
      "How does ranking affect pagination?",
      "How do you preserve scroll position after back navigation?",
      "What if an optimistic reaction fails offline?",
    ],
  },
  "design-a-notification-system": {
    scope:
      "A product has durable in-app notifications and a live unread count. Clarify ordering, read semantics, delivery guarantees and multi-tab behavior.",
    functional: [
      "Page durable notifications by cursor.",
      "Mark one or all as read and reconcile unread count.",
      "Receive live updates and recover missed events after reconnect.",
    ],
    nonfunctional: [
      "Deduplicate replayed events.",
      "Avoid disruptive announcements for every notification.",
      "Keep read status consistent across tabs.",
    ],
    components: [
      "Notification centre",
      "Read-state reducer",
      "Event connection",
      "Notification cache",
      "Notification API",
    ],
    flow: "Initial cursor fetch → SSE events with sequence IDs → deduplicate/upsert → reconnect from last event ID. Read mutations update the cache and reconcile with server counts.",
    api: "GET /notifications?cursor=abc\nGET /notifications/events (SSE, Last-Event-ID)\nPATCH /notifications/:id { read: true, version }\nPOST /notifications/read-all { beforeSequence }",
    caching:
      "Key the inbox by user. Persist only the minimum allowed data. After reconnect, reconcile authoritative unread totals rather than incrementing blindly for every event.",
    state:
      "A normalized notification map avoids duplicate objects. Keep transport connection state separate from inbox data and read status.",
    performance:
      "Batch event updates and avoid reconnecting per component. Use one owner for the connection and a backoff policy with jitter.",
    security:
      "Authenticate the event stream and verify notification ownership on reads and mutations. Do not include secrets in notification previews.",
    tradeoffs:
      "SSE suits one-way updates and automatic replay; WebSockets support bidirectional traffic but need more connection management. Polling is simpler when freshness needs are modest.",
    followups: [
      "How do you handle events missed while offline?",
      "What does mark-all-read mean during concurrent delivery?",
      "How do you synchronize multiple tabs?",
    ],
  },
  "design-a-reusable-component-library": {
    scope:
      "Several teams share a versioned component library. Clarify platform targets, theming, accessibility guarantees and contribution ownership.",
    functional: [
      "Provide composable primitives and documented controlled/uncontrolled contracts.",
      "Support semantic themes and localization.",
      "Publish versioned packages and migration guides.",
    ],
    nonfunctional: [
      "Consistent keyboard and assistive-technology behavior.",
      "Tree-shakeable imports and bounded bundle growth.",
      "Backward compatibility with explicit deprecation policy.",
    ],
    components: [
      "Semantic tokens",
      "Accessible primitives",
      "Component variants",
      "Documentation",
      "Release pipeline",
    ],
    flow: "Product requirements → primitive contract → implementation → interaction tests → package release → consumer migration. Visual tokens remain independent of business logic.",
    api: "Tabs { value?, defaultValue?, onValueChange }\nDialog { open?, onOpenChange, labelledBy }\nPackage exports: components/*, tokens.css",
    caching:
      "CDN-cache immutable versioned packages and documentation assets. Avoid runtime loading of unversioned component definitions.",
    state:
      "Allow controlled state when products coordinate workflows and uncontrolled state for simple local interactions. Never put domain-specific requests inside a generic primitive.",
    performance:
      "Keep entry points granular. Track dependency and CSS size per component; avoid shipping icon collections or chart libraries through the base package.",
    security:
      "Treat rich content as untrusted. Avoid unsafe HTML escape hatches, audit dependencies and do not make components the authority for permissions.",
    tradeoffs:
      "Highly flexible APIs are harder to support. Headless primitives allow varied design but shift styling responsibility to consumers; opinionated components improve consistency at the cost of freedom.",
    followups: [
      "How do you introduce a breaking keyboard behavior fix?",
      "How do you prevent token drift?",
      "What belongs in a primitive versus a product component?",
    ],
  },
  "design-a-large-form-engine": {
    scope:
      "An insurance application has conditional multi-step forms and draft recovery. Clarify validation ownership, schema evolution, file uploads and sensitive fields.",
    functional: [
      "Render schema-defined sections with stable field IDs.",
      "Validate locally for feedback and server-side for authority.",
      "Save drafts and recover after refresh without losing version context.",
    ],
    nonfunctional: [
      "Announce errors and focus the first invalid field.",
      "Prevent conditional hidden fields leaking unwanted values.",
      "Handle concurrent edits and schema migrations.",
    ],
    components: [
      "Schema registry",
      "Field renderer",
      "Validation engine",
      "Draft store",
      "Submission API",
    ],
    flow: "Load versioned schema → derive visible fields → update local values → debounce draft save → validate → submit with schema version and revision.",
    api: "GET /forms/:id/schema → { version, fields, rules }\nPUT /drafts/:id { values, schemaVersion, revision }\nPOST /submissions { draftId, revision }",
    caching:
      "Cache schemas by version. Keep draft data scoped to user and form. Clear sensitive drafts on sign-out and avoid persisting secrets in local storage.",
    state:
      "One form owner stores values, touched state and validation results. Derive field visibility from explicit rules; decide whether hidden values are cleared or excluded on submission.",
    performance:
      "Subscribe fields to relevant changes instead of re-rendering the entire form. Debounce remote validation and cancel obsolete responses.",
    security:
      "Validate all submitted fields on the server and limit file type/size there. Redact sensitive values from telemetry and error logs.",
    tradeoffs:
      "A schema engine accelerates repeated forms but complicates custom interactions. Build escape hatches with a versioned interface rather than arbitrary executable schema code.",
    followups: [
      "What happens when a schema changes during a saved draft?",
      "How do you handle dependent async validation?",
      "How would two tabs editing the same draft behave?",
    ],
  },
  "design-a-real-time-collaboration-app": {
    scope:
      "A shared document editor supports presence and concurrent edits. Clarify whether edits must work offline and how conflicts are resolved.",
    functional: [
      "Apply local edits immediately and synchronize operations.",
      "Show presence separately from durable document content.",
      "Recover from disconnection and reconcile concurrent edits.",
    ],
    nonfunctional: [
      "Convergence under out-of-order delivery.",
      "Bound operation history and memory usage.",
      "Accessible editing and predictable undo semantics.",
    ],
    components: [
      "Editor view",
      "Document model",
      "Operation queue",
      "Sync transport",
      "Document service",
    ],
    flow: "Local edit → operation with identity → optimistic model update → send → acknowledge or merge remote operation. Reconnect loads snapshot plus operations after its revision.",
    api: "GET /documents/:id → { snapshot, revision }\nWS /documents/:id/sync\n{ operationId, actorId, baseRevision, change }\n{ ack, revision }",
    caching:
      "Keep versioned snapshots and unacknowledged operations. Compact history after durable checkpoints; presence should expire and not be treated as document truth.",
    state:
      "Use a proven CRDT or OT library for document convergence. UI state such as selection stays separate from the shared model; presence is ephemeral.",
    performance:
      "Batch transport messages, debounce presence and render only changed document regions. Profile large documents and long disconnected operation queues.",
    security:
      "Check document permissions at connection time and for every operation. Validate operation shape and size; revoke live access when permissions change.",
    tradeoffs:
      "CRDTs improve offline merging but add metadata and model complexity. OT may fit a centralized service but requires careful transformation and ordering. Do not invent a conflict algorithm for production.",
    followups: [
      "How does undo work after another user edits?",
      "What happens when access is revoked during a session?",
      "How do you compact history safely?",
    ],
  },
  "design-a-multi-tenant-saas-application": {
    scope:
      "A SaaS workspace supports organizations, roles and tenant-specific settings. Clarify tenant switching, custom domains, permissions and data-residency constraints.",
    functional: [
      "Switch active organization without retaining another tenant's private views.",
      "Load role-aware navigation and settings.",
      "Support invitations and tenant-scoped resources.",
    ],
    nonfunctional: [
      "Strict data isolation on the server.",
      "Safe cache clearing at tenant and account changes.",
      "Consistent tenant identity across requests and deep links.",
    ],
    components: [
      "Tenant resolver",
      "Workspace shell",
      "Capability view",
      "Scoped query cache",
      "Tenant API",
    ],
    flow: "Resolve tenant from verified context → fetch membership/capabilities → mount tenant-scoped features → tag request keys → clear old private caches on switch.",
    api: "GET /memberships\nGET /tenants/:id/projects?cursor=abc\nPOST /tenants/:id/invitations { email, role }",
    caching:
      "Include tenant and user identity in private cache keys. On switch cancel old requests, remove old private data and avoid brief flashes of the previous workspace.",
    state:
      "Treat active tenant as a validated navigation context. Derive capabilities from authorized server data; UI role labels are not an authorization source.",
    performance:
      "Preload only likely tenant-independent assets. Split feature bundles and limit overfetching permission-dependent resources.",
    security:
      "Verify membership and object tenant ownership on every operation. Never trust a client-supplied tenant ID alone. Use narrow server policies and prevent cross-tenant exports.",
    tradeoffs:
      "Path-based tenancy is easier to deploy; subdomains support stronger brand separation but complicate cookies and domain routing. Shared deployments lower cost but require disciplined isolation.",
    followups: [
      "How do you prevent data flashes during tenant switching?",
      "What does a shared project across tenants require?",
      "How do you test isolation?",
    ],
  },
  "design-a-micro-frontend-architecture": {
    scope:
      "Several autonomous teams own separate product areas. Clarify independent release requirements, shared session management and compatibility guarantees before choosing federation.",
    functional: [
      "Compose independently released feature applications.",
      "Keep navigation, identity and error recovery coherent.",
      "Support versioned shared contracts and rollback.",
    ],
    nonfunctional: [
      "One failing remote must not blank the shell.",
      "Avoid duplicate framework runtimes.",
      "Track performance and errors by owning feature.",
    ],
    components: [
      "Host shell",
      "Remote manifest",
      "Feature boundary",
      "Shared contracts",
      "Release registry",
    ],
    flow: "Host resolves a pinned remote manifest → checks compatibility → loads feature behind a boundary → exchanges typed navigation and capability events. Deployment can roll back the manifest independently.",
    api: "GET /remote-manifest.json\n{ features: { billing: { url, version, contractVersion } } }\nContract: navigate(to), sessionCapabilities, featureError",
    caching:
      "Version remote assets immutably but keep manifests short-lived. Pin compatible versions and provide rollback; do not mix stale HTML with incompatible runtime chunks.",
    state:
      "Host owns session and navigation contracts. Remotes own feature state. Avoid a shared global store that couples every release; exchange minimal versioned events.",
    performance:
      "Share framework versions deliberately, prefetch likely remotes and monitor waterfall loading. Federation can hurt initial load compared with a well-split monolith.",
    security:
      "A same-origin remote is trusted code, not a security sandbox. Restrict manifest origins, verify deployment integrity and enforce permissions on the server.",
    tradeoffs:
      "Independent deployment helps autonomous teams but adds integration testing, version negotiation and observability cost. A modular monolith is often the better choice for one small team.",
    followups: [
      "How do you roll back one remote?",
      "How do you avoid incompatible shared dependencies?",
      "When would you use iframe isolation instead?",
    ],
  },
};
designCases["design-an-autocomplete-component"] = {
  scope:
    "A search field queries suggestions as users type. Clarify minimum query length, ranking, latency budget, keyboard selection and whether results contain private data.",
  functional: [
    "Debounce queries and cancel obsolete requests.",
    "Support Arrow keys, Enter and Escape using combobox semantics.",
    "Display loading, empty, error and selected states.",
  ],
  nonfunctional: [
    "Never show stale suggestions for a newer query.",
    "Keep typing responsive and announce meaningful result changes.",
    "Bound cache size and request rate.",
  ],
  components: ["Combobox input", "Debounced query", "Suggestion cache", "Listbox", "Search API"],
  flow: "Input change → debounce → abort previous request → fetch keyed query → apply only current results → select by stable ID.",
  api: "GET /suggestions?q=react&limit=10\n{ items: [{ id, label }], query }",
  caching:
    "Key by normalized query, locale and private scope. Use short freshness and bounded entries. Do not reuse personalized results across accounts.",
  state:
    "Separate typed query, selected value, active index and open state. The query layer owns network results; activeDescendant references a stable mounted option.",
  performance:
    "Debounce calls but update input immediately. Limit suggestions, cache repeats and avoid expensive synchronous filtering of a huge catalog.",
  security:
    "Validate query length server-side and rate-limit requests. Escape highlighted snippets instead of inserting arbitrary response HTML.",
  tradeoffs:
    "Client filtering is fast for a small static list. Server search supports larger catalogs but adds latency, races and availability concerns.",
  followups: [
    "What happens when the latest request fails?",
    "How do you handle IME composition?",
    "Would you debounce or throttle this workflow?",
  ],
};
designCases["design-a-file-upload-system"] = {
  scope:
    "Users upload large files with progress, cancellation and resumable retries. Clarify maximum size, allowed types, scanning requirements and retention.",
  functional: [
    "Validate client feedback and request an authorized upload session.",
    "Upload bounded chunks and track durable acknowledgements.",
    "Resume or cancel and finalize only verified uploaded parts.",
  ],
  nonfunctional: [
    "Recover from flaky networks without uploading everything again.",
    "Bound concurrent chunk requests and memory.",
    "Separate transport completion from server processing completion.",
  ],
  components: [
    "Upload picker",
    "Chunk queue",
    "Progress tracker",
    "Upload session",
    "Object storage",
  ],
  flow: "File selected → authorized session → bounded parallel chunks → acknowledge part hashes → finalize → server scan/process → ready status.",
  api: "POST /uploads { name, size, mime } → { uploadId, chunkSize }\nPUT /uploads/:id/parts/:number\nPOST /uploads/:id/finalize { parts }\nDELETE /uploads/:id",
  caching:
    "Store session metadata, not private file contents, in the workspace. Resume using server-confirmed part status and expiry. Revoke stale upload credentials.",
  state:
    "A state machine owns queued, uploading, paused, processing, done and failed states. Progress reflects acknowledged bytes; scanning is a separate phase.",
  performance:
    "Stream chunks instead of reading the entire file into memory. Use bounded concurrency, exponential backoff and checksums. Avoid rendering on every progress event.",
  security:
    "Authorize session creation and finalization, validate size/type server-side, scan files and use short-lived scoped upload URLs. Never trust file extensions alone.",
  tradeoffs:
    "Direct object-store upload reduces server bandwidth but requires signed access and finalization. Proxy uploads simplify policy enforcement but increase server load.",
  followups: [
    "How do you resume after refresh?",
    "What if finalize is retried?",
    "How do you handle an expired upload URL?",
  ],
};
designCases["design-an-analytics-platform"] = {
  scope:
    "Analysts explore event aggregates and funnels across tenants. Clarify query cost, freshness, sampling, time zones and retention.",
  functional: [
    "Build shareable queries and compare date ranges.",
    "Run expensive queries as cancellable jobs.",
    "Export results and show sampling/freshness information.",
  ],
  nonfunctional: [
    "Bound memory for high-cardinality results.",
    "Preserve query provenance for reproducibility.",
    "Prevent cross-tenant data disclosure.",
  ],
  components: [
    "Query builder",
    "Job controller",
    "Result cache",
    "Visualization layer",
    "Analytics API",
  ],
  flow: "Validated query → job ID → poll or stream status → paginated result → chart/table. Editing a query invalidates ownership of the previous job's results.",
  api: "POST /queries { dimensions, metrics, filters, timezone } → { jobId }\nGET /queries/:id/status\nGET /queries/:id/results?cursor=abc",
  caching:
    "Cache normalized query plus tenant, dataset revision and time zone. Historical queries can stay fresh longer; live windows need explicit expiry and provenance.",
  state:
    "Keep draft query separate from executed query. URL stores a shareable specification; query jobs own status, errors and result pages.",
  performance:
    "Aggregate and downsample on the server, lazy-load visualization code and virtualize result tables. Cancel expensive abandoned jobs when policy permits.",
  security:
    "Authorize dimensions and exports, suppress sensitive small cohorts where required and avoid raw personal data in browser logs. Enforce query budgets server-side.",
  tradeoffs:
    "Pre-aggregation improves latency but limits flexible dimensions. Ad-hoc queries increase flexibility and cost; asynchronous jobs keep the interface responsive.",
  followups: [
    "How do you explain sampled results?",
    "How do daylight-saving transitions affect comparisons?",
    "What cache invalidation follows a backfill?",
  ],
};
designCases["design-a-real-time-chat-application"] = {
  scope:
    "A messaging workspace supports channels, message history and live delivery. Clarify ordering, offline sends, attachments and read receipts.",
  functional: [
    "Page older messages without losing viewport position.",
    "Send optimistic messages with stable client IDs.",
    "Reconnect and deduplicate delivery using server sequence IDs.",
  ],
  nonfunctional: [
    "Avoid duplicate messages after retries.",
    "Keep large channels memory-bounded.",
    "Provide accessible new-message announcements.",
  ],
  components: ["Channel shell", "Message window", "Outbox", "Live transport", "Message service"],
  flow: "Compose → local pending record → send with idempotency ID → server acknowledgement → replace pending ID → merge incoming events. Reconnect fetches messages after last sequence.",
  api: "GET /channels/:id/messages?before=sequence\nPOST /channels/:id/messages { clientId, text }\nWS /channels/:id/events",
  caching:
    "Scope history by channel and user. Keep bounded pages and a durable pending outbox when allowed. Fetch missed events rather than trusting connection continuity.",
  state:
    "Normalized messages own server and pending identities. Composer, scroll anchor and presence are separate ephemeral state. Delivery and read receipts are distinct states.",
  performance:
    "Window long histories with stable anchors, batch live updates and reserve attachment dimensions. Throttle typing/presence events.",
  security:
    "Authorize channel membership for reads, sends and attachments; recheck revoked membership on live connections. Escape message content and enforce length limits.",
  tradeoffs:
    "WebSockets support two-way events but need reconnect and heartbeat logic. HTTP sends plus SSE receive can simplify transport at modest scale.",
  followups: [
    "How do you retry a pending message safely?",
    "How do you preserve scroll when loading history?",
    "What ordering is guaranteed across devices?",
  ],
};
designCases["design-a-frontend-caching-strategy"] = {
  scope:
    "An application mixes public catalog data, private workspace data and frequent mutations. Define identity, freshness, invalidation and eviction for each resource.",
  functional: [
    "Reuse identical reads and deduplicate in-flight requests.",
    "Support stale-while-revalidate with explicit background errors.",
    "Reconcile optimistic mutations and clear private scopes on account changes.",
  ],
  nonfunctional: [
    "No private cross-user reuse.",
    "Bound cache memory and persisted payloads.",
    "Predictable behavior after reconnect and deployment.",
  ],
  components: [
    "Query identity",
    "Freshness policy",
    "Mutation coordinator",
    "Scoped cache",
    "Resource API",
  ],
  flow: "Normalize request → look up scoped key → return acceptable cached data → revalidate → apply only current response. Mutations patch or invalidate precisely scoped records.",
  api: "Key: ['projects', tenantId, userId, { page, status }]\nGET /projects?cursor=abc&status=active\nPATCH /projects/:id { changes, version }",
  caching:
    "Separate freshness from retention. A stale entry can remain useful while revalidating; eviction controls memory. Include scope, locale and every response-affecting parameter.",
  state:
    "Server state belongs to the cache; UI state belongs near its owner. Avoid duplicating remote data in a second global store. Mutation rollback needs a previous snapshot or reconciliation strategy.",
  performance:
    "Deduplicate requests, avoid broad invalidation storms and paginate large resources. Persist only permitted data and cap serialized size.",
  security:
    "Cancel old requests and clear private caches on sign-out or tenant switch. A cache key is isolation bookkeeping, not server authorization.",
  tradeoffs:
    "Long freshness reduces network traffic but increases staleness. Optimistic patching is fast but more complex than invalidation when server transformations or conflicts occur.",
  followups: [
    "What happens if two edits race?",
    "How do you recover an optimistic failure?",
    "Which data is safe to persist offline?",
  ],
};
