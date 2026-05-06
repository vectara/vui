import { useEffect, useState, useMemo } from "react";
import {
  VuiBadge,
  VuiCopyButton,
  VuiFlexContainer,
  VuiFlexItem,
  VuiIcon,
  VuiLink,
  VuiSelect,
  VuiSpacer,
  VuiText,
  VuiTextColor,
  VuiToggle
} from "../../../lib";
import { VuiTable } from "../../../lib/components/table/Table";
import { createFakePeople, Person } from "./createFakePeople";
import { BiError } from "react-icons/bi";

const ROWS_PER_PAGE = 20;
const people: Person[] = createFakePeople(152);

export const Table = () => {
  // Demo state
  const [hasError, setHasError] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [hasPager, setHasPager] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [canSelectRows, setCanSelectRows] = useState(true);
  const [hasActions, setHasActions] = useState(true);
  const [canSearch, setCanSearch] = useState(true);
  const [areNicknamesVisible, setAreNicknamesVisible] = useState(false);
  const [isAlignTop, setIsAlignTop] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [isResponsive, setIsResponsive] = useState(true);
  const [hasExpandableRows, setHasExpandableRows] = useState(true);
  const [showSelectedCount, setShowSelectedCount] = useState(true);

  // Table state
  const [isLoading, setIsLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [rows, setRows] = useState<Person[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<Person[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">("asc");

  const fetchPeople = () => {
    setIsLoading(true);
    setSelectedRows([]);
    return setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Mock request to fetch the rows.
  useEffect(() => {
    const timeout = fetchPeople();
    return () => {
      clearTimeout(timeout);
    };
  }, [currentPage, searchValue, hasData]);

  const onReload = () => {
    fetchPeople();
  };

  const handleSort = (column: string, direction: "asc" | "desc" | "none") => {
    if (direction === "none") {
      setSortColumn(null);
      setSortDirection("none");
    } else {
      setSortColumn(column);
      setSortDirection(direction);
    }
    setCurrentPage(1);
  };

  // Process data: filter, sort, and paginate
  const sortedAndFilteredPeople = useMemo(() => {
    const filteredPeople = hasData
      ? people.filter(({ name }) => {
          return name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase());
        })
      : [];

    // Apply sorting
    const sortedPeople =
      sortColumn && sortDirection !== "none"
        ? [...filteredPeople].sort((a, b) => {
            const aValue = a[sortColumn as keyof Person];
            const bValue = b[sortColumn as keyof Person];

            // Handle arrays (like roles)
            if (Array.isArray(aValue) && Array.isArray(bValue)) {
              const aStr = aValue.join(", ");
              const bStr = bValue.join(", ");
              return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
            }

            // Handle strings
            const aStr = String(aValue);
            const bStr = String(bValue);
            return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
          })
        : filteredPeople;

    return sortedPeople;
  }, [hasData, searchValue, sortColumn, sortDirection]);

  // Update rows and pagination when data changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const totalPages = Math.ceil(sortedAndFilteredPeople.length / ROWS_PER_PAGE);
    setNumPages(totalPages);
    setRows(sortedAndFilteredPeople.slice(startIndex, Math.min(endIndex, sortedAndFilteredPeople.length)));
  }, [sortedAndFilteredPeople, currentPage]);

  const columns = [
    {
      name: "#",
      header: {
        render: () => {
          return "#";
        }
      },
      render: (person: Person, rowIndex: number) => rowIndex + 1
    },
    {
      name: "name",
      header: {
        isSortable: true,
        render: () => {
          return "Name";
        }
      },
      testId: (person: Person) => `nameColumn-${person.id}`,
      render: (person: Person) => (
        <div>
          <div>
            <VuiLink onClick={() => console.log("Clicked", person.name)}>{person.name}</VuiLink>
          </div>

          {areNicknamesVisible && (
            <div>
              <VuiText size="xs">
                <p>
                  <VuiTextColor color="subdued">
                    Nickname: {person.name[0]}-{person.name.split(" ")[1].slice(0, 4)}
                  </VuiTextColor>
                </p>
              </VuiText>
            </div>
          )}
        </div>
      )
    },
    {
      name: "id",
      header: {
        isSortable: true,
        render: () => {
          return "ID";
        }
      }
    },
    {
      name: "description",
      header: {
        render: () => {
          return "Description";
        }
      },
      render: (person: Person) => (
        <VuiText truncate>
          <p>{person.description}</p>
        </VuiText>
      ),
      truncate: true
    },
    {
      name: "role",
      header: {
        render: () => {
          return "Roles";
        }
      },
      render: (person: Person) => {
        if (person.role.length > 0) {
          return (
            <VuiFlexContainer alignItems="center" spacing="xs" wrap>
              <VuiFlexItem grow={false} shrink={false}>
                {person.role.join(", ")}
              </VuiFlexItem>

              <VuiFlexItem grow={false} shrink={false}>
                <VuiCopyButton
                  size="xs"
                  value={person.role.join(", ")}
                  options={[{ value: person.role.length, label: "Copy number of roles" }]}
                />
              </VuiFlexItem>
            </VuiFlexContainer>
          );
        }
      }
    },
    {
      name: "status",
      header: {
        isSortable: true,
        render: () => {
          return "Status";
        }
      },
      render: (person: Person) => {
        return <VuiBadge color={person.status === "Active" ? "success" : "neutral"}>{person.status}</VuiBadge>;
      }
    }
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (person: Person) => {
        console.log("Edit", person);
      },
      testId: "editAction"
    },
    {
      label: "Delete",
      onClick: (person: Person) => {
        console.log("Delete", person);
      },
      testId: "deleteAction"
    },
    {
      label: "Search",
      href: (person: Person) => `https://www.google.com/search?q=${person.name}`,
      testId: "searchAction"
    }
  ];

  let content;

  if (hasError) {
    content = (
      <>
        <VuiFlexItem grow={false}>
          <VuiIcon color="danger">
            <BiError />
          </VuiIcon>
        </VuiFlexItem>

        <VuiFlexItem grow={false}>
          <VuiText>
            <p>
              <VuiTextColor color="danger">Couldn't retrieve data</VuiTextColor>
            </p>
          </VuiText>
        </VuiFlexItem>
      </>
    );
  } else if (!isLoading && !searchValue && !rows.length) {
    content = (
      <VuiText>
        <p>
          You don't have any people yet. <VuiLink href="/">Create a person.</VuiLink>
        </p>
      </VuiText>
    );
  }

  const selection = canSelectRows
    ? {
        selectedRows,
        isRowSelectable: (row: Person) => row.status === "Active",
        onSelectRow: (selectedRows: Person[]) => setSelectedRows(selectedRows),
        showSelectedCount,
        bulkActions: [
          {
            label: "Edit",
            onClick: (people: Person[]) => {
              console.log("Edit", people);
            }
          },
          {
            label: "Combine",
            onClick: (people: Person[]) => {
              console.log("Combine", people);
            }
          },
          {
            label: "Delete",
            onClick: (people: Person[]) => {
              console.log("Delete", people);
            }
          }
        ]
      }
    : undefined;

  const search = canSearch
    ? {
        value: searchValue,
        placeholder: "Search people",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setCurrentPage(1);
          setSearchValue(e.target.value);
        }
      }
    : undefined;

  const pagination = hasPager
    ? {
        onSelectPreviousPage: currentPage > 1 ? () => setCurrentPage(currentPage - 1) : undefined,
        onSelectNextPage: currentPage < numPages ? () => setCurrentPage(currentPage + 1) : undefined
      }
    : {
        currentPage: currentPage,
        numPages: numPages,
        onSelectPage: (page: number) => setCurrentPage(page)
      };

  return (
    <>
      <VuiFlexContainer wrap spacing="l">
        <VuiFlexItem shrink={false}>
          <VuiToggle label="Has error" checked={hasError} onChange={(e) => setHasError(e.target.checked)} />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle label="Has data" checked={hasData} onChange={(e) => setHasData(e.target.checked)} />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle label="Has pager" checked={hasPager} onChange={(e) => setHasPager(e.target.checked)} />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle label="Is disabled" checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle
            label="Can select rows"
            checked={canSelectRows}
            onChange={(e) => setCanSelectRows(e.target.checked)}
          />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle label="Has actions" checked={hasActions} onChange={(e) => setHasActions(e.target.checked)} />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle label="Can search" checked={canSearch} onChange={(e) => setCanSearch(e.target.checked)} />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle
            label="Show nicknames"
            checked={areNicknamesVisible}
            onChange={(e) => setAreNicknamesVisible(e.target.checked)}
          />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle label="Align top" checked={isAlignTop} onChange={(e) => setIsAlignTop(e.target.checked)} />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle
            label="Is header sticky"
            checked={isHeaderSticky}
            onChange={(e) => setIsHeaderSticky(e.target.checked)}
          />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle label="Is responsive" checked={isResponsive} onChange={(e) => setIsResponsive(e.target.checked)} />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle
            label="Has expandable rows"
            checked={hasExpandableRows}
            onChange={(e) => setHasExpandableRows(e.target.checked)}
          />
        </VuiFlexItem>

        <VuiFlexItem shrink={false}>
          <VuiToggle
            label="Show selected count"
            checked={showSelectedCount}
            onChange={(e) => setShowSelectedCount(e.target.checked)}
          />
        </VuiFlexItem>
      </VuiFlexContainer>

      <VuiSpacer size="xl" />

      {/* TODO: Encapsulate search and sort state in a table hook that can be configured with a fetch callback */}
      {/* TODO: Async sorting */}

      <VuiTable
        data-testid="peopleTable"
        isLoading={isLoading}
        idField="id"
        rowDecorator={(person: Person) => ({ className: "testRowClass", "data-testid": person.name })}
        columns={columns}
        rows={rows}
        content={content}
        actions={hasActions ? actions : undefined}
        actionsTestIdProvider={(person: Person) => `actions-${person.id}`}
        reloadTestId="reloadButton"
        pagination={pagination}
        selection={selection}
        onSort={handleSort}
        onReload={onReload}
        search={search}
        customControls={
          <VuiSelect
            id="optionsList1"
            options={[
              { text: "All roles", value: "all" },
              { text: "Guests", value: "guests" },
              { text: "Staff", value: "staff" }
            ]}
            value="all"
            onChange={(event) => console.log(`Selected ${event.target.value}`)}
          />
        }
        isDisabled={isDisabled}
        bodyStyle={{
          verticalAlign: isAlignTop ? "top" : undefined
        }}
        isHeaderSticky={isHeaderSticky}
        isResponsive={isResponsive}
        collapsedContent={
          hasExpandableRows
            ? (person: Person) => (
                <VuiTable
                  isResponsive={false}
                  idField="color"
                  rows={[
                    {
                      color: "red",
                      item: "apple"
                    },
                    {
                      color: "orange",
                      item: "orange"
                    },
                    {
                      color: "yellow",
                      item: "banana"
                    }
                  ]}
                  columns={[
                    {
                      name: "color",
                      header: {
                        render: () => {
                          return "Color";
                        }
                      }
                    },
                    {
                      name: "item",
                      header: {
                        render: () => {
                          return "Item";
                        }
                      }
                    }
                  ]}
                />
              )
            : undefined
        }
      />
    </>
  );
};
