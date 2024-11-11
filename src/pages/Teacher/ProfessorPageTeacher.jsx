import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";

import GradeViewAdmin from "@/components/grade/grade-view-admin";
import StudentControllerClass from "@/components/student/student-controller-class";
import CustomDataTable from "@/components/ui/custom-data-table";
import { useEffect, useState } from "react";

function ProfessorPageTeacher() {
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {

        }

    }, [])

    return (
        <div className="h-full">
            <div className="flex flex-col justify-start text-left gap-3">
                {/* <h1 className="text-4xl text-blue-600 font-bold">{classYear?._class?.name || "Não especificado"}</h1> */}
                <div className="flex items-end w-full">
                    {/* <h2 className="text-muted-foreground ml-[1.5px]">Turma</h2>
                <Dot className="text-muted-foreground" />
                <p className="text-muted-foreground">{classYear?.year || "Não especificado"}</p>
                <Dot className="text-muted-foreground" />
                <p className="text-muted-foreground">{classYear?._class?.shift || "Não especificado"}</p>
                <Dot className="text-muted-foreground" />
                <p className="text-muted-foreground">{classYear?._class?.type || "Não especificado"}</p> */}
                </div>
            </div>
            <Tabs defaultValue="students" className="flex flex-col flex-1">
                <TabsList className="w-full">
                    <TabsTrigger value="turmas" className="w-full">
                        Turmas
                    </TabsTrigger>
                    <TabsTrigger value="horarios" className="w-full" onClick={() => fetchGrades(selectedStudent)}>
                        Horarios
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="turmas">

                </TabsContent>

                <TabsContent value="horarios" className="flex-1">

                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ProfessorPageTeacher;
