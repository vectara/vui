export type KvTableItem = {
  key: React.ReactNode;
  value: React.ReactNode;
};

// Consumers may pass a plain object; values are stringified automatically.
export type KvTableItems = KvTableItem[] | Record<string, unknown>;

export type KvTablePadding = "xxs" | "xs" | "s";
export type KvTableAlign = "top" | "middle" | "bottom";
