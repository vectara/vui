export type FakeSpan = {
  id: string;
  parentId: string | null;
  name: string;
  kind: "workflow" | "tool" | "llm" | "search" | "embedding";
  status: "ok" | "error" | "running";
  startAt: string;
  durationMs: number;
  hasChildren?: boolean;
};

export const ROOT_SPANS: FakeSpan[] = [
  {
    id: "wf-1",
    parentId: null,
    name: "Run search workflow",
    kind: "workflow",
    status: "ok",
    startAt: "10:42:17.103",
    durationMs: 3420
  },
  {
    id: "wf-1-c1",
    parentId: "wf-1",
    name: "Generate query embeddings",
    kind: "embedding",
    status: "ok",
    startAt: "10:42:17.110",
    durationMs: 142
  },
  {
    id: "wf-1-c2",
    parentId: "wf-1",
    name: "Vector search (corpus: support_docs)",
    kind: "search",
    status: "ok",
    startAt: "10:42:17.260",
    durationMs: 980,
    // Lazy: chevron shown but no child rows present in initial fetch.
    hasChildren: true
  },
  {
    id: "wf-1-c3",
    parentId: "wf-1",
    name: "Re-rank top-25 candidates",
    kind: "tool",
    status: "ok",
    startAt: "10:42:18.250",
    durationMs: 412
  },
  {
    id: "wf-1-c4",
    parentId: "wf-1",
    name: "Generate summary",
    kind: "llm",
    status: "running",
    startAt: "10:42:18.670",
    durationMs: 1850
  },
  {
    id: "wf-1-c4-c1",
    parentId: "wf-1-c4",
    name: "Build prompt context",
    kind: "tool",
    status: "ok",
    startAt: "10:42:18.671",
    durationMs: 12
  },
  {
    id: "wf-1-c4-c2",
    parentId: "wf-1-c4",
    name: "claude-haiku-4-5 streaming call",
    kind: "llm",
    status: "running",
    startAt: "10:42:18.700",
    durationMs: 1820
  },
  {
    id: "wf-2",
    parentId: null,
    name: "Persist trace",
    kind: "tool",
    status: "error",
    startAt: "10:42:20.523",
    durationMs: 38
  }
];

// Children of "wf-1-c2"
export const LAZY_CHILDREN: FakeSpan[] = [
  {
    id: "wf-1-c2-c1",
    parentId: "wf-1-c2",
    name: "Search Vectara API",
    kind: "search",
    status: "ok",
    startAt: "10:42:17.262",
    durationMs: 940
  },
  {
    id: "wf-1-c2-c2",
    parentId: "wf-1-c2",
    name: "Parse filter expression",
    kind: "tool",
    status: "ok",
    startAt: "10:42:17.265",
    durationMs: 4
  },
  {
    id: "wf-1-c2-c3",
    parentId: "wf-1-c2",
    name: "Apply MMR diversification",
    kind: "tool",
    status: "ok",
    startAt: "10:42:18.205",
    durationMs: 32
  }
];
