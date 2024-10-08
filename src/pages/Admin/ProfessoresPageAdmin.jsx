import TeacherController from "@/components/teacher/teacher-controller";
import TeacherFormEdit from "@/components/teacher/teacher-form-edit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomDataTable from "@/components/ui/custom-data-table";
import { deleteUndefinedKeys, mergeObjs } from "@/lib/utils";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

function getColumns(state, setState) {
    const { toast } = useToast();
    const { deleteRequest, patchRequest } = useContext(AuthContext);

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    aria-label="Seleciona todos"
                />
            ),
            cell: ({ row, table }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        const rowsModel = table.getSelectedRowModel();
                        if (rowsModel.rows.length > 0) {
                            const s_row = rowsModel.rows[0];
                            s_row.toggleSelected(false);
                            row.toggleSelected(!!value);
                        } else {
                            row.toggleSelected(!!value);
                        }
                    }}
                    aria-label="Seleciona linha"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0"
                        aria-label="Ordena por nome">
                        Nome
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-end items-end gap-2">
                        {/* edit */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:bg-slate-200 outline-none">
                                    <Pencil size={18} />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[720px]">
                                <DialogHeader>
                                    <DialogTitle>Editar professor</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <TeacherFormEdit
                                        onSubmit={async (obj) => {
                                            obj = deleteUndefinedKeys(obj);
                                            if (obj.birth_date) {
                                                obj.birth_date = formatDate(new Date(obj.birth_date));
                                            }
                                            const res = await patchRequest(
                                                `https://mediotec-be.onrender.com/teacher/${row.original.id}/`,
                                                obj
                                            );
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Professor editado com sucesso",
                                                });
                                                setState(
                                                    state.map((stateObj) =>
                                                        stateObj.id !== row.original.id
                                                            ? stateObj
                                                            : mergeObjs(stateObj, obj)
                                                    )
                                                );
                                            } else {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Não foi possível editar informações do professor",
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* delete */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:text-white hover:bg-red-600 outline-none">
                                    <Trash2 size={18} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem certeza que deseja remover um professor?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Os dados serão permanentemente deletados.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-800"
                                        onClick={async () => {
                                            const res = await deleteRequest(
                                                `https://mediotec-be.onrender.com/teacher/${row.original.id}/`
                                            );
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Turma removida com sucesso",
                                                });
                                                setState(state.filter((_class) => _class.id !== row.original.id));
                                            } else {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Não foi possível remover turma",
                                                });
                                            }
                                        }}>
                                        Remover
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
            },
        },
    ];

    return columns;
}

function ProfessoresPageAdmin() {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { getRequest } = useContext(AuthContext);
    const columns = getColumns(teachers, setTeachers);

    const table = useReactTable({
        columns,
        data: teachers,
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

    useEffect(() => {
        const fetchTeachers = async () => {
            const response = await getRequest("https://mediotec-be.onrender.com/teacher/");
            const data = await response.json();
            setTeachers(data.teachers);
            setLoading(false);
        };
        const fetchClasses = async () => {
            const response = await getRequest("https://mediotec-be.onrender.com/class_year/");
            const data = await response.json();
            setClasses(data.class_years);
        };

        fetchTeachers();
        fetchClasses();
    }, []);

    return (
        <div className="h-full">
            <h1 className="text-4xl text-blue-600 font-bold">Professores</h1>
            <CustomDataTable table={table}>
                <TeacherController
                    table={table}
                    addTeacher={(teacher) => setTeachers([...teachers, teacher])}
                    classes={classes}
                    newTeacherButton
                    attachClassButton
                    attachSubjectButton
                />
            </CustomDataTable>
        </div>
    );
}

export default ProfessoresPageAdmin;
