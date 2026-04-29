import React, { useCallback, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { Column, Row } from "../table/types";
import { VuiFlexItem } from "../flex/FlexItem";
import { VuiSpinner } from "../spinner/Spinner";
import { VuiText } from "../typography/Text";
import { VuiTableContent } from "../table/TableContent";
import { VuiTableHeaderCell } from "../table/TableHeaderCell";
import { buildAndFlattenSpans } from "./buildAndFlattenSpans";
import { VuiSpansRow } from "./SpansRow";
import { VuiSpansLoadingRow } from "./SpansLoadingRow";
import { SpansRow } from "./types";

const DEFAULT_INDENT_SIZE = 16;

type Props<T extends SpansRow> = {
  idField: keyof T | ((row: T) => string);
  parentField: keyof T | ((row: T) => string | null);
  columns: Column<T>[];
  rows: T[];

  expandedIds: Set<string>;
  onExpandedIdsChange: (ids: Set<string>) => void;

  onExpand?: (row: T) => void | Promise<void>;
  isLoadingChildren?: (row: T) => boolean;

  isLoading?: boolean;
  content?: React.ReactNode;

  className?: string;
  rowDecorator?: (row: T, depth: number) => React.HTMLAttributes<HTMLTableRowElement>;
  indentSize?: number;
  isHeaderSticky?: boolean;
  fluid?: boolean;

  "data-testid"?: string;
};

const extractId = <T extends Row>(row: T, idField: Props<T>["idField"]) => {
  return typeof idField === "function" ? idField(row) : row[idField];
};

const extractParentId = <T extends Row>(row: T, parentField: Props<T>["parentField"]) => {
  if (typeof parentField === "function") return parentField(row);
  const value = row[parentField];
  return value === undefined || value === null ? null : value;
};

export const VuiSpans = <T extends SpansRow>({
  idField,
  parentField,
  columns,
  rows,
  expandedIds,
  onExpandedIdsChange,
  onExpand,
  isLoadingChildren,
  isLoading,
  content,
  className,
  rowDecorator,
  indentSize = DEFAULT_INDENT_SIZE,
  isHeaderSticky,
  fluid,
  "data-testid": dataTestId
}: Props<T>) => {
  const [internalLoadingIds, setInternalLoadingIds] = useState<Set<string>>(new Set());

  // Tracks pending fetches so we ignore stale resolutions (e.g. user collapses
  // mid-fetch, then re-expands — the original promise should not clear loading
  // state for the new attempt).
  const fetchTokensRef = useRef<Map<string, number>>(new Map());

  const getId = useCallback((row: T) => extractId(row, idField), [idField]);
  const getParentId = useCallback((row: T) => extractParentId(row, parentField), [parentField]);

  const flatSpans = useMemo(
    () => buildAndFlattenSpans(rows, expandedIds, getId, getParentId),
    [rows, expandedIds, getId, getParentId]
  );

  const columnCount = columns.length;

  const handleToggle = useCallback(
    (row: T, id: string, hasChildren: boolean, hasLoadedChildren: boolean) => {
      const isCurrentlyExpanded = expandedIds.has(id);
      const next = new Set(expandedIds);

      if (isCurrentlyExpanded) {
        next.delete(id);
        onExpandedIdsChange(next);
        return;
      }

      next.add(id);
      onExpandedIdsChange(next);

      const needsFetch = hasChildren && !hasLoadedChildren && Boolean(onExpand);
      if (!needsFetch) return;

      const tokens = fetchTokensRef.current;
      const token = (tokens.get(id) ?? 0) + 1;
      tokens.set(id, token);

      setInternalLoadingIds((prev) => {
        const set = new Set(prev);
        set.add(id);
        return set;
      });

      const clearLoading = () => {
        // Only clear if our token is still the latest — otherwise a newer
        // fetch is in flight and owns the loading state.
        if (tokens.get(id) !== token) return;
        setInternalLoadingIds((prev) => {
          const set = new Set(prev);
          set.delete(id);
          return set;
        });
      };

      Promise.resolve(onExpand!(row)).finally(clearLoading);
    },
    [expandedIds, onExpandedIdsChange, onExpand]
  );

  const classes = classNames("vuiTable", "vuiSpans", className, {
    "vuiTable--fluid": fluid
  });

  let tbodyContent;

  if (content) {
    tbodyContent = <VuiTableContent colSpan={columnCount}>{content}</VuiTableContent>;
  } else if (isLoading) {
    tbodyContent = (
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
  } else {
    tbodyContent = flatSpans.map((flat, rowIndex) => {
      const { row, id, depth, hasChildren, hasLoadedChildren, posInSet, setSize } = flat;
      const isExpanded = expandedIds.has(id);
      const externalLoading = isLoadingChildren ? isLoadingChildren(row) : false;
      const isLoadingRow = internalLoadingIds.has(id) || externalLoading;
      const showLoadingRow = isExpanded && hasChildren && !hasLoadedChildren && isLoadingRow;

      return (
        <React.Fragment key={id}>
          <VuiSpansRow
            row={row}
            rowIndex={rowIndex}
            columns={columns}
            id={id}
            depth={depth}
            indentSize={indentSize}
            posInSet={posInSet}
            setSize={setSize}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onToggle={() => handleToggle(row, id, hasChildren, hasLoadedChildren)}
            rowDecorator={rowDecorator}
          />

          {showLoadingRow && (
            <VuiSpansLoadingRow
              key={`${id}__loading`}
              colSpan={columnCount}
              depth={depth + 1}
              indentSize={indentSize}
            />
          )}
        </React.Fragment>
      );
    });
  }

  return (
    <div className="vuiTableWrapper" data-testid={dataTestId}>
      <table className={classes} role="treegrid">
        <thead className={isHeaderSticky ? "vuiSpansStickyHeader" : undefined}>
          <tr role="row">
            {columns.map((column) => {
              const { name, width } = column;
              const styles = width ? { width } : undefined;
              return (
                <th key={name} role="columnheader" style={styles}>
                  <VuiTableHeaderCell column={column} sortDirection="none" />
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>{tbodyContent}</tbody>
      </table>
    </div>
  );
};
