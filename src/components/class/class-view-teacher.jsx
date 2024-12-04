import ClassController from "@/components/class/class-controller";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import CustomDataTable from "@/components/ui/custom-data-table";
import AuthContext from "@/context/AuthContext";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { toast } from "@/hooks/use-toast";

function getColumns(state, setState) {
    const navigate = useNavigate();
    const { deleteRequest } = useContext(AuthContext)

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
                return <div className="text-right font-medium">{row.getValue("type")}</div>;
            },
            filterFn: "includesString",
        },
        // {
        //     id: "actions",
        //     enableHiding: false,
        //     cell: ({ row }) => {
        //         return (
        //             <div className="flex justify-end items-end gap-2">
        //                 {/* delete */}
        //                 <AlertDialog>
        //                     <AlertDialogTrigger asChild>
        //                         <Button
        //                             aria-label="Remover disciplina do professor"
        //                             className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:text-white hover:bg-red-600 outline-none">
        //                             <Trash2 size={18} />
        //                         </Button>
        //                     </AlertDialogTrigger>
        //                     <AlertDialogContent>
        //                         <AlertDialogHeader>
        //                             <AlertDialogTitle>Tem certeza que deseja remover a turma do professor?</AlertDialogTitle>
        //                             <AlertDialogDescription>
        //                                 Esta ação não pode ser desfeita. Os dados serão permanentemente deletados.
        //                             </AlertDialogDescription>
        //                         </AlertDialogHeader>
        //                         <AlertDialogFooter>
        //                             <AlertDialogCancel>Cancelar</AlertDialogCancel>
        //                             <AlertDialogAction
        //                                 className="bg-red-600 hover:bg-red-800"
        //                                 onClick={async () => {
        //                                     const res = await deleteRequest(`class_year/${row.original.id}/`);
        //                                     if (res.ok) {
        //                                         toast({
        //                                             variant: "success",
        //                                             title: "Turma removida com sucesso",
        //                                         });
        //                                         setState(state.filter((_class) => _class.id !== row.original.id));
        //                                     } else {
        //                                         toast({
        //                                             variant: "destructive",
        //                                             title: "Não foi possível remover a turma",
        //                                         });
        //                                     }
        //                                 }}>
        //                                 Remover
        //                             </AlertDialogAction>
        //                         </AlertDialogFooter>
        //                     </AlertDialogContent>
        //                 </AlertDialog>
        //             </div>
        //         );
        //     },
        // },
    ];

    return columns;
}

function ClassViewTeacher({ id }) {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getRequest, decodeToken } = useContext(AuthContext);

    const columns = getColumns(classes, setClasses);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        columns,
        data: classes,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

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
            const response = await getRequest(`teacher/${id}/classes/`);
            const data = await response.json();
            setClasses(data.classes);
            setLoading(false);
        };
        fetchClasses();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="h-full">
            <CustomDataTable table={table} pagination>
                <ClassController table={table} />
            </CustomDataTable>
        </div>
    );
}

export default ClassViewTeacher;
