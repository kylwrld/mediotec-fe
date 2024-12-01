import { toast } from "@/hooks/use-toast";
import { useContext, useEffect, useState } from "react";

import Spinner from "@/components/Spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthContext from "@/context/AuthContext";
import { mergeLists } from "@/lib/utils";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import CustomDataTable from "../ui/custom-data-table";
import { gradeColumnsAdmin } from "@/lib/data-table-columns";

function GradeViewAdmin({ students, subjects, year }) {
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(students[0].id);
    const [defaultGrades, setDefaultGrades] = useState([]);
    const [grades, setGrades] = useState([]);

    const { getRequest } = useContext(AuthContext);

    async function fetchGrades(student_id, grades) {
        const response = await getRequest(`grade/${student_id}/${year}/`);
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
        const gradesList = subjects.map((subject) => {
            return {
                teacher_subject: { id: subject.id, subject: { name: subject.name } },
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
        setDefaultGrades(gradesList);

        // TODO: students can be empty
        fetchGrades(students[0].id, gradesList);
    }, []);

    const gradesTable = useReactTable({
        columns: gradeColumnsAdmin,
        data: grades,
        getCoreRowModel: getCoreRowModel(),
    });

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
        </div>
    );
}

export default GradeViewAdmin;
