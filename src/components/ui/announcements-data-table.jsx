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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const formSchema = z.object({
    title: z.string({ required_error: "Por favor preencha com um título." }),
    body: z
        .string({
            required_error: "Por favor preencha com algum conteúdo.",
        }),
    fixed: z.boolean().default(false),
    _class: z.string().optional(),
});

export default function AnnouncementDataTable({ columns, data, classes }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0, //initial page index
        pageSize: 4, //default page size
    });

    const { postRequest } = useContext(AuthContext);

    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(announcement) {
        const res = await postRequest("http://127.0.0.1:8000/announcement/", announcement)
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
                        placeholder="Filtrar título..."
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
                    <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                            <DialogTitle>Novo aviso</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 overflow-y-auto max-h-[600px]">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-8 px-2 md:px-20 xl:px-32 w-full"
                                >
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Título</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Digite o nome do professor"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="body"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Conteúdo</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Digite o conteúdo do aviso"
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="_class"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Turma</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="text-muted-foreground">
                                                            <SelectValue placeholder="Selecione uma turma (opcional)" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {classes ? classes.map((class_year, index) => (
                                                            <SelectItem key={index}
                                                                value={class_year._class.id.toString()}>
                                                                {class_year._class.name}
                                                            </SelectItem>)
                                                        ): null}
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="fixed"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                    <FormLabel>Fixar</FormLabel>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
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

            <div className="rounded-md border-0 lg:px-20 xl:px-40 2xl:px-72 py-8">
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
                                    <td
                                        className="flex flex-col h-fit p-4 border rounded-md"
                                        onClick={() =>
                                            console.log(row.original)
                                        }
                                    >
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
                                    </td>
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
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Próximo
                    </Button>
                </div>
            </div>
        </div>
    );
}
