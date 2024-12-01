import Spinner from "@/components/Spinner";
import StudentController from "@/components/student/student-controller";
import StudentFormEdit from "@/components/student/student-form-edit";
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
import { changeStateOnEdit, deleteUndefinedKeys, formatDate, mergeObjs } from "@/lib/utils";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function getColumns(students, setStudents) {
    const { toast } = useToast();
    const { deleteRequest, putRequest } = useContext(AuthContext);
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
                <div className="capitalize flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={row.original.image} alt="@shadcn" />
                        <AvatarFallback>
                            <img src="https://tiermaker.com/images/media/avatars-2024/jvilla699/jvilla699.jpg?1721389851" />
                        </AvatarFallback>
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
            accessorKey: "class_year",
            header: "Turma",
            cell: ({ row }) => <div>{row.original.class_year?._class.name || "Sem turma"}</div>,
            filterFn: (row, columnId, filterValue) =>
                row.original.class_year != null &&
                row.original.class_year._class.name.toLowerCase().includes(filterValue),
        },
        {
            accessorKey: "degree",
            header: ({ column }) => {
                return (
                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="justify-end p-0">
                            Ano
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const degree = parseFloat(row.getValue("degree"));

                return <div className="text-right font-medium">{degree ? degree : 0}</div>;
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
                                <Button
                                    aria-label="Editar estudante"
                                    className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:bg-slate-200 outline-none">
                                    <Pencil size={18} />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[720px]">
                                <DialogHeader>
                                    <DialogTitle>Editar estudante</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <StudentFormEdit
                                        onSubmit={async (student) => {
                                            student = deleteUndefinedKeys(student);
                                            if (student.birth_date) {
                                                student.birth_date = formatDate(new Date(student.birth_date));
                                            }

                                            const form = new FormData();
                                            for (var key in student) {
                                                if (key == "image") {
                                                    if (student[key].length > 0) {
                                                        const image = student[key][0];
                                                        form.append(key, image);
                                                    }
                                                } else if (typeof student[key] === "object") {
                                                    form.append(key, JSON.stringify(student[key]));
                                                } else {
                                                    form.append(key, student[key]);
                                                }
                                            }

                                            const res = await putRequest(
                                                `student/${row.original.id}/`,
                                                form,
                                                false,
                                                false
                                            );
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Estudante editado com sucesso",
                                                });
                                                changeStateOnEdit(students, setStudents, row, student);
                                                // setStudents(
                                                //     students.map((studentObj) =>
                                                //         studentObj.id !== row.original.id
                                                //             ? studentObj
                                                //             : mergeObjs(studentObj, student)
                                                //     )
                                                // );
                                            } else {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Não foi possível editar informações do estudante",
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
                                    aria-label="Remover estudante"
                                    className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:text-white hover:bg-red-600 outline-none">
                                    <Trash2 size={18} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem certeza que deseja remover um estudante?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Os dados serão permanentemente deletados.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-800"
                                        onClick={async () => {
                                            const res = await deleteRequest(`student/${row.original.id}/`);
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Estudante removido com sucesso",
                                                });
                                                setStudents(
                                                    students.filter((studentObj) => studentObj.id !== row.original.id)
                                                );
                                            } else {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Não foi possível remover estudante",
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

function EstudantesPageAdmin() {
    const [students, setStudents] = useState([]);
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
    const columns = getColumns(students, setStudents);
    const studentsTable = useReactTable({
        columns,
        data: students,
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
            const response = await getRequest("class_year/");
            const data = await response.json();
            setClasses(data.class_years);
        };

        const fetchStudents = async () => {
            const response = await getRequest("student/");
            const data = await response.json();
            setStudents(data.students);
            setLoading(false);
        };

        fetchClasses();
        fetchStudents();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="h-full">
            <h1 className="text-4xl text-blue-600 font-bold">Estudantes</h1>
            <CustomDataTable table={studentsTable} pagination>
                <StudentController
                    table={studentsTable}
                    classes={classes}
                    addStudent={(student) => setStudents([...students, student])}
                    newStudentButton
                    attachClassButton
                />
            </CustomDataTable>
        </div>
    );
}

export default EstudantesPageAdmin;
