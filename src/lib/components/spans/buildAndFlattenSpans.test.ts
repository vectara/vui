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
    const result = flatten(rows);
    expect(result.map((r) => r.id)).toEqual(["a", "b"]);
    expect(result.every((r) => r.depth === 0)).toBe(true);
  });

  test("emits children of expanded parents in render order", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "b", parentId: null },
      { id: "a-1", parentId: "a" },
      { id: "a-2", parentId: "a" }
    ];
    const result = flatten(rows, new Set(["a"]));
    expect(result.map((r) => r.id)).toEqual(["a", "a-1", "a-2", "b"]);
    expect(result.map((r) => r.depth)).toEqual([0, 1, 1, 0]);
  });

  test("walks deep trees", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "a-1", parentId: "a" },
      { id: "a-1-1", parentId: "a-1" },
      { id: "a-1-1-1", parentId: "a-1-1" }
    ];
    const result = flatten(rows, new Set(["a", "a-1", "a-1-1"]));
    expect(result.map((r) => r.id)).toEqual(["a", "a-1", "a-1-1", "a-1-1-1"]);
    expect(result.map((r) => r.depth)).toEqual([0, 1, 2, 3]);
  });

  test("flags hasChildren when actual children exist", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "b", parentId: null },
      { id: "a-1", parentId: "a" }
    ];
    const result = flatten(rows);
    const aRow = result.find((r) => r.id === "a")!;
    const bRow = result.find((r) => r.id === "b")!;
    expect(aRow.hasChildren).toBe(true);
    expect(bRow.hasChildren).toBe(false);
  });

  test("flags hasChildren when row says so even with no actual children", () => {
    const rows: TestSpan[] = [{ id: "a", parentId: null, hasChildren: true }];
    const result = flatten(rows);
    expect(result[0].hasChildren).toBe(true);
  });

  test("does not recurse when expanded but no children loaded", () => {
    // Lazy-load case: row says it has children but they aren't in the list.
    const rows: TestSpan[] = [{ id: "a", parentId: null, hasChildren: true }];
    const result = flatten(rows, new Set(["a"]));
    expect(result.map((r) => r.id)).toEqual(["a"]);
  });

  test("drops orphans (parent id that doesn't appear in rows)", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "ghost", parentId: "missing" }
    ];
    const result = flatten(rows);
    expect(result.map((r) => r.id)).toEqual(["a"]);
  });

  test("breaks cycles", () => {
    const looped: TestSpan[] = [
      { id: "a", parentId: "b" },
      { id: "b", parentId: "a" }
    ];
    const result = flatten(looped, new Set(["a", "b"]));
    expect(result.length).toBeLessThan(10);
  });

  test("sets posInSet and setSize per sibling group", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "b", parentId: null },
      { id: "c", parentId: null },
      { id: "b-1", parentId: "b" },
      { id: "b-2", parentId: "b" }
    ];
    const result = flatten(rows, new Set(["b"]));
    const a = result.find((r) => r.id === "a")!;
    const b1 = result.find((r) => r.id === "b-1")!;
    const b2 = result.find((r) => r.id === "b-2")!;
    expect({ pos: a.posInSet, size: a.setSize }).toEqual({ pos: 1, size: 3 });
    expect({ pos: b1.posInSet, size: b1.setSize }).toEqual({ pos: 1, size: 2 });
    expect({ pos: b2.posInSet, size: b2.setSize }).toEqual({ pos: 2, size: 2 });
  });

  test("preserves input order among siblings", () => {
    const rows: TestSpan[] = [
      { id: "z", parentId: null },
      { id: "a", parentId: null },
      { id: "m", parentId: null }
    ];
    expect(flatten(rows).map((r) => r.id)).toEqual(["z", "a", "m"]);
  });

  test("collapsed parent hides its descendants but state persists for re-expand", () => {
    const rows: TestSpan[] = [
      { id: "a", parentId: null },
      { id: "a-1", parentId: "a" },
      { id: "a-1-1", parentId: "a-1" }
    ];
    // Both a and a-1 expanded — but if a is collapsed, a-1's children should
    // not appear either.
    const allExpanded = new Set(["a", "a-1"]);
    expect(flatten(rows, allExpanded).map((r) => r.id)).toEqual(["a", "a-1", "a-1-1"]);

    const aCollapsed = new Set(["a-1"]); // a-1 still in set but a hidden
    expect(flatten(rows, aCollapsed).map((r) => r.id)).toEqual(["a"]);
  });
});
