import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";

import GradeViewAdmin from "@/components/grade/grade-view-admin";
import StudentControllerClass from "@/components/student/student-controller-class";
import CustomDataTable from "@/components/ui/custom-data-table";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import Spinner from "@/components/Spinner";
import ClassViewTeacher from "@/components/class/class-view-teacher";
import { Dot } from "lucide-react";
import TimeScheduleViewTeacher from "@/components/timeSchedule/timeSchedule-view-teacher";

function ProfessorPageTeacher() {
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState({})

    const { id } = useParams();
    const { getRequest, decodeToken } = useContext(AuthContext)

    useEffect(() => {
        const fetchData = async () => {
            const response = await getRequest(`teacher/${id}/time_schedule/`)
            const teacherResponse = await getRequest(`teacher/${id}`)
            const data = await response.json()
            const teacherData = await teacherResponse.json()
            setTeacher(teacherData)
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) return <Spinner />;
    if (!teacher.name) return <div>Não encontrado</div>

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col justify-start text-left gap-3">
                <h1 className="text-4xl text-blue-600 font-bold">{teacher.name || "Não especificado"}</h1>
                <div className="flex items-end w-full">
                    {/* <h2 className="text-muted-foreground ml-[1.5px]">{user.name}</h2> */}
                    {/* <Dot className="text-muted-foreground" /> */}
                    {/* <p className="text-muted-foreground">{classYear?.year || "Não especificado"}</p>
                    <Dot className="text-muted-foreground" />
                    <p className="text-muted-foreground">{classYear?._class?.shift || "Não especificado"}</p>
                    <Dot className="text-muted-foreground" />
                    <p className="text-muted-foreground">{classYear?._class?.type || "Não especificado"}</p> */}
                </div>
            </div>
            <Tabs defaultValue="classes" className="flex flex-col flex-1">
                <TabsList className="w-full">
                    <TabsTrigger value="classes" className="w-full">
                        Turmas
                    </TabsTrigger>
                    <TabsTrigger value="time-schedule" className="w-full">
                        Horarios
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="classes" className="flex-1">
                    <ClassViewTeacher id={id} />
                </TabsContent>

                <TabsContent value="time-schedule" className="flex-1">
                    <TimeScheduleViewTeacher id={id} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ProfessorPageTeacher;
