import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  InitialTableState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Menu, NumberInput, Pagination } from "@mantine/core";
import { Pagination as PaginationType } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import {
  defaultPaginationLimit,
  defaultPaginationPage,
  whitelistColumnNames,
} from "@/constants";
import {
  CheckIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
} from "lucide-react";

type Props<TData> = {
  name: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: PaginationType;
  initialState?: InitialTableState;
};
export default function DataGrid<TData>({
  data,
  columns,
  pagination,
  initialState,
}: Props<TData>) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  // State
  const [paginationState, setPaginationState] = useState({
    pageIndex: pagination ? pagination.page - 1 : defaultPaginationPage - 1,
    pageSize: pagination ? pagination.limit : defaultPaginationLimit,
  });

  const table = useReactTable<TData>({
    data,
    columns: [...columns, { accessorKey: "actions", header: "" }],
    getCoreRowModel: getCoreRowModel(),
    initialState,
    manualPagination: true,
    pageCount: pagination?.total_pages,
    rowCount: pagination?.total,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPaginationState,
    state: {
      pagination: paginationState,
    },
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    <div className="flex items-center justify-between">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          {header.getContext().column.getIsLastColumn() ? (
                            <PlusIcon className="cursor-pointer" />
                          ) : (
                            <ChevronDownIcon className="cursor-pointer" />
                          )}
                        </Menu.Target>
                        <Menu.Dropdown>
                          {header.getContext().column.getIsLastColumn() ? (
                            table
                              .getAllColumns()
                              .filter((column) => !column.getIsVisible())
                              .map((column) => (
                                <Menu.Item
                                  leftSection={
                                    <EyeIcon className="size-5 mt-0.5" />
                                  }
                                  onClick={() => {
                                    column.toggleVisibility();
                                  }}
                                >
                                  {column.columnDef.header?.toString()}
                                </Menu.Item>
                              ))
                          ) : (
                            <Menu.Item
                              leftSection={
                                <EyeOffIcon className="size-5 mt-0.5" />
                              }
                              onClick={() => {
                                header.getContext().column.toggleVisibility();
                              }}
                            >
                              Hide Field
                            </Menu.Item>
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.getValue() !== null
                      ? flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      : cell.getContext().column.getIsLastColumn()
                      ? ""
                      : whitelistColumnNames.includes(
                          cell
                            .getContext()
                            .column.columnDef.header?.toString()
                            .toLowerCase() || ""
                        )
                      ? flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      : "N/A"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && (
        <section className={twMerge("flex justify-between items-center")}>
          <div className="flex items-center gap-2 w-45">
            <span className="pb-1">Rows Per Page</span>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <div className="flex items-center gap-2 border border-c-gray shadow-sm rounded-sm px-2">
                  <span>{pagination.limit}</span>
                  <ChevronDownIcon className="cursor-pointer" strokeWidth={1} />
                </div>
              </Menu.Target>
              <Menu.Dropdown>
                {[5, 10, 25, 50].map((value) => (
                  <Menu.Item
                    key={value}
                    disabled={value === pagination.limit}
                    onClick={() => {
                      navigate({
                        // @ts-expect-error need to figure out how to get types with dynamic from value
                        search: { ...search, page: 1, limit: value },
                      });
                      // localStorage.setItem(
                      //   localPaginationName,
                      //   JSON.stringify({ page: 1, limit: value })
                      // );
                    }}
                  >
                    {value}
                  </Menu.Item>
                ))}
                <Menu.Item>
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => {
                      if (
                        (e.target as HTMLElement).id ===
                        "pagination-custom-limit"
                      ) {
                        e.stopPropagation();
                      }
                    }}
                  >
                    <NumberInput
                      id="pagination-custom-limit"
                      placeholder="Custom"
                      allowDecimal={false}
                      allowNegative={false}
                      allowLeadingZeros={false}
                      value={paginationState.pageSize}
                      onChange={(value) => {
                        setPaginationState({
                          ...paginationState,
                          pageSize: +value,
                        });
                      }}
                    />
                    <CheckIcon
                      className="size-5 mt-0.5"
                      onClick={() => {
                        if (!paginationState.pageSize) return;
                        if (paginationState.pageSize === pagination.limit)
                          return;
                        if (paginationState.pageSize < 1) return;
                        if (isNaN(paginationState.pageSize)) return;

                        navigate({
                          search: {
                            ...search,
                            // @ts-expect-error need to figure out how to get types with dynamic from value
                            page: 1,
                            limit: paginationState.pageSize,
                          },
                        });
                        // localStorage.setItem(
                        //   localPaginationName,
                        //   JSON.stringify({ page: 1, limit: customLimit })
                        // );
                      }}
                    />
                  </div>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          <Pagination
            total={table.getPageCount()}
            onChange={(page) => {
              if (page === pagination.page) return;

              table.setPageIndex(page - 1);
              // @ts-expect-error IDK how to type navigate in reuseable components
              navigate({ search: { ...search, page: page } });
            }}
            className="flex justify-center mt-4"
          />
          <div className="w-45 text-end">
            <span>
              {pagination.limit * (pagination.page - 1) + 1} -{" "}
              {Math.min(pagination.total, pagination.limit * pagination.page)}{" "}
              of {pagination.total}
            </span>
          </div>
        </section>
      )}
    </div>
  );
}
