import AdminController from "@/components/admin/admin-controller";
import AdminFormEdit from "@/components/admin/admin-form-edit";
import Spinner from "@/components/Spinner";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CustomDataTable from "@/components/ui/custom-data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { appendFieldsUserForm, changeStateOnEdit, deleteUndefinedKeys, formatDate, mergeObjs } from "@/lib/utils";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function getColumns(state, setState) {
    const { toast } = useToast();
    const { deleteRequest, putRequest } = useContext(AuthContext);
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
                <div className="capitalize flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={row.original.image} />
                        <AvatarFallback>-</AvatarFallback>
                    </Avatar>
                    {row.getValue("name")}
                </div>
            ),
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
                                <Button
                                    aria-label="Editar coordenador(a)"
                                    className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:bg-slate-200 outline-none">
                                    <Pencil size={18} />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[720px]">
                                <DialogHeader>
                                    <DialogTitle>Editar coordenador(a)</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <AdminFormEdit
                                        onSubmit={async (obj) => {
                                            obj = deleteUndefinedKeys(obj);
                                            if (obj.birth_date) {
                                                obj.birth_date = formatDate(new Date(obj.birth_date));
                                            }

                                            const form = appendFieldsUserForm(obj);

                                            const res = await putRequest(
                                                `user_admin/${row.original.id}/`,
                                                form,
                                                false,
                                                false
                                            );
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Professor editado com sucesso",
                                                });

                                                changeStateOnEdit(state, setState, row, obj)

                                                // if (obj["image"]) {
                                                //     changeStateOnEdit(state, setState, row, obj)
                                                // } else {
                                                //     setState(
                                                //         state.map((stateObj) =>
                                                //             stateObj.id !== row.original.id
                                                //                 ? stateObj
                                                //                 : mergeObjs(stateObj, obj)
                                                //         )
                                                //     );
                                                // }
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
                                <Button
                                    aria-label="Remover coordenador(a)"
                                    className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:text-white hover:bg-red-600 outline-none">
                                    <Trash2 size={18} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Tem certeza que deseja remover um coordenador(a)?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Os dados serão permanentemente deletados.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-800"
                                        onClick={async () => {
                                            const res = await deleteRequest(`user_admin/${row.original.id}/`);
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Coordenador(a) removido com sucesso",
                                                });
                                                setStudents(
                                                    students.filter((studentObj) => studentObj.id !== row.original.id)
                                                );
                                            } else {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Não foi possível remover coordenador(a)",
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

function AdminsPageAdmin() {
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState([]);
    const { getRequest } = useContext(AuthContext);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        const fetchAdmins = async () => {
            const res = await getRequest("user_admin/");
            const data = await res.json();
            setAdmins(data.admins);
            setLoading(false);
        };
        fetchAdmins();
    }, []);

    const columns = getColumns(admins, setAdmins);

    const adminsTable = useReactTable({
        columns,
        data: admins,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        // onColumnVisibilityChange: setColumnVisibility,
        // onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    if (loading) return <Spinner />;

    return (
        <div className="h-full">
            <h1 className="text-4xl text-blue-600 font-bold">Coordenação</h1>
            <CustomDataTable table={adminsTable} pagination>
                <AdminController
                    table={adminsTable}
                    addAdmin={(admin) => setAdmins([...admins, admin])}
                    newAdminButton
                />
            </CustomDataTable>
        </div>
    );
}

export default AdminsPageAdmin;
