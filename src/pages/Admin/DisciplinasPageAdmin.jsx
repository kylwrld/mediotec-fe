import { Pencil, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import SubjectController from "@/components/subject/subject-controller";
import SubjectFormEdit from "@/components/subject/subject-form-edit";
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
import CustomDataTable from "@/components/ui/custom-data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { deleteUndefinedKeys, mergeObjs } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

function getColumns(state, setState) {
    const { toast } = useToast();
    const { deleteRequest, patchRequest } = useContext(AuthContext);
    const navigate = useNavigate();

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Seleciona todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Seleciona linha"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: "Nome",
            cell: ({ row }) => (
                <div className="capitalize" onClick={() => navigate(`/disciplina/${row.original.id}`)}>
                    {row.getValue("name")}
                </div>
            ),
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
                                <Button aria-label="Editar disciplina" className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:bg-slate-200 outline-none">
                                    <Pencil size={18} />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[720px]">
                                <DialogHeader>
                                    <DialogTitle>Editar disciplina</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <SubjectFormEdit
                                        onSubmit={async (obj) => {
                                            obj = deleteUndefinedKeys(obj);
                                            const res = await patchRequest(
                                                `mascate-be.onrender.com/subject/${row.original.id}/`,
                                                obj
                                            );
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Disciplina editada com sucesso",
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
                                                    title: "Não foi possível editar informações da disciplina",
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
                                <Button aria-label="Remover disciplina" className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:text-white hover:bg-red-600 outline-none">
                                    <Trash2 size={18} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem certeza que deseja remover uma disciplina?</AlertDialogTitle>
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
                                                `mascate-be.onrender.com/subject/${row.original.id}/`
                                            );
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Turma removida com sucesso",
                                                });
                                                setState(state.filter((obj) => obj.id !== row.original.id));
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

function DisciplinasPageAdmin() {
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
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
    const columns = getColumns(subjects, setSubjects);

    const table = useReactTable({
        columns,
        data: subjects,
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
        const fetchSubjects = async () => {
            const response = await getRequest("mascate-be.onrender.com/subject/");
            const data = await response.json();
            setSubjects(data.subjects);
        };

        const fetchTeachers = async () => {
            const response = await getRequest("mascate-be.onrender.com/teacher/");
            const data = await response.json();
            setTeachers(data.teachers);
        };

        fetchSubjects();
        fetchTeachers();
        setLoading(false);
    }, []);

    return (
        <div className="h-full">
            <h1 className="text-4xl text-blue-600 font-bold">Disciplinas</h1>
            <div>
                <CustomDataTable table={table} pagination>
                    <SubjectController
                        table={table}
                        addSubject={(subject) => setSubjects([...subjects, subject])}
                        teachers={teachers}
                    />
                </CustomDataTable>
            </div>
        </div>
    );
}

export default DisciplinasPageAdmin;
