import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { containsArray, MAX_TIMESCHEDULES, mergeLists, SHIFT_AFTERNOON, SHIFT_MORNING } from "@/lib/utils";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useContext, useEffect, useState } from "react";
import Spinner from "../Spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import CustomTimeScheduleDataTable from "./timeSchedule-data-table";

function getColumns(state, setState, classYearTeacherSubjects) {
    const columns = [
        {
            accessorKey: "hour",
            header: ({ column }) => <div className="capitalize text-center">Hora</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center text-xs md:text-sm">
                    {row.original.hour.toString() +
                        "h" +
                        (row.original.minute.toString() == "0" ? "" : row.original.minute.toString())}
                </div>
            ),
        },
        {
            accessorKey: "monday_class_year_teacher_subject",
            header: ({ column }) => <div className="capitalize text-center">Segunda</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    {row.original.monday_class_year_teacher_subject != null ? (
                        <div className="flex flex-col">
                            <div>{row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name}</div>
                            <div className="text-[10px] md:text-xs text-black/70">
                                {row.original.class_year?._class.name}
                            </div>
                        </div>
                    ) : (
                        // row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name ?? "-"
                        "-"
                    )}
                </div>
            ),
        },
        {
            accessorKey: "tuesday_class_year_teacher_subject",
            header: ({ column }) => <div className="capitalize text-center">Terça</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    {row.original.tuesday_class_year_teacher_subject != null ? (
                        <div className="flex flex-col">
                            <div>{row.original.tuesday_class_year_teacher_subject?.teacher_subject.subject.name}</div>
                            <div className="text-xs text-black/70">{row.original.class_year?._class.name}</div>
                        </div>
                    ) : (
                        // row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name ?? "-"
                        "-"
                    )}
                </div>
            ),
        },
        {
            accessorKey: "wednesday_class_year_teacher_subject",
            header: ({ column }) => <div className="capitalize text-center">Quarta</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    {row.original.wednesday_class_year_teacher_subject != null ? (
                        <div className="flex flex-col">
                            <div>{row.original.wednesday_class_year_teacher_subject?.teacher_subject.subject.name}</div>
                            <div className="text-xs text-black/70">{row.original.class_year?._class.name}</div>
                        </div>
                    ) : (
                        // row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name ?? "-"
                        "-"
                    )}
                </div>
            ),
        },
        {
            accessorKey: "thursday_class_year_teacher_subject",
            header: ({ column }) => <div className="capitalize text-center">Quinta</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    {row.original.thursday_class_year_teacher_subject != null ? (
                        <div className="flex flex-col">
                            <div>{row.original.thursday_class_year_teacher_subject?.teacher_subject.subject.name}</div>
                            <div className="text-xs text-black/70">{row.original.class_year?._class.name}</div>
                        </div>
                    ) : (
                        // row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name ?? "-"
                        "-"
                    )}
                </div>
            ),
        },
        {
            accessorKey: "friday_class_year_teacher_subject",
            header: ({ column }) => <div className="capitalize text-center">Sexta</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    {row.original.friday_class_year_teacher_subject != null ? (
                        <div className="flex flex-col">
                            <div>{row.original.friday_class_year_teacher_subject?.teacher_subject.subject.name}</div>
                            <div className="text-xs text-black/70">{row.original.class_year?._class.name}</div>
                        </div>
                    ) : (
                        // row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name ?? "-"
                        "-"
                    )}
                </div>
            ),
        },
    ];

    return columns;
}

function TimeScheduleViewTeacher({ id }) {
    const [timeSchedules, setTimeSchedules] = useState([]);
    const [timeSchedulesMorning, setTimeSchedulesMorning] = useState([]);
    const [timeSchedulesAfternoon, setTimeSchedulesAfternoon] = useState([]);

    const [classYears, setClassYears] = useState([]);
    const [classYearTeacherSubjects, setClassYearTeacherSubjects] = useState(null);
    const [selectedClassYear, setSelectedClassYear] = useState({});
    const [defaultTimeSchedule, setDefaultTimeSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [teacherSubjectsAlreadyTaken, setTeacherSubjectsAlreadyTaken] = useState(ALREADY_TAKEN)

    const { toast } = useToast();
    const { postRequest, getRequest } = useContext(AuthContext);

    const columns = getColumns(timeSchedules, setTimeSchedules, classYearTeacherSubjects);
    const timeScheduleTable = useReactTable({
        columns: columns,
        data: timeSchedules,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    useEffect(() => {
    const defaultTimeScheduleTemp = Array.from({ length: MAX_TIMESCHEDULES }, () => ({})).map((item, index) => {
            item.hour = SHIFT_MORNING[index][0];
            item.minute = SHIFT_MORNING[index][1];
            item.monday_class_year_teacher_subject = null;
            item.tuesday_class_year_teacher_subject = null;
            item.wednesday_class_year_teacher_subject = null;
            item.thursday_class_year_teacher_subject = null;
            item.friday_class_year_teacher_subject = null;
            item.class_year = null;
            return item;
        });

        const fetchTimeSchedules = async () => {
            const res = await getRequest(`teacher/${id}/time_schedule/`);
            const data = await res.json();
            const accMorning = [];
            const accAfternoon = [];

            for (const timeSchedule of data.time_schedules) {
                if (containsArray(SHIFT_MORNING, [timeSchedule.hour, timeSchedule.minute])) {
                    accMorning.push(timeSchedule);
                } else {
                    accAfternoon.push(timeSchedule);
                }
            }

            const timeSchedulesMorningTemp = mergeLists(
                defaultTimeScheduleTemp,
                accMorning,
                (item_first_list, item_second_list) =>
                    item_first_list.hour == item_second_list.hour && item_first_list.minute == item_second_list.minute
            );
            setTimeSchedulesMorning(timeSchedulesMorningTemp);

            const defaultTimeScheduleTempAfternoon = defaultTimeScheduleTemp.map((item, index) => {
            return { ...item, hour: SHIFT_AFTERNOON[index][0], minute: SHIFT_AFTERNOON[index][1] };
            });
            setTimeSchedulesAfternoon(
                mergeLists(
                    defaultTimeScheduleTempAfternoon,
                    accAfternoon,
                    (item_first_list, item_second_list) =>
                        item_first_list.hour == item_second_list.hour &&
                        item_first_list.minute == item_second_list.minute
                )
            );

            setTimeSchedules(timeSchedulesMorningTemp);
            setLoading(false);
        };

        setTimeSchedules(defaultTimeScheduleTemp);
        setDefaultTimeSchedule(defaultTimeScheduleTemp);
        fetchTimeSchedules();
    }, []);

    function onSelectShift(shift) {
        if (shift == "MORNING") {
            setTimeSchedules(timeSchedulesMorning);
        } else {
            setTimeSchedules(timeSchedulesAfternoon);
        }
    }

    if (loading) return <Spinner />;

    return (
        <>
            <div className="flex gap-5 w-fit my-5">
                <Select onValueChange={(value) => onSelectShift(value, defaultTimeSchedule)} defaultValue="MORNING">
                    <SelectTrigger className="text-muted-foreground" aria-label="Seleciona um turno">
                        <SelectValue placeholder="Selecione um turno" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MORNING">Manhã</SelectItem>
                        <SelectItem value="AFTERNOON">Tarde</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-center items-center w-full">
                <div className="w-4/5 md:w-4/5">
                    <CustomTimeScheduleDataTable table={timeScheduleTable} />
                </div>
            </div>
        </>
    );
}

export default TimeScheduleViewTeacher;
