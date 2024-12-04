import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigate, useParams } from "react-router-dom";
import Spinner from "@/components/Spinner";
import ClassViewTeacher from "@/components/class/class-view-teacher";
import TimeScheduleViewTeacher from "@/components/timeSchedule/timeSchedule-view-teacher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthContext from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import SubjectView from "@/components/subject/subject-view";

function ProfessorPageTeacher() {
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState({})
    const { id } = useParams();
    const { getRequest, decodeToken } = useContext(AuthContext)
    const user = decodeToken();

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
    if (user.id != id) return <Navigate to="/estudantes" />
    if (!teacher.name) return <div>Não encontrado</div>

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col justify-start text-left gap-3">
                <div className="flex flex-row items-center gap-4 w-full">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={teacher.image} />
                        <AvatarFallback>
                            <img src="https://tiermaker.com/images/media/avatars-2024/jvilla699/jvilla699.jpg?1721389851"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h1 className="text-4xl text-blue-600 font-bold">{teacher.name || "Não especificado"}</h1>
                        <h1 className="text-md text-slate-400 font-bold">{teacher.email || "Não especificado"}</h1>
                    </div>
                </div>
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
                        Horários
                    </TabsTrigger>

                    <TabsTrigger value="subjects" className="w-full">
                        Disciplinas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="classes" className="flex-1">
                    <ClassViewTeacher id={id} />
                </TabsContent>

                <TabsContent value="time-schedule" className="flex-1">
                    <TimeScheduleViewTeacher id={id} />
                </TabsContent>

                <TabsContent value="subjects" className="flex-1">
                    <SubjectView />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ProfessorPageTeacher;
