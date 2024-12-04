import { useContext, useEffect, useState } from "react";

import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import Spinner from "@/components/Spinner";
import SubjectController from "@/components/subject/subject-controller";
import CustomDataTable from "@/components/ui/custom-data-table";
import AuthContext from "@/context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label="Seleciona todos"
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             aria-label="Seleciona linha"
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "name",
            header: "Nome",
            cell: ({ row }) => (
                <div className="capitalize" onClick={() => navigate(`/disciplina/${row.original.subject.id}`)}>
                    {/* {row.getValue("name")} */}
                    {row.original.subject.name}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-end items-end gap-2">
                        {/* delete */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    aria-label="Remover disciplina do professor"
                                    className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:text-white hover:bg-red-600 outline-none">
                                    <Trash2 size={18} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem certeza que deseja remover a disciplina do professor?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Os dados serão permanentemente deletados.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-800"
                                        onClick={async () => {
                                            const res = await deleteRequest(`teacher_subject/${row.original.id}/`);
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Disciplina removida com sucesso",
                                                });
                                                setState(state.filter((teacherSubject) => teacherSubject.id !== row.original.id));
                                            } else {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Não foi possível remover a disciplina",
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

function SubjectView() {
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { id } = useParams();
    const { getRequest } = useContext(AuthContext);
    const columns = getColumns(teacherSubjects, setTeacherSubjects);

    const table = useReactTable({
        columns,
        data: teacherSubjects,
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
            const response = await getRequest(`teacher/${id}/subjects/`);
            const data = await response.json();
            const subjects = [];
            // for (const teacherSubject of data.teacher_subjects) {
            //     subjects.push(teacherSubject.subject);
            // }
            setTeacherSubjects(data.teacher_subjects);

            setLoading(false);
        };

        fetchSubjects();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="flex justify-center items-center w-full">
            <CustomDataTable table={table} pagination>
                <SubjectController table={table} />
            </CustomDataTable>
        </div>
    );
}

export default SubjectView;
