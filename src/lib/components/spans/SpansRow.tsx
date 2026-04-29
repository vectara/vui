import classNames from "classnames";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { VuiIcon } from "../icon/Icon";
import { VuiIconButton } from "../button/IconButton";
import { Column, Row } from "../table/types";
import { VuiTableCell } from "../table/TableCell";

// Cap visual indentation at this depth so the first column doesn't overflow
// for very deep traces. `aria-level` continues to reflect the true depth.
const MAX_VISUAL_DEPTH = 12;

type Props<T> = {
  row: T;
  rowIndex: number;
  columns: Column<T>[];
  id: string;
  depth: number;
  indentSize: number;
  posInSet: number;
  setSize: number;
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  rowDecorator?: (row: T, depth: number) => React.HTMLAttributes<HTMLTableRowElement>;
};

export const VuiSpansRow = <T extends Row>({
  row,
  rowIndex,
  columns,
  id,
  depth,
  indentSize,
  posInSet,
  setSize,
  hasChildren,
  isExpanded,
  onToggle,
  rowDecorator
}: Props<T>) => {
  const decoratorAttrs = rowDecorator?.(row, depth) ?? {};
  const { className: decoratorClassName, ...restDecoratorAttrs } = decoratorAttrs;

  const rowClassName = classNames("vuiSpansRow", decoratorClassName, {
    "vuiSpansRow--expanded": hasChildren && isExpanded,
    "vuiSpansRow--leaf": !hasChildren
  });

  const visualDepth = Math.min(depth, MAX_VISUAL_DEPTH);
  const indentStyle = { paddingLeft: visualDepth * indentSize };

  return (
    <tr
      role="row"
      aria-level={depth + 1}
      aria-posinset={posInSet}
      aria-setsize={setSize}
      aria-expanded={hasChildren ? isExpanded : undefined}
      data-row-id={id}
      className={rowClassName}
      {...restDecoratorAttrs}
    >
      {columns.map((column, columnIndex) => {
        const { name, render, className: columnClassName, testId } = column;
        const cellClasses = classNames(columnClassName, {
          "vuiTableCell--truncate": column.truncate
        });
        const cellContent = render ? render(row, rowIndex) : (row as any)[name];

        if (columnIndex === 0) {
          return (
            <td
              key={name}
              role="gridcell"
              className={cellClasses}
              data-testid={typeof testId === "function" ? testId(row) : testId}
            >
              <div className="vuiSpansCell__indent" style={indentStyle}>
                <div className="vuiSpansCell__chevron">
                  {hasChildren ? (
                    <VuiIconButton
                      icon={<VuiIcon>{isExpanded ? <BiChevronDown /> : <BiChevronRight />}</VuiIcon>}
                      size="xs"
                      color="neutral"
                      aria-label={isExpanded ? "Collapse span" : "Expand span"}
                      onClick={onToggle}
                      data-testid={`spanExpandToggle-${id}`}
                    />
                  ) : (
                    <span className="vuiSpansCell__chevronPlaceholder" aria-hidden="true" />
                  )}
                </div>
                <VuiTableCell column={column}>{cellContent}</VuiTableCell>
              </div>
            </td>
          );
        }

        return (
          <td
            key={name}
            role="gridcell"
            className={cellClasses}
            data-testid={typeof testId === "function" ? testId(row) : testId}
          >
            <VuiTableCell column={column}>{cellContent}</VuiTableCell>
          </td>
        );
      })}
    </tr>
  );
};
