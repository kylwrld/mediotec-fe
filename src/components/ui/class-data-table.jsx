"use client";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    CirclePlus
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";


import AuthContext from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

const types = ["INFORMATICA", "LOGISTICA"];

const formSchema = z.object({
    name: z.string({ required_error: "Por favor preencha com um nome." }),
    degree: z.string({
        required_error: "Por favor preencha com um ano.",
    }),
    type: z.enum(types),
});

export default function ClassDataTable({ columns, data }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });

    const { postRequest } = useContext(AuthContext);

    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(_class) {
        postRequest("http://127.0.0.1:8000/class/", _class)
    }

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
                        placeholder="Filtrar nome..."
                        value={table.getColumn("name")?.getFilterValue() ?? ""}
                        onChange={(event) =>
                            table
                                .getColumn("name")
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm text-[10px] md:text-sm"
                    />
                    <Select
                        onValueChange={(value) => {
                            table.getColumn("type")?.setFilterValue(value);
                        }}
                    >
                        <SelectTrigger className="w-[180px] text-muted-foreground text-[10px] md:text-sm">
                            <SelectValue placeholder="Filtrar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="informatica">
                                Informática
                            </SelectItem>
                            <SelectItem value="logistica">Logística</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        className="text-[10px] md:text-sm bg-orange-600"
                        onClick={(event) => {
                            table.resetColumnFilters();
                        }}
                    >
                        Remover filtros
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
                            Nova turma
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                            <DialogTitle>Nova turma</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 overflow-y-auto max-h-[600px]">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-8 px-2 md:px-20 xl:px-32 w-full"
                                >
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Título</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Digite o nome da turma"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="degree"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Ano da turma
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="text-muted-foreground">
                                                            <SelectValue placeholder="Selecione um ano" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="1">
                                                            1
                                                        </SelectItem>
                                                        <SelectItem value="2">
                                                            2
                                                        </SelectItem>
                                                        <SelectItem value="3">
                                                            3
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Turma</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="text-muted-foreground">
                                                            <SelectValue placeholder="Selecione o tipo" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {types
                                                            ? types.map(
                                                                  (
                                                                      type,
                                                                      index
                                                                  ) => (
                                                                      <SelectItem
                                                                          key={
                                                                              index
                                                                          }
                                                                          value={
                                                                              type
                                                                          }
                                                                      >
                                                                          {type}
                                                                      </SelectItem>
                                                                  )
                                                              )
                                                            : null}
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-2">
                                        <Button type="submit">Enviar</Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="px-4"
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
                                    ))}
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
