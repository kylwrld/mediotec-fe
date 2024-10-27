import React, { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { formatDate, mergeLists } from "@/lib/utils";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomDataTable from "../ui/custom-data-table";
import { ArrowUpDown } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

function getColumns(state, setState) {
    const columns = [
        {
            accessorKey: "name",
            header: ({ column }) => <div className="capitalize text-left">Nome</div>,
            cell: ({ row }) => <div className="capitalize">{row.original.student.name}</div>,
        },
        {
            accessorKey: "off",
            header: () => <div className="capitalize text-center">Falta</div>,
            cell: ({ row }) => {
                const isPresent = row.original.type == "PRESENTE"
                return (
                    <div className="capitalize text-center">
                    <Button className={`w-[150px] ${isPresent ? "bg-transparent shadow-none" : "bg-orange-600"}`}
                    onClick={() => {
                        const newState = state.map((value) => {
                            if (value.student.id == row.original.student.id) {
                                value.type = "FALTA"
                            }
                            return value
                        })
                        setState(newState)
                    }}></Button>
                </div>
            )
            }
        },
        {
            accessorKey: "on",
            header: () => <div className="capitalize text-center">Presente</div>,
            cell: ({ row }) => {
                const isPresent = row.original.type == "PRESENTE"
                return (
                <div className="capitalize text-center">
                    <Button className={`w-[150px] ${isPresent ? "bg-orange-600" : "bg-transparent  shadow-none"}`}
                    onClick={() => {
                        const newState = state.map((value) => {
                            if (value.student.id == row.original.student.id) {
                                value.type = "PRESENTE"
                            }
                            return value
                        })
                        setState(newState)
                    }}
                    ></Button>
                </div>
            )
            }
        }
    ]

    return columns
}

function AttendanceView({ classYear, students, teacherSubjects }) {
    const [selectedTeacherSubject, setSelectedTeacherSubject] = useState(teacherSubjects[0].id);
    const [attendances, setAttendances] = useState([]);
    const [defaultAttendances, setDefaultAttendances] = useState([]);

    const { toast } = useToast();
    const { postRequest, getRequest } = useContext(AuthContext);

    const columns = getColumns(attendances, setAttendances)

    useEffect(() => {
        const date = formatDate(new Date());
        const fetchAttendances = async () => {
            const res = await getRequest(`https://mediotec-fe.onrender.com/attendance/${classYear._class.id}/${selectedTeacherSubject}/?date=${date}`)
            const data = await res.json()
            const attendanceList = students.map((student) => {
                return {
                    student: {id: student.id, name:student.name},
                    type: "PRESENTE",
                }
            });

            setAttendances(mergeLists(attendanceList, data.attendances, (item, first_list_item) => item.student.id === first_list_item.student.id))
            setDefaultAttendances(attendanceList);
        }
        fetchAttendances()

    }, [])

    const attendanceTable = useReactTable({
        columns: columns,
        data: attendances,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    async function onSubmit(attendances) {
        const attendancesData = {attendances, class_year: classYear.id, teacher_subject: selectedTeacherSubject}
        const res = await postRequest("https://mediotec-fe.onrender.com/attendance/", attendancesData)
        const data = await res.json()
        if (res.ok) {
            toast({
                variant: "success",
                title: "Presenças atribuídas com sucesso",
                description: `Você ainda tem ${data.remaining} minutos para editar`
            });
        } else {
            toast({
                variant: "destructive",
                title: data.detail,
                description: "Você tem apenas 15 minutos após uma atribuição."
            });
        }

    }

    return (
        <>
            <div className="flex gap-5 w-fit my-5">
            <Select
                onValueChange={(value) => {
                    setSelectedTeacherSubject(value);
                }}
                defaultValue={selectedTeacherSubject}>
                <SelectTrigger className="text-muted-foreground">
                    <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>

                <SelectContent>
                    {teacherSubjects ? (
                        teacherSubjects.map((teacherSubject) => (
                            <SelectItem key={teacherSubject.id} value={teacherSubject.id}>
                                {teacherSubject.subject.name}
                            </SelectItem>
                        ))
                    ) : (
                        <p className="text-sm p-2">Nenhuma disciplina encontrada.</p>
                    )}
                </SelectContent>
            </Select>
            </div>
            <div className="flex justify-center items-center w-full">
                <div className="w-4/5 md:w-3/5">
                    <CustomDataTable table={attendanceTable}></CustomDataTable>
                    <Button className="bg-orange-600" onClick={() => onSubmit(attendances)}>
                        Salvar presença
                    </Button>
                </div>
            </div>
        </>
    );
}

export default AttendanceView;
