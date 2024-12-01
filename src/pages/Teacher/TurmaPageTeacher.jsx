import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AttendanceView from "@/components/attendance/attendance-view";
import GradeViewTeacher from "@/components/grade/grade-view-teacher";
import Spinner from "@/components/Spinner";
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
            <div className="capitalize flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={row.original.image} />
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

function TurmaPageTeacher() {
    const [loading, setLoading] = useState(true);
    const [classYear, setClassYear] = useState({});
    const [students, setStudents] = useState([]);
    const [teacherSubjects, setTeacherSubjects] = useState([]);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { id } = useParams();
    const { decodeToken, getRequest, postRequest } = useContext(AuthContext);
    const user = decodeToken();

    useEffect(() => {
        const fetchTeacherSubjects = async () => {
            // TODO: Change year variable to be dinamic
            // teacher all subjects from a class
            const response = await getRequest(`teacher/${id}/${new Date().getFullYear()}/${user.id}`);
            const data = await response.json();
            setTeacherSubjects(data.teacher_subject);
        };

        const fetchStudents = async () => {
            const response = await getRequest(`student_class/${id}/${new Date().getFullYear()}/`);
            const data = await response.json();
            setStudents(data.class_year?.students);
            setClassYear(data.class_year);
            setLoading(false);
        };

        fetchTeacherSubjects();
        fetchStudents();
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
                <h1 className="text-4xl text-blue-600 font-bold">{classYear?._class?.name || "Não encontrada"}</h1>
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
                            <>
                                <TabsTrigger value="grades" className="w-full">
                                    Conceitos
                                </TabsTrigger>
                                <TabsTrigger value="attendance" className="w-full">
                                    Presença
                                </TabsTrigger>
                            </>
                        ) : null}
                    </TabsList>

                    <TabsContent value="students">
                        <CustomDataTable table={studentsTable} pagination>
                            <StudentControllerClass table={studentsTable} />
                        </CustomDataTable>
                    </TabsContent>

                    {students?.length > 0 ? (
                        <>
                            <TabsContent value="grades" className="flex-1">
                                <GradeViewTeacher
                                    students={students}
                                    teacherSubjects={teacherSubjects}
                                    classYear={classYear}
                                />
                            </TabsContent>

                            <TabsContent value="attendance" className="flex-1">
                                <AttendanceView
                                    classYear={classYear}
                                    students={students}
                                    teacherSubjects={teacherSubjects}
                                />
                            </TabsContent>
                        </>
                    ) : null}
                </Tabs>
            </div>
        </div>
    );
}

export default TurmaPageTeacher;
