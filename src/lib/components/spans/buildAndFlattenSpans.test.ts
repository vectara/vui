import { buildAndFlattenSpans } from "./buildAndFlattenSpans";

type TestSpan = {
  id: string;
  parentId: string | null;
  hasChildren?: boolean;
  label?: string;
};

const getId = (s: TestSpan) => s.id;
const getParentId = (s: TestSpan) => s.parentId;

const flatten = (rows: TestSpan[], expandedIds: Set<string> = new Set()) =>
  buildAndFlattenSpans(rows, expandedIds, getId, getParentId);

describe("buildAndFlattenSpans", () => {
  test("emits only top-level rows when nothing is expanded", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "b", parentId: null },
      { id: "a-1", parentId: "a" },
      { id: "a-2", parentId: "a" }
    ];
    expect(flatten(rows)).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 1,
        setSize: 2
      },
      {
        row: rows[1],
        id: "b",
        parentId: null,
        depth: 0,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 2,
        setSize: 2
      }
    ]);
  });

  test("emits children of expanded parents in render order", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "b", parentId: null },
      { id: "a-1", parentId: "a" },
      { id: "a-2", parentId: "a" }
    ];
    expect(flatten(rows, new Set(["a"]))).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 1,
        setSize: 2
      },
      {
        row: rows[2],
        id: "a-1",
        parentId: "a",
        depth: 1,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 1,
        setSize: 2
      },
      {
        row: rows[3],
        id: "a-2",
        parentId: "a",
        depth: 1,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 2,
        setSize: 2
      },
      {
        row: rows[1],
        id: "b",
        parentId: null,
        depth: 0,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 2,
        setSize: 2
      }
    ]);
  });

  test("walks deep trees", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "a-1", parentId: "a" },
      { id: "a-1-1", parentId: "a-1" },
      { id: "a-1-1-1", parentId: "a-1-1" }
    ];
    expect(flatten(rows, new Set(["a", "a-1", "a-1-1"]))).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 1,
        setSize: 1
      },
      {
        row: rows[1],
        id: "a-1",
        parentId: "a",
        depth: 1,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 1,
        setSize: 1
      },
      {
        row: rows[2],
        id: "a-1-1",
        parentId: "a-1",
        depth: 2,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 1,
        setSize: 1
      },
      {
        row: rows[3],
        id: "a-1-1-1",
        parentId: "a-1-1",
        depth: 3,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 1,
        setSize: 1
      }
    ]);
  });

  test("flags hasChildren when actual children exist", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "b", parentId: null },
      { id: "a-1", parentId: "a" }
    ];
    expect(flatten(rows)).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 1,
        setSize: 2
      },
      {
        row: rows[1],
        id: "b",
        parentId: null,
        depth: 0,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 2,
        setSize: 2
      }
    ]);
  });

  test("flags hasChildren when row says so even with no actual children", () => {
    const rows: TestSpan[] = [{ id: "a", parentId: null, hasChildren: true }];
    expect(flatten(rows)).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: true,
        hasLoadedChildren: false,
        posInSet: 1,
        setSize: 1
      }
    ]);
  });

  test("does not recurse when expanded but no children loaded", () => {
    // Lazy-load case: row says it has children but they aren't in the list.
    const rows: TestSpan[] = [{ id: "a", parentId: null, hasChildren: true }];
    expect(flatten(rows, new Set(["a"]))).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: true,
        hasLoadedChildren: false,
        posInSet: 1,
        setSize: 1
      }
    ]);
  });

  test("drops orphans (parent id that doesn't appear in rows)", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "ghost", parentId: "missing" }
    ];
    expect(flatten(rows)).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 1,
        setSize: 1
      }
    ]);
  });

  test("breaks cycles", () => {
    // Duplicate id forms a cycle: the root "a" claims "a" as a child of itself.
    // The recursive walk should bail at the duplicate, leaving just the root.
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "a", parentId: "a" }
    ];
    expect(flatten(rows, new Set(["a"]))).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 1,
        setSize: 1
      }
    ]);
  });

  test("sets posInSet and setSize per sibling group", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "b", parentId: null },
      { id: "c", parentId: null },
      { id: "b-1", parentId: "b" },
      { id: "b-2", parentId: "b" }
    ];
    expect(flatten(rows, new Set(["b"]))).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 1,
        setSize: 3
      },
      {
        row: rows[1],
        id: "b",
        parentId: null,
        depth: 0,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 2,
        setSize: 3
      },
      {
        row: rows[3],
        id: "b-1",
        parentId: "b",
        depth: 1,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 1,
        setSize: 2
      },
      {
        row: rows[4],
        id: "b-2",
        parentId: "b",
        depth: 1,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 2,
        setSize: 2
      },
      {
        row: rows[2],
        id: "c",
        parentId: null,
        depth: 0,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 3,
        setSize: 3
      }
    ]);
  });

  test("preserves input order among siblings", () => {
    const rows: TestSpan[] = [
      { id: "z", parentId: null },
      { id: "a", parentId: null },
      { id: "m", parentId: null }
    ];
    expect(flatten(rows)).toEqual([
      {
        row: rows[0],
        id: "z",
        parentId: null,
        depth: 0,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 1,
        setSize: 3
      },
      {
        row: rows[1],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 2,
        setSize: 3
      },
      {
        row: rows[2],
        id: "m",
        parentId: null,
        depth: 0,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 3,
        setSize: 3
      }
    ]);
  });

  test("collapsed parent hides its descendants but state persists for re-expand", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "a-1", parentId: "a" },
      { id: "a-1-1", parentId: "a-1" }
    ];

    // Both a and a-1 expanded — full subtree visible.
    expect(flatten(rows, new Set(["a", "a-1"]))).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 1,
        setSize: 1
      },
      {
        row: rows[1],
        id: "a-1",
        parentId: "a",
        depth: 1,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 1,
        setSize: 1
      },
      {
        row: rows[2],
        id: "a-1-1",
        parentId: "a-1",
        depth: 2,
        hasChildren: false,
        hasLoadedChildren: false,
        posInSet: 1,
        setSize: 1
      }
    ]);

    // a-1 still in expandedIds but a is collapsed — only a should render. The
    // a-1 expand state is preserved for when the user re-expands a.
    expect(flatten(rows, new Set(["a-1"]))).toEqual([
      {
        row: rows[0],
        id: "a",
        parentId: null,
        depth: 0,
        hasChildren: true,
        hasLoadedChildren: true,
        posInSet: 1,
        setSize: 1
      }
    ]);
  });
});
