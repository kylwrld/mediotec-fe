import ClassController from "@/components/class/class-controller";
import ClassFormEdit from "@/components/class/class-form-edit";
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
import { Button } from "@/components/ui/button";
import CustomDataTable from "@/components/ui/custom-data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { deleteUndefinedKeys, mergeObjs } from "@/lib/utils";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getColumns(state, setState) {
    const { toast } = useToast();
    const { deleteRequest, patchRequest } = useContext(AuthContext);
    const navigate = useNavigate();

    const columns = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0">
                        Nome
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize" onClick={() => navigate(`/turma/${row.original.id}`)}>
                    {row.getValue("name")}
                </div>
            ),
        },
        {
            accessorKey: "degree",
            header: "Ano",
            cell: ({ row }) => <div className="lowercase">{row.getValue("degree")}</div>,
        },
        {
            accessorKey: "type",
            header: () => <div className="text-right">Curso</div>,
            cell: ({ row }) => {
                return <div className="text-right font-medium">{row.getValue("type") || "Sem tipo"}</div>;
            },
            filterFn: "includesString",
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
                                <Button aria-label="Editar turma" className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:bg-slate-200 outline-none">
                                    <Pencil size={18} />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[720px]">
                                <DialogHeader>
                                    <DialogTitle>Editar turma</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <ClassFormEdit
                                        onSubmit={async (obj) => {
                                            obj = deleteUndefinedKeys(obj);
                                            const res = await patchRequest(
                                                `mascate-be.onrender.com/class/${row.original.id}/`,
                                                obj
                                            );
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Turma editada com sucesso",
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
                                                    title: "Não foi possível editar informações da turma",
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
                                <Button aria-label="Remover turma" className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:text-white hover:bg-red-600 outline-none">
                                    <Trash2 size={18} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem certeza que deseja remover uma turma?</AlertDialogTitle>
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
                                                `mascate-be.onrender.com/class/${row.original.id}/`
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

function TurmasPageAdmin() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { getRequest } = useContext(AuthContext);
    const columns = getColumns(classes, setClasses);

    const table = useReactTable({
        columns,
        data: classes,
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
        const fetchClasses = async () => {
            const response = await getRequest("mascate-be.onrender.com/class/");
            const data = await response.json();
            setClasses(data.classes);
            setLoading(false);
        };
        fetchClasses();
    }, []);

    return (
        <div className="h-full">
            <h1 className="text-4xl text-blue-600 font-bold">Turmas</h1>
            <CustomDataTable table={table} pagination>
                <ClassController table={table} addClass={(_class) => setClasses([...classes, _class])} newClassButton />
            </CustomDataTable>
        </div>
    );
}

export default TurmasPageAdmin;
