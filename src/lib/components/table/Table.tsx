import React, { useState } from "react";
import classNames from "classnames";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { TextInputProps, VuiCheckbox, VuiTextInput } from "../form";
import { VuiSpacer } from "../spacer/Spacer";
import { Props as TableRowActionsProps, VuiTableRowActions } from "./TableRowActions";
import { VuiTableCell } from "./TableCell";
import { VuiTableHeaderCell } from "./TableHeaderCell";
import { Pagination, VuiPagination } from "../pagination/Pagination";
import { Pager, VuiTablePager } from "./TablePager";
import { VuiFlexContainer } from "../flex/FlexContainer";
import { VuiFlexItem } from "../flex/FlexItem";
import { VuiText } from "../typography/Text";
import { Props as TableBulkActionProps, VuiTableBulkActions } from "./TableBulkActions";
import { VuiSpinner } from "../spinner/Spinner";
import { VuiTableContent } from "./TableContent";
import { VuiButtonSecondary } from "../button/ButtonSecondary";
import { VuiIconButton } from "../button/IconButton";
import { Column, OnSort, Row } from "./types";
import { VuiIcon } from "../icon/Icon";

const verticalAlignToClass = {
  top: "vuiTable--verticalAlignTop",
  middle: "vuiTable--verticalAlignMiddle",
  bottom: "vuiTable--verticalAlignBottom"
} as const;

// Type guard to determine type of pagination.
const isComplexPagination = (pagination: Pagination | Pager): pagination is Pagination => {
  return (pagination as Pagination).onSelectPage !== undefined;
};

type Props<T> = {
  isLoading?: boolean;
  idField: keyof T | ((row: T) => string);
  rowDecorator?: (row: T) => React.HTMLAttributes<HTMLTableRowElement>;
  columns: Column<T>[];
  rows: T[];
  actions?: TableRowActionsProps<T>["actions"];
  actionsTestIdProvider?: (row: T) => string;
  reloadTestId?: string;
  pagination?: Pagination | Pager;
  selection?: Selection<T>;
  search?: Search;
  customControls?: React.ReactNode;
  onSort?: OnSort;
  onReload?: () => void;
  content?: React.ReactNode;
  className?: string;
  fluid?: boolean;
  isDisabled?: boolean;
  bodyStyle?: BodyStyle;
  isHeaderSticky?: boolean;
  isResponsive?: boolean;
  collapsedContent?: (row: T) => React.ReactNode;
  defaultSortColumn?: string;
  defaultSortDirection?: "asc" | "desc";
};

type BodyStyle = {
  verticalAlign?: "top" | "middle" | "bottom";
};

type Selection<T> = {
  bulkActions?: TableBulkActionProps<T[]>["actions"];
  isRowSelectable?: (row: T) => boolean;
  onSelectRow?: (selectedRows: T[]) => void;
  selectedRows?: T[];
  showSelectedCount?: boolean;
};

type Search = TextInputProps;

const extractId = <T extends Row>(row: T, idField: Props<T>["idField"]) => {
  return typeof idField === "function" ? idField(row) : row[idField];
};

// https://github.com/typescript-eslint/typescript-eslint/issues/4062
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const VuiTable = <T extends Row>({
  isLoading,
  idField,
  rowDecorator,
  columns,
  rows,
  actions,
  actionsTestIdProvider,
  reloadTestId,
  pagination,
  selection,
  search,
  customControls,
  onSort,
  onReload,
  content,
  className,
  fluid,
  isDisabled = false,
  bodyStyle,
  isHeaderSticky,
  isResponsive = true,
  collapsedContent,
  defaultSortColumn,
  defaultSortDirection,
  ...rest
}: Props<T>) => {
  const [rowBeingActedUpon, setRowBeingActedUpon] = useState<T | undefined>(undefined);
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSortColumn ?? null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(defaultSortDirection ?? "none");
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());

  const { bulkActions, isRowSelectable, onSelectRow, selectedRows, showSelectedCount } = selection || {};
  const { value: searchValue } = search || {};

  const handleSort = (columnName: string, direction: "asc" | "desc" | "none") => {
    if (direction === "none") {
      setSortColumn(null);
      setSortDirection("none");
    } else {
      setSortColumn(columnName);
      setSortDirection(direction);
    }
    onSort?.(columnName, direction);
  };

  const isEmpty = !isLoading && rows.length === 0;
  // The user interacts with the table rows by selecting them or performing actions on them.
  // This is only allowed if there is no “content” (which is an error or similar state that
  // replaces the rows), and if it’s not in a loading state or empty state.
  const isInteractive = Boolean(!content && !isLoading && !isEmpty);

  const selectableRowsCount = isRowSelectable
    ? rows.reduce((count, row) => (isRowSelectable(row) ? count + 1 : count), 0)
    : rows.length;
  const areAnyRowsSelectable = selectableRowsCount > 0;
  const allRowsSelected = areAnyRowsSelectable && selectedRows?.length === selectableRowsCount;
  const selectedIds: Record<string, boolean> =
    selectedRows?.reduce((acc, row) => {
      acc[extractId(row, idField)] = true;
      return acc;
    }, {} as Record<string, boolean>) || {};

  const hasSearch = search !== undefined;
  const hasBulkActions = bulkActions !== undefined;
  const hasExpandableRows = collapsedContent !== undefined;
  const columnCount = columns.length + (onSelectRow ? 1 : 0) + (actions || hasExpandableRows ? 1 : 0);

  const classes = classNames(
    "vuiTable",
    bodyStyle?.verticalAlign && verticalAlignToClass[bodyStyle.verticalAlign],
    {
      "vuiTable--fluid": fluid,
      "vuiTable--responsive": isResponsive,
      "vuiTable--notSelectable": !selection,
      "vuiTable--noActions": !actions
    },
    className
  );

  let tableContent;

  if (content) {
    tableContent = <VuiTableContent colSpan={columnCount}>{content}</VuiTableContent>;
  } else if (isLoading) {
    tableContent = (
      <VuiTableContent colSpan={columnCount}>
        <VuiFlexItem grow={false}>
          <VuiSpinner size="xs" />
        </VuiFlexItem>

        <VuiFlexItem grow={false}>
          <VuiText>
            <p>Loading</p>
          </VuiText>
        </VuiFlexItem>
      </VuiTableContent>
    );
  } else if (searchValue && isEmpty) {
    tableContent = (
      <VuiTableContent colSpan={columnCount}>
        <VuiFlexItem grow={false}>
          <VuiText>
            <p>No matches found</p>
          </VuiText>
        </VuiFlexItem>
      </VuiTableContent>
    );
  } else {
    tableContent = rows.map((row, rowIndex) => {
      const rowId = extractId(row, idField);
      const rowAttributes = rowDecorator?.(row) ?? {};
      const { className: rowClassNameAttribute, ...restRowAttributes } = rowAttributes;
      const isExpanded = expandedRowIds.has(rowId);
      const rowClassName = classNames(rowClassNameAttribute, {
        "vuiTableRow-isBeingActedUpon": rowBeingActedUpon === row,
        "vuiTableRow--hasActions": Boolean(actions) || hasExpandableRows,
        "vuiTableRow--isSelectable": Boolean(onSelectRow),
        "vuiTableRow--expanded": isExpanded
      });

      const toggleExpand = () => {
        setExpandedRowIds((prev) => {
          const next = new Set(prev);
          if (next.has(rowId)) {
            next.delete(rowId);
          } else {
            next.add(rowId);
          }
          return next;
        });
      };

      return (
        <React.Fragment key={rowId}>
          <tr className={rowClassName} {...restRowAttributes}>
            {/* Checkbox column */}
            {onSelectRow && (
              <td className="vuiTableRowSelect">
                <VuiTableCell>
                  <VuiCheckbox
                    disabled={isRowSelectable ? !isRowSelectable(row) : undefined}
                    checked={selectedIds[rowId] ?? false}
                    onChange={() => {
                      if (selectedIds[rowId]) {
                        delete selectedIds[rowId];
                      } else {
                        selectedIds[rowId] = true;
                      }

                      const selectedRowIds = Object.keys(selectedIds);
                      // Map selected row IDs to selected rows.
                      const selectedRows = selectedRowIds
                        .map((id) => rows.find((row) => extractId(row, idField) === id))
                        .filter((row): row is T => row !== undefined);
                      onSelectRow(selectedRows);
                    }}
                  />
                </VuiTableCell>
              </td>
            )}

            {/* Row info */}
            {columns.map((column) => {
              const { name, render, className, testId } = column;
              const cellClasses = classNames(className, {
                "vuiTableCell--truncate": column.truncate
              });

              return (
                <td
                  key={name}
                  className={cellClasses}
                  data-testid={typeof testId === "function" ? testId(row) : testId}
                >
                  <VuiTableCell column={column}>{render ? render(row, rowIndex) : row[column.name]}</VuiTableCell>
                </td>
              );
            })}

            {/* Actions column */}
            {(actions || hasExpandableRows) && (
              <td className="vuiTableRowActions">
                <VuiFlexContainer alignItems="center" justifyContent="end" spacing="xs">
                  {actions && (
                    <VuiFlexItem grow={false}>
                      <VuiTableRowActions
                        row={row}
                        actions={actions}
                        onToggle={(isSelected: boolean) => {
                          if (isSelected) {
                            setRowBeingActedUpon(row);
                          } else {
                            setRowBeingActedUpon(undefined);
                          }
                        }}
                        testId={actionsTestIdProvider?.(row) ?? undefined}
                      />
                    </VuiFlexItem>
                  )}
                  {hasExpandableRows && (
                    <VuiFlexItem grow={false} className="vuiTableRowExpandToggle">
                      <VuiIconButton
                        icon={<VuiIcon>{isExpanded ? <BiChevronDown /> : <BiChevronRight />}</VuiIcon>}
                        size="s"
                        color="neutral"
                        aria-label={isExpanded ? "Collapse row" : "Expand row"}
                        onClick={toggleExpand}
                        data-testid={`expandToggle-${rowId}`}
                      />
                    </VuiFlexItem>
                  )}
                </VuiFlexContainer>
              </td>
            )}
          </tr>

          {/* Expanded content row */}
          {hasExpandableRows && isExpanded && (
            <tr className="vuiTableRowExpandedContent vuiTableRow--inert">
              <td className="vuiTableRowExpandedContent__cell" colSpan={columnCount}>
                {collapsedContent(row)}
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });
  }

  const selectAllCheckboxProps = {
    disabled: !isInteractive || !areAnyRowsSelectable,
    checked: isInteractive ? allRowsSelected : false,
    onChange: () => {
      let newSelectedRows: T[];

      if (allRowsSelected) {
        newSelectedRows = [];
      } else {
        newSelectedRows = rows.reduce((acc, row) => {
          if (isRowSelectable && !isRowSelectable(row)) {
            return acc;
          }
          acc.push(row);
          return acc;
        }, [] as T[]);
      }

      onSelectRow?.(newSelectedRows);
    },
    "data-testid": "selectAllRowsCheckbox"
  };

  // @ts-expect-error data-testid doesn't exist on {}.
  const { "data-testid": dataTestId, ...restProps } = rest;

  return (
    // @ts-expect-error React doesn't support inert yet
    <div className="vuiTableWrapper" inert={isDisabled ? "" : null} data-testid={dataTestId}>
      {isDisabled && <div className="vuiTableBlock" />}
      {(hasSearch ||
        customControls ||
        (hasBulkActions && selectedRows && selectedRows.length > 0) ||
        Boolean(onReload)) && (
        <>
          <VuiFlexContainer
            spacing="s"
            alignItems="center"
            className={isHeaderSticky ? "vuiTableStickyHeader" : undefined}
            wrap
          >
            {/* Responsive select-all checkbox - shown when isResponsive is true. */}
            {onSelectRow && isResponsive && (
              <VuiFlexItem grow={false} shrink={false} className="vuiTableHeader__responsiveSelectAllCheckbox">
                <VuiCheckbox label="Select all" {...selectAllCheckboxProps} />
              </VuiFlexItem>
            )}

            {/* Selected count */}
            {showSelectedCount && selectedRows && selectedRows.length > 0 && (
              <VuiFlexItem grow={false} shrink={false}>
                <VuiText size="s">
                  <p>{selectedRows.length} selected</p>
                </VuiText>
              </VuiFlexItem>
            )}

            {/* Bulk actions */}
            {selectedRows && selectedRows.length > 0 && hasBulkActions && (
              <VuiFlexItem grow={false} shrink={false}>
                <VuiTableBulkActions selectedRows={selectedRows} actions={bulkActions} />
              </VuiFlexItem>
            )}

            {/* Search */}
            {hasSearch && (
              <VuiFlexItem grow={1} shrink={false}>
                <VuiTextInput fullWidth {...search} />
              </VuiFlexItem>
            )}

            {/* Custom controls */}
            {customControls && (
              <VuiFlexItem grow={false} shrink={false}>
                {customControls}
              </VuiFlexItem>
            )}

            {/* Reload */}
            {onReload && (
              <VuiFlexItem grow={1} shrink={false}>
                <VuiFlexContainer justifyContent="end">
                  <VuiButtonSecondary color="neutral" onClick={() => onReload()} data-testid={reloadTestId}>
                    Reload
                  </VuiButtonSecondary>
                </VuiFlexContainer>
              </VuiFlexItem>
            )}
          </VuiFlexContainer>

          <VuiSpacer size="s" />
        </>
      )}

      <table className={classes} {...restProps}>
        <thead>
          <tr>
            {/* Checkbox column */}
            {onSelectRow && (
              <th className="vuiTableHeaderSelect">
                <VuiTableCell>
                  <VuiCheckbox {...selectAllCheckboxProps} />
                </VuiTableCell>
              </th>
            )}

            {/* Row info */}
            {columns.map((column) => {
              const { name, width } = column;
              const styles = width ? { width } : undefined;

              return (
                <th key={name} style={styles}>
                  <VuiTableHeaderCell
                    column={column}
                    onSort={handleSort}
                    sortDirection={sortColumn === name ? sortDirection : "none"}
                  />
                </th>
              );
            })}

            {/* Actions column */}
            {(actions || hasExpandableRows) && (
              <th
                className={classNames("vuiTableHeaderActions", {
                  "vuiTableHeaderActions--extended": actions && hasExpandableRows
                })}
              />
            )}
          </tr>
        </thead>

        <tbody>{tableContent}</tbody>
      </table>

      {/* Pagination */}
      {!pagination ? undefined : isComplexPagination(pagination) ? (
        <>
          <VuiSpacer size="xs" />
          <VuiPagination isDisabled={!isInteractive} {...pagination} />
        </>
      ) : (
        <>
          <VuiSpacer size="xs" />
          <VuiTablePager isDisabled={!isInteractive} {...pagination} />
        </>
      )}
    </div>
  );
};
