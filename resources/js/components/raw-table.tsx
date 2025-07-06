import {
    Column,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    Row,
} from "@tanstack/react-table";
import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    EyeOff,
    MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="data-[state=open]:bg-accent -ml-3 h-8"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDown />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUp />
                        ) : (
                            <ChevronsUpDown />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(false)}
                    >
                        <ArrowUp />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(true)}
                    >
                        <ArrowDown />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => column.toggleVisibility(false)}
                    >
                        <EyeOff />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

interface DatatableActionColumnProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function DataTableActionColumn<TData, TValue>({
    children,
}: DatatableActionColumnProps<TData, TValue>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    path?: string;
    onRowSelectionChange?: (value: TData[]) => void;
    links: Link[];
    isJson?: boolean;
    handlePageChange?: (page: number) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    current_page,
    last_page,
    per_page,
    total,
    path = "tagihan.index",
    onRowSelectionChange,
    links,
    isJson = false,
    handlePageChange,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({});
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: last_page,
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
    });
    React.useEffect(() => {
        const selectedRows = table
            .getSelectedRowModel()
            .rows.map((r) => r.original);
        onRowSelectionChange?.(selectedRows);
    }, [table.getSelectedRowModel().rows.length]);

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                `w-${header.getSize()}`
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                `w-${cell.column.getSize()}`
                                            )}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Tidak Ada Data!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-3">
                <DataTablePagination
                    table={table}
                    currentPage={current_page as number}
                    lastPage={last_page as number}
                    onPageChange={(page) => {
                        if (isJson) {
                            handlePageChange?.(page);
                        } else {
                            router.visit(route(path, { page }), {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }
                    }}
                    links={links}
                />
            </div>
        </>
    );
}

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import { Table as ReactTable } from "@tanstack/react-table";
import { router } from "@inertiajs/react";
import React from "react";
interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

interface DataTablePaginationProps<TData> {
    table: ReactTable<TData>;
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    links: Link[]; // <-- Tambahan
}

export function DataTablePagination<TData>({
    table,
    currentPage,
    lastPage,
    onPageChange,
    links,
}: DataTablePaginationProps<TData>) {
    const pageSize = table.getState().pagination.pageSize;

    // Ambil hanya nomor halaman valid (label is number or '...'), skip prev/next labels
    const numberedLinks = links.filter(
        (link) => !isNaN(Number(link.label)) || link.label === "..."
    );

    return (
        <div className="flex items-center px-2 mt-4">
            <div className="flex w-full items-center justify-between space-x-6 lg:space-x-8">
                <div className="text-sm font-medium">
                    Halaman ke {currentPage} dari {lastPage}
                </div>
                <div className="flex items-center space-x-1">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage <= 1}
                        className="hidden lg:flex"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {numberedLinks.map((link, index) => (
                        <Button
                            key={index}
                            variant={link.active ? "default" : "outline"}
                            size="icon"
                            onClick={() => {
                                const page = Number(link.label);
                                if (!isNaN(page)) onPageChange(page);
                            }}
                            disabled={link.label === "..."}
                        >
                            {link.label}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= lastPage}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(lastPage)}
                        disabled={currentPage >= lastPage}
                        className="hidden lg:flex"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
