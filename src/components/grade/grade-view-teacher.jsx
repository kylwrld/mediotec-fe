import { toast } from "@/hooks/use-toast";
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
import { getGradeColumnsTeacher } from "@/lib/data-table-columns";

function GradeViewTeacher({ columnsFunction, students, teacherSubjects, classYear }) {
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(students[0].id);
    const [defaultGrades, setDefaultGrades] = useState([])
    const [grades, setGrades] = useState([]);

    const { getRequest, postRequest } = useContext(AuthContext);

    const gradesColumns = getGradeColumnsTeacher(grades, setGrades);

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
        setDefaultGrades(gradesList)

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
                        fetchGrades(value, defaultGrades);
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

export default GradeViewTeacher;
