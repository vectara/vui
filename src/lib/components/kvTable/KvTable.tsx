import classNames from "classnames";
import { KvTableAlign, KvTableItem, KvTableItems, KvTablePadding } from "./types";

function normalizeItems(items: KvTableItems): KvTableItem[] {
  if (Array.isArray(items)) return items;
  return Object.entries(items).map(([key, value]) => ({
    key,
    value: value == null ? "" : String(value)
  }));
}

const paddingToClassMap: Record<KvTablePadding, string> = {
  xxs: "vuiKvTable--paddingXxs",
  xs: "vuiKvTable--paddingXs",
  s: "vuiKvTable--paddingS"
};

const alignToClassMap: Record<KvTableAlign, string> = {
  top: "vuiKvTable--alignTop",
  middle: "vuiKvTable--alignMiddle",
  bottom: "vuiKvTable--alignBottom"
};

type Props = {
  items: KvTableItems;
  keyHeader?: React.ReactNode;
  valueHeader?: React.ReactNode;
  // Describes the table for screen readers when column headers are omitted.
  label?: string;
  padding?: KvTablePadding;
  align?: KvTableAlign;
};

export const VuiKvTable = ({ items, keyHeader, valueHeader, label, padding = "xs", align = "middle" }: Props) => {
  const hasHeader = keyHeader !== undefined || valueHeader !== undefined;
  const classes = classNames("vuiKvTable", paddingToClassMap[padding], alignToClassMap[align]);
  const normalizedItems = normalizeItems(items);

  return (
    <table className={classes} aria-label={label}>
      {hasHeader && (
        <thead>
          <tr>
            {keyHeader !== undefined && <th>{keyHeader}</th>}
            {valueHeader !== undefined && <th>{valueHeader}</th>}
          </tr>
        </thead>
      )}
      <tbody>
        {normalizedItems.map((item, i) => (
          <tr key={i}>
            <th scope="row" className="vuiKvTableCell--key">
              {item.key}
            </th>
            <td className="vuiKvTableCell--value">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
