import { Column, Row } from "../table/types";

export type { Column };

// Hierarchical row. Consumers add their own fields (id, parentId, name, etc.).
// `hasChildren` is a hint for the lazy-load case: when true and no child rows
// are present yet, the chevron is still shown so the user can trigger a fetch.
export type SpansRow = Row & {
  hasChildren?: boolean;
};
