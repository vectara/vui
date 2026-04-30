import { Column } from "../table/types";

type Props<T> = {
  column: Column<T>;
};

export const VuiSpansHeaderCell = <T,>({ column }: Props<T>) => {
  const { name, header } = column;
  return <div className="vuiSpansHeaderCell">{header.render ? header.render() : name}</div>;
};
