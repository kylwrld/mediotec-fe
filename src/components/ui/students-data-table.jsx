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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";
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

import AuthContext from "@/context/AuthContext";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const phoneSchema = z.object({
    ddd: z
        .string()
        .min(2, { message: "DDD precisa conter dois dígitos" })
        .max(2, { message: "DDD precisa ser exatamente dois dígitos" })
        .regex(/^[0-9]+$/, { message: "DDD precisa conter apenas números" }),
    number: z
        .string()
        .min(8, { message: "Telefone precisa ter pelo menos 8 dígitos" })
        .max(9, { message: "Telefone precisa ter no máximo 9 dígitos" })
        .regex(/^[0-9]+$/, {
            message: "Telefone precisa conter apenas números",
        }),
});

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
    parent: z.object({
        name: z.string({
            required_error: "Por favor preencha o nome do responsável.",
        }),
        cpf: z
            .string({
                required_error: "Por favor preencha o CPF do responsável.",
            })
            .min(14, { message: "O CPF precisa ter 14 dígitos" }),
        // .regex(/[0-9]+\.[0-9]+\.[0-9]+-[0-9]{2}/, { message: "CPF precisa estar no padrão XXX.XXX.XXX-XX" }),
    }),
    phone: z.array(phoneSchema).optional(),
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

export default function StudentsDataTable({ columns, data }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });

    const { postSignup } = useContext(AuthContext);

    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(user) {
        user.birth_date = formatDate(new Date(user.birth_date));
        console.log(user);
        postSignup("http://127.0.0.1:8000/signup/student/", user);
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
                        placeholder="Filtrar estudantes..."
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
                            table.getColumn("degree")?.setFilterValue(value);
                        }}
                    >
                        <SelectTrigger className="w-[180px] text-muted-foreground text-[10px] md:text-sm">
                            <SelectValue placeholder="Filtrar ano" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
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

                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="text-[10px] md:text-sm bg-orange-600 gap-2">
                                <CirclePlus size={20} />
                                Novo estudante
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[720px]">
                            <DialogHeader>
                                <DialogTitle>Novo estudante</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-8 px-2 md:px-20 xl:px-32 w-full overflow-y-auto max-h-[600px]"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nome do Estudante
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite o nome do estudante"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite o email do estudante"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Senha</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Digite a senha do estudante"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="birth_date"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>
                                                        Data de nascimento
                                                    </FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={
                                                                        "outline"
                                                                    }
                                                                    className={cn(
                                                                        "w-[240px] pl-3 text-left font-normal",
                                                                        !field.value &&
                                                                            "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        format(
                                                                            field.value,
                                                                            "PPP",
                                                                            {
                                                                                locale: ptBR,
                                                                            }
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            Selecione
                                                                            uma
                                                                            data
                                                                        </span>
                                                                    )}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    field.value
                                                                }
                                                                onSelect={
                                                                    field.onChange
                                                                }
                                                                disabled={(
                                                                    date
                                                                ) =>
                                                                    date >
                                                                        new Date() ||
                                                                    date <
                                                                        new Date(
                                                                            "1900-01-01"
                                                                        )
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormDescription>
                                                        A data de nascimento é
                                                        usada para calcular a
                                                        idade do estudante.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="parent.name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Nome do responsável
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite o nome do responsável"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="parent.cpf"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        CPF do responsável
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Digite o CPF do responsável"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {(form.watch("phone") || []).map(
                                            (phone, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="grid grid-cols-2 gap-4"
                                                    >
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name={`phone.${index}.ddd`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        DDD
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="DDD"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name={`phone.${index}.number`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Número
                                                                        de
                                                                        telefone
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Digite o número de telefone do responsável"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                );
                                            }
                                        )}

                                        <div className="flex gap-2">
                                            <Button type="submit">
                                                Enviar
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    form.setValue("phone", [
                                                        ...(form.watch(
                                                            "phone"
                                                        ) || []),
                                                        { ddd: "", number: "" },
                                                    ]);
                                                }}
                                            >
                                                Adicionar outro telefone
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
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
