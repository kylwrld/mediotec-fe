import StudentsDataTable from "@/components/ui/student/student-data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { columns } from "./EstudantesPage";

import StudentControllerClass from "@/components/ui/student/student-controller-class";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import GradeDataTable from "@/components/ui/grade/grade-data-table";

const LOOKUP = {
    NANA: "ND",
    NAPA: "ND",
    PANA: "ND",
    NAA: "ND",
    ANA: "ND",
    PAPA: "D",
    PAA: "D",
    APA: "D",
    AA: "D",
};

export const gradesColumns = [
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

function TurmaPage() {
    const { id } = useParams();
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch(`http://127.0.0.1:8000/student_class/${id}/2024/`);
            const data = await response.json();
            setStudents(data.students);
        };
        const fetchSubjects = async () => {
            const response = await fetch("http://127.0.0.1:8000/subject/");
            const data = await response.json();
            setGrades(
                data.subjects.map((subject) => {
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
                })
            );
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

    return (
        <div className="h-full">
            <div className="flex flex-col justify-start text-left gap-3">
                <h1 className="text-4xl text-blue-600 font-bold">Turma {id}</h1>
                <h2 className="text-muted-foreground ml-[1.5px]">Turma</h2>
            </div>
            <div className="mt-5">
                <Tabs defaultValue="students">
                    <TabsList className="w-full">
                        <TabsTrigger value="students" className="w-full">
                            Estudantes
                        </TabsTrigger>
                        <TabsTrigger value="grades" className="w-full">
                            Conceitos
                        </TabsTrigger>
                        {/* <TabsTrigger value="students3" className="w-full">
                            Estudantes
                        </TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="students">
                        {students.length > 0 ? (
                            <StudentsDataTable
                                table={studentsTable}
                                controller={<StudentControllerClass table={studentsTable} />}></StudentsDataTable>
                        ) : null}
                    </TabsContent>

                    <TabsContent value="grades">
                        <GradeDataTable table={gradesTable}></GradeDataTable>
                    </TabsContent>

                    {/* <TabsContent value="students3"></TabsContent> */}
                </Tabs>
            </div>
        </div>
    );
}

export default TurmaPage;
