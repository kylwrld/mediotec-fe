"use client";

import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { CirclePlus, Pin } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/custom-table-announcements";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "./checkbox";
import { Textarea } from "./textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";

export default function AnnouncementDataTable({ columns, data }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([
        { id: "fixed", value: true },
    ]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0, //initial page index
        pageSize: 4, //default page size
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
            <div className="flex justify-between items-center flex-wrap gap-2 py-4 ">
                <div className="flex gap-2">
                    <Input
                        placeholder="Filtrar por título..."
                        value={table.getColumn("title")?.getFilterValue() ?? ""}
                        onChange={(event) => {
                            table
                                .getColumn("title")
                                ?.setFilterValue(event.target.value);
                        }}
                        className="max-w-sm text-[10px] md:text-sm"
                    />

                    <Button
                        className="text-[10px] md:text-sm bg-orange-600"
                        onClick={(event) => {
                            table.resetColumnFilters();
                        }}
                    >
                        Remover filtros
                    </Button>
                    <Button
                        className="text-[10px] md:text-sm bg-orange-600"
                        onClick={(event) => {
                            table.getColumn("fixed").setFilterValue(true);
                        }}
                    >
                        Fixados
                    </Button>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="text-[10px] md:text-sm bg-orange-600 gap-2"
                            onClick={(event) => {
                                console.log(table.getState().columnFilters);
                            }}
                        >
                            <CirclePlus size={20} />
                            Novo aviso
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[720px] h-2/4">
                        <DialogHeader>
                            <DialogTitle>Novo aviso</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-start flex-col gap-2">
                                <Label htmlFor="title" className="text-right">
                                    Título
                                </Label>
                                <Input id="title" value="" />
                            </div>
                            <div className="flex items-start flex-col gap-2">
                                <Label htmlFor="body" className="text-right">
                                    Conteúdo
                                </Label>
                                <Textarea
                                    placeholder="Digite o conteúdo do aviso."
                                    id="body"
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <Select onValueChange={(value) => {}}>
                                    <SelectTrigger className="w-[180px] text-muted-foreground text-[10px] md:text-sm">
                                        <SelectValue placeholder="Turma" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-52">
                                        <SelectItem value="1">
                                            Placeholder 1
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Placeholder 2
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Placeholder 3
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Placeholder 3
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Placeholder 3
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Placeholder 3
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Placeholder 3
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Placeholder 3
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Placeholder 3
                                        </SelectItem>
                                        <SelectItem value="3">
                                            Placeholder 3
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="fixed" />
                                    <label
                                        htmlFor="fixed"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Fixar aviso
                                    </label>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Criar aviso</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border-0 xl:px-60 2xl:px-80 py-8">
                <Table>
                    <TableBody className="flex flex-col gap-5">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    <div className="h-fit p-4 border rounded-md" onClick={() => console.log(row.original)}>
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
                                                    <p className="font-bold">
                                                        {row.original.user.name}
                                                    </p>
                                                    <span className="text-muted-foreground">
                                                        {new Date(
                                                            row.original.created_at
                                                        ).toLocaleString(
                                                            "pt-BR"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {row.original.fixed && <Pin></Pin>}
                                        </div>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <p className="text-xl font-bold">
                                                {row.original.title}
                                            </p>
                                            <p>{row.original.body}</p>
                                        </div>
                                    </div>
                                    {/* {row.getVisibleCells().map((cell) => (
                                        // Use onClick to redirect to another page
                                        // onClick -> row.original.id -> /estudante/:id
                                        <TableCell
                                            key={cell.id}
                                            className="p-4"
                                            onClick={() =>
                                                console.log(row.original)
                                            }
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))} */}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
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
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
