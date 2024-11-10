import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import StudentControllerClass from "@/components/student/student-controller-class";
import { Button } from "@/components/ui/button";
import CustomDataTable from "@/components/ui/custom-data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthContext from "@/context/AuthContext";
import { mergeLists } from "@/lib/utils";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Dot } from "lucide-react";
import Spinner from "@/components/Spinner";

const gradesColumns = [
    {
        accessorKey: "teacher_subject",
        header: "Disciplina",
        cell: ({ row }) => <div className="capitalize text-left">{row.original.teacher_subject.subject.name}</div>,
    },
    {
        accessorKey: "av1_1",
        header: "AV1",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av1_1 || "-"}</div>,
    },
    {
        accessorKey: "av2_1",
        header: "AV2",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av2_1 || "-"}</div>,
    },
    {
        accessorKey: "mu_1",
        header: "Menção da Unidade",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.mu_1 || "-"}</div>,
    },
    {
        accessorKey: "noa_1",
        header: "NOA",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.noa_1 || "-"}</div>,
    },
    {
        accessorKey: "cf_1",
        header: "Conceito Final",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.cf_1 || "-"}</div>,
    },

    {
        accessorKey: "av1_2",
        header: "AV1",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av1_2 || "-"}</div>,
    },
    {
        accessorKey: "av2_2",
        header: "AV2",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av2_2 || "-"}</div>,
    },
    {
        accessorKey: "mu_2",
        header: "Menção da Unidade",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.mu_2 || "-"}</div>,
    },
    {
        accessorKey: "noa_2",
        header: "NOA",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.noa_2 || "-"}</div>,
    },
    {
        accessorKey: "cf_2",
        header: "Conceito Final",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.cf_2 || "-"}</div>,
    },

    {
        accessorKey: "av1_3",
        header: "AV1",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av1_3 || "-"}</div>,
    },
    {
        accessorKey: "av2_3",
        header: "AV2",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av2_3 || "-"}</div>,
    },
    {
        accessorKey: "mu_3",
        header: "Menção da Unidade",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.mu_3 || "-"}</div>,
    },
    {
        accessorKey: "noa_3",
        header: "NOA",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.noa_3 || "-"}</div>,
    },
    {
        accessorKey: "cf_3",
        header: "Conceito Final",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.cf_3 || "-"}</div>,
    },
];

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
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
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
    const [grades, setGrades] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [defaultGrades, setDefaultGrades] = useState([]);
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
            const response = await getRequest(`http://192.168.1.9:8000/student_class/${id}/2024/`);
            const data = await response.json();
            setStudents(data.students);
            setSelectedStudent(data.students[0]?.id || null);
            setClassYear(data);
        };
        const fetchSubjects = async () => {
            const response = await getRequest("http://192.168.1.9:8000/subject/");
            const data = await response.json();
            const gradesList = data.subjects.map((subject) => {
                return {
                    teacher_subject: { subject: { name: subject.name } },
                    av1_1: null,
                    av2_1: null,
                    mu_1: null,
                    noa_1: null,
                    cf_1: null,
                    av1_2: null,
                    av2_2: null,
                    mu_2: null,
                    noa_2: null,
                    cf_2: null,
                    av1_3: null,
                    av2_3: null,
                    mu_3: null,
                    noa_3: null,
                    cf_3: null,
                };
            });
            setGrades(gradesList);
            setDefaultGrades(gradesList);
            setLoading(false)
        };

        fetchStudents();
        fetchSubjects();
    }, []);

    async function fetchGrades(student_id) {
        const response = await getRequest(`http://192.168.1.9:8000/grade/${student_id}/2024/`);
        const data = await response.json();
        setGrades(mergeLists(defaultGrades, data.grades, (item, first_list_item) => item.teacher_subject.subject.name === first_list_item.teacher_subject.subject.name));
    }

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

    const gradesTable = useReactTable({
        columns: gradesColumns,
        data: grades,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (loading) return <Spinner />

    return (
        <div className="h-full">
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
            <div className="mt-5">
                <Tabs defaultValue="students">
                    <TabsList className="w-full">
                        <TabsTrigger value="students" className="w-full">
                            Estudantes
                        </TabsTrigger>
                        <TabsTrigger value="grades" className="w-full" onClick={() => fetchGrades(selectedStudent)}>
                            Conceitos
                        </TabsTrigger>
                        {/* <TabsTrigger value="students3" className="w-full">
                            Estudantes
                        </TabsTrigger> */}
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

                    <TabsContent value="grades">
                        <div className="flex gap-5 w-fit my-5">
                            {/* {setSelectedStudent(value)} */}
                            <Select onValueChange={(value) => fetchGrades(value)} defaultValue={selectedStudent}>
                                <SelectTrigger className="text-muted-foreground">
                                    <SelectValue placeholder="Selecione um aluno" />
                                </SelectTrigger>

                                <SelectContent>
                                    {students ? (
                                        students.map((student) => (
                                            <SelectItem key={student.id} value={student.id}>
                                                {student.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <p className="text-sm p-2">Nenhum estudante encontrado.</p>
                                    )}
                                </SelectContent>
                            </Select>
                            {/* <Button onClick={() => fetchGrades(selectedStudent)}>Pesquisar conceito</Button> */}
                        </div>

                        <CustomDataTable table={gradesTable}></CustomDataTable>
                    </TabsContent>

                    {/* <TabsContent value="students3"></TabsContent> */}
                </Tabs>
            </div>
        </div>
    );
}

export default TurmaPageAdmin;
