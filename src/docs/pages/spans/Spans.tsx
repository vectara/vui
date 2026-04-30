import { useMemo, useState } from "react";
import {
  VuiBadge,
  VuiFlexContainer,
  VuiFlexItem,
  VuiIcon,
  VuiSpacer,
  VuiSpans,
  VuiText,
  VuiTextColor,
  VuiToggle
} from "../../../lib";
import { BiCog, BiError, BiNetworkChart, BiSearch, BiSitemap, BiSpreadsheet } from "react-icons/bi";
import { FakeSpan, LAZY_CHILDREN, ROOT_SPANS } from "./createFakeSpans";

const KIND_ICON = {
  workflow: BiSitemap,
  tool: BiCog,
  llm: BiNetworkChart,
  search: BiSearch,
  embedding: BiSpreadsheet
} as const;

const STATUS_COLOR = {
  ok: "success",
  error: "danger",
  running: "primary"
} as const;

export const Spans = () => {
  const [hasData, setHasData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [fluid, setFluid] = useState(true);

  const [rows, setRows] = useState<FakeSpan[]>(ROOT_SPANS);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["wf-1"]));

  const visibleRows = hasData ? rows : [];

  const onExpand = async (row: FakeSpan) => {
    // Only the wf-1-c2 span lazy-loads in this demo.
    if (row.id !== "wf-1-c2") return;

    // Simulate a network round-trip.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setRows((prev) => {
      // De-dupe in case the user toggles repeatedly.
      const alreadyLoaded = prev.some((r) => r.parentId === row.id);
      if (alreadyLoaded) return prev;
      return prev.concat(LAZY_CHILDREN);
    });
  };

  const columns = useMemo(
    () => [
      {
        name: "name",
        width: "55%",
        header: { render: () => "Name" },
        render: (row: FakeSpan) => {
          const KindIcon = KIND_ICON[row.kind];
          return (
            <VuiFlexContainer alignItems="center" spacing="xs">
              <VuiFlexItem grow={false} shrink={false}>
                <VuiIcon size="s" color="subdued">
                  <KindIcon />
                </VuiIcon>
              </VuiFlexItem>
              <VuiFlexItem grow={false}>{row.name}</VuiFlexItem>
            </VuiFlexContainer>
          );
        }
      },
      {
        name: "status",
        width: "120px",
        header: { render: () => "Status" },
        render: (row: FakeSpan) => <VuiBadge color={STATUS_COLOR[row.status]}>{row.status}</VuiBadge>
      },
      {
        name: "startAt",
        width: "140px",
        header: { render: () => "Start at" },
        render: (row: FakeSpan) => (
          <VuiText size="s">
            <p>
              <VuiTextColor color="subdued">{row.startAt}</VuiTextColor>
            </p>
          </VuiText>
        )
      },
      {
        name: "duration",
        width: "120px",
        header: { render: () => "Duration" },
        render: (row: FakeSpan) => (
          <VuiText size="s">
            <p>
              <VuiTextColor color="subdued">{row.durationMs}ms</VuiTextColor>
            </p>
          </VuiText>
        )
      }
    ],
    []
  );

  const errorContent = (
    <>
      <VuiFlexItem grow={false}>
        <VuiIcon color="danger">
          <BiError />
        </VuiIcon>
      </VuiFlexItem>
      <VuiFlexItem grow={false}>
        <VuiText>
          <p>
            <VuiTextColor color="danger">Couldn't retrieve trace</VuiTextColor>
          </p>
        </VuiText>
      </VuiFlexItem>
    </>
  );

  return (
    <>
      <VuiFlexContainer wrap spacing="l">
        <VuiFlexItem shrink={false}>
          <VuiToggle label="Has data" checked={hasData} onChange={(e) => setHasData(e.target.checked)} />
        </VuiFlexItem>
        <VuiFlexItem shrink={false}>
          <VuiToggle label="Is loading" checked={isLoading} onChange={(e) => setIsLoading(e.target.checked)} />
        </VuiFlexItem>
        <VuiFlexItem shrink={false}>
          <VuiToggle label="Has error" checked={hasError} onChange={(e) => setHasError(e.target.checked)} />
        </VuiFlexItem>
        <VuiFlexItem shrink={false}>
          <VuiToggle
            label="Sticky header"
            checked={isHeaderSticky}
            onChange={(e) => setIsHeaderSticky(e.target.checked)}
          />
        </VuiFlexItem>
        <VuiFlexItem shrink={false}>
          <VuiToggle label="Fluid layout" checked={fluid} onChange={(e) => setFluid(e.target.checked)} />
        </VuiFlexItem>
      </VuiFlexContainer>

      <VuiSpacer size="xl" />

      <VuiSpans
        data-testid="spansTable"
        idField="id"
        parentField="parentId"
        rows={visibleRows}
        columns={columns}
        expandedIds={expandedIds}
        onExpandedIdsChange={setExpandedIds}
        onExpand={onExpand}
        isLoading={isLoading}
        content={hasError ? errorContent : undefined}
        isHeaderSticky={isHeaderSticky}
        fluid={fluid}
      />
    </>
  );
};
