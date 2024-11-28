import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Spinner from "@/components/Spinner";
import GradeViewAdmin from "@/components/grade/grade-view-admin";
import StudentControllerClass from "@/components/student/student-controller-class";
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
import { ArrowUpDown, Dot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
];

function TurmaPageAdmin() {
    const [loading, setLoading] = useState(true);
    const [classYear, setClassYear] = useState();
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
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

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await getRequest(`student_class/${id}/2024/`);
            const data = await response.json();
            setStudents(data.students);
            setSelectedStudent(data.students[0]?.id || null);
            setClassYear(data);
        };
        const fetchSubjects = async () => {
            const response = await getRequest("subject/");
            const data = await response.json();
            setSubjects(data.subjects);
            setLoading(false);
        };

        fetchStudents();
        fetchSubjects();
    }, []);

    const studentsTable = useReactTable({
        columns,
        data: students,
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
        <div className="h-full flex flex-col">
            <div className="flex flex-col justify-start text-left gap-3">
                <h1 className="text-4xl text-blue-600 font-bold">{classYear?._class?.name || "Não especificado"}</h1>
                <div className="flex items-end w-full">
                    <h2 className="text-muted-foreground ml-[1.5px]">Turma</h2>
                    <Dot className="text-muted-foreground" />
                    <p className="text-muted-foreground">{classYear?.year || "Não especificado"}</p>
                    <Dot className="text-muted-foreground" />
                    <p className="text-muted-foreground">{classYear?._class?.shift || "Não especificado"}</p>
                    <Dot className="text-muted-foreground" />
                    <p className="text-muted-foreground">{classYear?._class?.type || "Não especificado"}</p>
                </div>
            </div>
            <div className="flex flex-col flex-1 mt-5">
                <Tabs defaultValue="students" className="flex flex-col flex-1">
                    <TabsList className="w-full">
                        <TabsTrigger value="students" className="w-full">
                            Estudantes
                        </TabsTrigger>

                        {students?.length > 0 ? (
                            <TabsTrigger value="grades" className="w-full">
                                Conceitos
                            </TabsTrigger>
                        ) : null}
                    </TabsList>

                    <TabsContent value="students">
                        {students?.length > 0 ? (
                            <CustomDataTable table={studentsTable} pagination>
                                <StudentControllerClass
                                    table={studentsTable}
                                    addStudent={(student) => {
                                        student.degree = classYear._class?.degree;
                                        setStudents([...students, student]);
                                    }}
                                    newStudentButton
                                />
                            </CustomDataTable>
                        ) : null}
                    </TabsContent>

                    {students?.length > 0 ? (
                        <TabsContent value="grades" className="flex-1">
                            <GradeViewAdmin students={students} subjects={subjects} />
                        </TabsContent>
                    ) : null}

                </Tabs>
            </div>
        </div>
    );
}

export default TurmaPageAdmin;
