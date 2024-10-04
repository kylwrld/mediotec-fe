"use client";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AuthContext from "@/context/AuthContext";

import { useToast } from "@/hooks/use-toast";
import TeacherController from "./teacher-controller";

const formSchema = z.object({
    name: z.string({ required_error: "Por favor preencha com um nome." }),
    email: z
        .string({
            required_error: "Por favor preencha com um email.",
        })
        .email("Esse email não é válido."),
    password: z
        .string({
            required_error: "Por favor digite uma senha.",
        })
        .min(3, { message: "A senha precisa ter no mínimo 3 caracteres." }),
    birth_date: z.date({
        required_error: "Por favor especifique a data de nascimento.",
    }),
});

function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}
export default function TeacherDataTable({ columns, data, classes }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });



    async function onSubmit(user) {
        user.birth_date = formatDate(new Date(user.birth_date));
        user.type = "TEACHER";
        const res = await postRequest("http://127.0.0.1:8000/signup/", user);
        if (res.ok) {
            toast({
                variant: "success",
                title: "Professor criado com sucesso.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível criar professor",
            });
        }
    }

    async function attachClass(rows, teacher_id) {
        // const data = {};
        // data.student = rows.map((row) => row.original.id);
        // data._class = class_id;
        // if (data.student.length === 0 || typeof data._class !== "string") return;
        // const res = await postRequest("http://127.0.0.1:8000/student-class/", data);
        // if (res.ok) {
        //     toast({
        //         variant: "success",
        //         title: "Estudante(s) adicionado(s) a turma com sucesso.",
        //     });
        // } else {
        //     toast({
        //         variant: "destructive",
        //         title: "Selecione no mínimo 1 estudante e uma turma",
        //         description: "Os estudantes não podem fazer parte da turma escolhida.",
        //     });
        // }
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
            <TeacherController table={table} classes={classes} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="px-4">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        // Use onClick to redirect to another page
                                        // onClick -> row.original.id -> /professor/:id
                                        <TableCell
                                            key={cell.id}
                                            className="p-4"
                                            onClick={() => console.log(row.original)}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
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
