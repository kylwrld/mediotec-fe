"use client";

import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Pin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/custom-table-announcement";

import { useState } from "react";
import AnnouncementController from "./announcement-controller";

export default function AnnouncementDataTable({ columns, data, classes }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 4,
    });

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    return (
        <div className="w-full">
            <AnnouncementController table={table} classes={classes} />

            <div className="rounded-md border-0 lg:px-20 xl:px-40 2xl:px-72 py-8">
                <Table>
                    <TableBody className="flex flex-col gap-5">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    <td
                                        className="flex flex-col h-fit p-4 border rounded-md"
                                        onClick={() => console.log(row.original)}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-2 items-center">
                                                {/* <Avatar>
                                                    <AvatarImage
                                                        src="https://github.com/shadcn.png"
                                                        alt="@shadcn"
                                                    />
                                                    <AvatarFallback>
                                                        CN
                                                    </AvatarFallback>
                                                </Avatar> */}
                                                <div className="flex flex-col">
                                                    <p className="font-bold">{row.original.user.name}</p>
                                                    <span className="text-muted-foreground">
                                                        {new Date(row.original.created_at).toLocaleString("pt-BR")}
                                                    </span>
                                                </div>
                                            </div>
                                            {row.original.fixed && <Pin></Pin>}
                                        </div>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <p className="text-xl font-bold">{row.original.title}</p>
                                            <p>{row.original.body}</p>
                                        </div>
                                    </td>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nenhum resultado
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}>
                        Próximo
                    </Button>
                </div>
            </div>
        </div>
    );
}
