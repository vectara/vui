import { Column, Row } from "../table/types";

export type { Column };

export type SpansRow = Row & {
  hasChildren?: boolean;
};
