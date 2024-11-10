import { useToast } from "@/hooks/use-toast";
import { useContext, useEffect, useState } from "react";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthContext from "@/context/AuthContext";
import { mergeLists } from "@/lib/utils";
import {
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import CustomDataTable from "../ui/custom-data-table";

function GradeView({ students, teacherSubjects, classYear }) {
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(students[0].id);
    const [grades, setGrades] = useState([]);

    const { getRequest, postRequest } = useContext(AuthContext);
    const { toast } = useToast();
    const gradesColumns = getGradeColumns(grades, setGrades);

    // setSelectedStudent(data.students[0].id ?? null);
    async function fetchGrades(student_id, grades) {
        const response = await getRequest(`grade/${student_id}/2024/`);
        const data = await response.json();

        // colocando as notas nas disciplinas certas
        setGrades(
            mergeLists(
                grades,
                data.grades,
                (item, first_list_item) =>
                    item.teacher_subject.subject.name === first_list_item.teacher_subject.subject.name
            )
        );
        setLoading(false);
    }
    useEffect(() => {
        const gradesList = teacherSubjects.map((obj) => {
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

        // TODO: students can be empty
        fetchGrades(students[0].id, gradesList);
    }, []);

    const gradesTable = useReactTable({
        columns: gradesColumns,
        data: grades,
        getCoreRowModel: getCoreRowModel(),
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

        const res = await postRequest("grade/", { grade: data });
        const dataObj = await res.json();
        if (res.ok) {
            toast({
                variant: "success",
                title: "Conceito atribuído com sucesso",
            });

            setGrades(
                mergeLists(
                    grades,
                    dataObj.grade,
                    (item, first_list_item) =>
                        item.teacher_subject.subject.name === first_list_item.teacher_subject.subject.name
                )
            );
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível atribuir o conceito",
            });
        }
    }

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex gap-5 w-fit my-5">
                <Select
                    onValueChange={(value) => {
                        fetchGrades(value, grades);
                        setSelectedStudent(value);
                    }}
                    defaultValue={selectedStudent}>
                    <SelectTrigger aria-label="Seleciona aluno" className="text-muted-foreground">
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
            <Button className="bg-orange-600 mt-4" onClick={() => submitGrades(grades)}>
                Salvar conceitos
            </Button>
        </div>
    );
}

export default GradeView;

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
            accessorKey: "cf_3",
            header: () => <div className="text-center">Conceito Final</div>,
            cell: ({ row }) => <div className="capitalize text-center">{row.original.cf_3 || "-"}</div>,
        },
    ];

    return gradesColumns;
}
