import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import CustomDataTable from "@/components/ui/custom-data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudentControllerClass from "@/components/student/student-controller-class";
import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { mergeLists } from "@/lib/utils";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Dot } from "lucide-react";

function getGradeColumns(grades, setGrades) {
    const gradesColumns = [
        {
            accessorKey: "teacher_subject",
            header: () => <div className="capitalize text-left">Disciplina</div>,
            cell: ({ row }) => <div className="capitalize text-left">{row.original.teacher_subject.subject.name}</div>,
        },
        {
            accessorKey: "av1_1",
            header: () => <div className="capitalize text-center">AV1</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = grades.findIndex(
                                (obj) => obj.teacher_subject.subject.name == row.original.teacher_subject.subject.name
                            );
                            const data = grades[index];
                            data.av1_1 = value;
                            setGrades(grades);
                        }}>
                        <SelectTrigger className="text-[10px] md:text-sm border-0 shadow-none justify-center">
                            <SelectValue
                                placeholder={row.original.av1_1 ? row.original.av1_1 : "-"}
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value=" ">-</SelectItem>
                            <SelectItem value="NA">NA</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "av2_1",
            header: () => <div className="capitalize text-center">AV2</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = grades.findIndex(
                                (obj) => obj.teacher_subject.subject.name == row.original.teacher_subject.subject.name
                            );
                            const data = grades[index];
                            data.av2_1 = value;
                            setGrades(grades);
                        }}>
                        <SelectTrigger className="text-[10px] md:text-sm border-0 shadow-none justify-center">
                            <SelectValue
                                placeholder={row.original.av2_1 ? row.original.av2_1 : "-"}
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value=" ">-</SelectItem>
                            <SelectItem value="NA">NA</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "mu_1",
            header: () => <div className="text-center">Menção da Unidade</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.original.mu_1 || "-"}</div>,
        },
        {
            accessorKey: "noa_1",
            header: () => <div className="capitalize text-center">NOA</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = grades.findIndex(
                                (obj) => obj.teacher_subject.subject.name == row.original.teacher_subject.subject.name
                            );
                            const data = grades[index];
                            data.noa_1 = value;
                            setGrades(grades);
                        }}>
                        <SelectTrigger className="text-[10px] md:text-sm border-0 shadow-none justify-center">
                            <SelectValue
                                placeholder={row.original.noa_1 ? row.original.noa_1 : "-"}
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value={null}>-</SelectItem>
                            <SelectItem value="NA">NA</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "cf_1",
            header: () => <div className="text-center">Conceito Final</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.original.cf_1 || "-"}</div>,
        },

        {
            accessorKey: "av1_2",
            header: () => <div className="capitalize text-center">AV1</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = grades.findIndex(
                                (obj) => obj.teacher_subject.subject.name == row.original.teacher_subject.subject.name
                            );
                            const data = grades[index];
                            data.av1_2 = value;
                            setGrades(grades);
                        }}>
                        <SelectTrigger className="text-[10px] md:text-sm border-0 shadow-none justify-center">
                            <SelectValue
                                placeholder={row.original.av1_2 ? row.original.av1_2 : "-"}
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value=" ">-</SelectItem>
                            <SelectItem value="NA">NA</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "av2_2",
            header: () => <div className="capitalize text-center">AV2</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = grades.findIndex(
                                (obj) => obj.teacher_subject.subject.name == row.original.teacher_subject.subject.name
                            );
                            const data = grades[index];
                            data.av2_2 = value;
                            setGrades(grades);
                        }}>
                        <SelectTrigger className="text-[10px] md:text-sm border-0 shadow-none justify-center">
                            <SelectValue
                                placeholder={row.original.av2_2 ? row.original.av2_2 : "-"}
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value=" ">-</SelectItem>
                            <SelectItem value="NA">NA</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "mu_2",
            header: () => <div className="text-center">Menção da Unidade</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.original.mu_2 || "-"}</div>,
        },
        {
            accessorKey: "noa_2",
            header: () => <div className="capitalize text-center">NOA</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = grades.findIndex(
                                (obj) => obj.teacher_subject.subject.name == row.original.teacher_subject.subject.name
                            );
                            const data = grades[index];
                            data.noa_2 = value;
                            setGrades(grades);
                        }}>
                        <SelectTrigger className="text-[10px] md:text-sm border-0 shadow-none justify-center">
                            <SelectValue
                                placeholder={row.original.noa_2 ? row.original.noa_2 : "-"}
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value=" ">-</SelectItem>
                            <SelectItem value="NA">NA</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "cf_2",
            header: () => <div className="text-center">Conceito Final</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.original.cf_2 || "-"}</div>,
        },

        {
            accessorKey: "av1_3",
            header: () => <div className="capitalize text-center">AV1</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = grades.findIndex(
                                (obj) => obj.teacher_subject.subject.name == row.original.teacher_subject.subject.name
                            );
                            const data = grades[index];
                            data.av1_3 = value;
                            setGrades(grades);
                        }}>
                        <SelectTrigger className="text-[10px] md:text-sm border-0 shadow-none justify-center">
                            <SelectValue
                                placeholder={row.original.av1_3 ? row.original.av1_3 : "-"}
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value=" ">-</SelectItem>
                            <SelectItem value="NA">NA</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "av2_3",
            header: () => <div className="capitalize text-center">AV2</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = grades.findIndex(
                                (obj) => obj.teacher_subject.subject.name == row.original.teacher_subject.subject.name
                            );
                            const data = grades[index];
                            data.av2_3 = value;
                            setGrades(grades);
                        }}>
                        <SelectTrigger className="text-[10px] md:text-sm border-0 shadow-none justify-center">
                            <SelectValue
                                placeholder={row.original.av2_3 ? row.original.av2_3 : "-"}
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value=" ">-</SelectItem>
                            <SelectItem value="NA">NA</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "mu_3",
            header: () => <div className="text-center">Menção da Unidade</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.original.mu_3 || "-"}</div>,
        },
        {
            accessorKey: "noa_3",
            header: () => <div className="capitalize text-center">NOA</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = grades.findIndex(
                                (obj) => obj.teacher_subject.subject.name == row.original.teacher_subject.subject.name
                            );
                            const data = grades[index];
                            data.noa_3 = value;
                            setGrades(grades);
                        }}>
                        <SelectTrigger className="text-[10px] md:text-sm border-0 shadow-none justify-center">
                            <SelectValue
                                placeholder={row.original.noa_3 ? row.original.noa_3 : "-"}
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value=" ">-</SelectItem>
                            <SelectItem value="NA">NA</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "cf_3",
            header: () => <div className="text-center">Conceito Final</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.original.cf_3 || "-"}</div>,
        },
    ];

    return gradesColumns
}

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



function TurmaPageTeacher() {
    const { id } = useParams();
    const { postRequest } = useContext(AuthContext);

    const [classYear, setClassYear] = useState();
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [defaultGrades, setDefaultGrades] = useState([]);

    const { decodeToken, getRequest } = useContext(AuthContext);
    const user = decodeToken();
    const { toast } = useToast();

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const gradesColumns = getGradeColumns(grades, setGrades);

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await getRequest(`https://mediotec-be.onrender.com/student_class/${id}/2024/`);
            const data = await response.json();
            setStudents(data.students);
            setSelectedStudent(data.students[0]?.id || null);
            setClassYear(data);
        };
        const fetchSubjects = async () => {
            const response = await getRequest(`https://mediotec-be.onrender.com/teacher/${user.id}/subjects/`);
            const data = await response.json();
            const gradesList = data.teacher.map((obj) => {
                return {
                    teacher_subject: { id: obj.id, subject: { name: obj.subject.name } },
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
        };

        fetchStudents();
        fetchSubjects();
    }, []);

    async function fetchGrades(student_id) {
        const response = await getRequest(`https://mediotec-be.onrender.com/grade/${student_id}/2024/`);
        const data = await response.json();
        // colocando as notas nas disciplinas certas
        setGrades(mergeLists(defaultGrades, data.grades));
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

    async function submitGrades(grades) {
        const data = [];
        grades.map((grade) => {
            let { av1_1, av2_1, av1_2, av2_2, av1_3, av2_3, noa_1, noa_2, noa_3 } = grade;
            let teacher_subject = grade.teacher_subject.id;
            let student = selectedStudent;
            let year = classYear.year;
            let degree = classYear._class.degree;
            data.push({
                av1_1,
                av2_1,
                av1_2,
                av2_2,
                av1_3,
                av2_3,
                noa_1,
                noa_2,
                noa_3,
                teacher_subject,
                student,
                year,
                degree,
            });
        });

        const res = await postRequest("https://mediotec-be.onrender.com/grade/", { grade: data });
        const dataObj = await res.json()
        if (res.ok) {
            toast({
                variant: "success",
                title: "Conceito atribuído com sucesso",
            });

            setGrades(mergeLists(grades, dataObj.grade))
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível atribuir o conceito",
            });
        }
    }

    return (
        <div className="h-full">
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
            <div className="mt-5">
                <Tabs defaultValue="students">
                    <TabsList className="w-full">
                        <TabsTrigger value="students" className="w-full">
                            Estudantes
                        </TabsTrigger>
                        <TabsTrigger value="grades" className="w-full" onClick={() => fetchGrades(selectedStudent)}>
                            Conceitos
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="students">
                        {students?.length > 0 ? (
                            <CustomDataTable table={studentsTable}>
                                <StudentControllerClass table={studentsTable} />
                            </CustomDataTable>
                        ) : null}
                    </TabsContent>

                    <TabsContent value="grades">
                        <div className="flex gap-5 w-fit my-5">
                            <Select
                                onValueChange={(value) => {
                                    fetchGrades(value);
                                    setSelectedStudent(value);
                                }}
                                defaultValue={selectedStudent}>
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
                        </div>

                        <CustomDataTable table={gradesTable}></CustomDataTable>
                        <Button className="bg-orange-600" onClick={() => submitGrades(grades)}>
                            Salvar conceitos
                        </Button>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default TurmaPageTeacher;
