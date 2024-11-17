import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MAX_TIMESCHEDULES, mergeLists, SHIFT_AFTERNOON, SHIFT_MORNING } from "@/lib/utils";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useContext, useEffect, useState } from "react";
import Spinner from "../Spinner";
import { Button } from "../ui/button";
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
                    <Select
                        onValueChange={(value) => {
                            const index = state.findIndex(
                                (obj) => obj.hour == row.original.hour && obj.minute == row.original.minute
                            );
                            const data = state[index];
                            data.monday_class_year_teacher_subject = value;
                            setState(state);
                        }}>
                        <SelectTrigger
                            className="text-[10px] md:text-sm border-0 shadow-none justify-center p-0 h-fit"
                            withoutIcon
                            aria-label="Seleciona uma disciplina">
                            <SelectValue
                                placeholder={
                                    row.original.monday_class_year_teacher_subject != null ? (
                                        <div className="flex flex-col">
                                            <div>
                                                {
                                                    row.original.monday_class_year_teacher_subject?.teacher_subject
                                                        .subject.name
                                                }
                                            </div>
                                            <div className="text-[10px] md:text-xs text-black/70">
                                                {
                                                    row.original.monday_class_year_teacher_subject?.teacher_subject
                                                        .teacher.name
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        // row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name ?? "-"
                                        "-"
                                    )
                                }
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value={null}>-</SelectItem>
                            {classYearTeacherSubjects?.length > 0 ? (
                                classYearTeacherSubjects.map((classYearTeacherSubject) => (
                                    <SelectItem key={classYearTeacherSubject.id} value={classYearTeacherSubject}>
                                        <div className="flex flex-col">
                                            <div>{classYearTeacherSubject.teacher_subject.subject.name}</div>
                                            <div className="text-xs text-black/70">
                                                {classYearTeacherSubject.teacher_subject.teacher.name}
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <p className="text-sm p-2">Nenhuma disciplina encontrada.</p>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "tuesday_class_year_teacher_subject",
            header: ({ column }) => <div className="capitalize text-center">Terça</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = state.findIndex(
                                (obj) => obj.hour == row.original.hour && obj.minute == row.original.minute
                            );
                            const data = state[index];
                            data.tuesday_class_year_teacher_subject = value;
                            setState(state);
                        }}>
                        <SelectTrigger
                            className="text-[10px] md:text-sm border-0 shadow-none justify-center p-0 h-fit"
                            withoutIcon
                            aria-label="Seleciona uma disciplina">
                            <SelectValue
                                placeholder={
                                    row.original.tuesday_class_year_teacher_subject != null ? (
                                        <div className="flex flex-col">
                                            <div>
                                                {
                                                    row.original.tuesday_class_year_teacher_subject?.teacher_subject
                                                        .subject.name
                                                }
                                            </div>
                                            <div className="text-xs text-black/70">
                                                {
                                                    row.original.tuesday_class_year_teacher_subject?.teacher_subject
                                                        .teacher.name
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        // row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name ?? "-"
                                        "-"
                                    )
                                }
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value={null}>-</SelectItem>
                            {classYearTeacherSubjects?.length > 0 ? (
                                classYearTeacherSubjects.map((classYearTeacherSubject) => (
                                    <SelectItem key={classYearTeacherSubject.id} value={classYearTeacherSubject}>
                                        <div className="flex flex-col">
                                            <div>{classYearTeacherSubject.teacher_subject.subject.name}</div>
                                            <div className="text-xs text-black/70">
                                                {classYearTeacherSubject.teacher_subject.teacher.name}
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <p className="text-sm p-2">Nenhuma disciplina encontrada.</p>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "wednesday_class_year_teacher_subject",
            header: ({ column }) => <div className="capitalize text-center">Quarta</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = state.findIndex(
                                (obj) => obj.hour == row.original.hour && obj.minute == row.original.minute
                            );
                            const data = state[index];
                            data.wednesday_class_year_teacher_subject = value;
                            setState(state);
                        }}>
                        <SelectTrigger
                            className="text-[10px] md:text-sm border-0 shadow-none justify-center p-0 h-fit"
                            withoutIcon
                            aria-label="Seleciona uma disciplina">
                            <SelectValue
                                placeholder={
                                    row.original.wednesday_class_year_teacher_subject != null ? (
                                        <div className="flex flex-col">
                                            <div>
                                                {
                                                    row.original.wednesday_class_year_teacher_subject?.teacher_subject
                                                        .subject.name
                                                }
                                            </div>
                                            <div className="text-xs text-black/70">
                                                {
                                                    row.original.wednesday_class_year_teacher_subject?.teacher_subject
                                                        .teacher.name
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        // row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name ?? "-"
                                        "-"
                                    )
                                }
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value={null}>-</SelectItem>
                            {classYearTeacherSubjects ? (
                                classYearTeacherSubjects.map((classYearTeacherSubject) => (
                                    <SelectItem key={classYearTeacherSubject.id} value={classYearTeacherSubject}>
                                        <div className="flex flex-col">
                                            <div>{classYearTeacherSubject.teacher_subject.subject.name}</div>
                                            <div className="text-xs text-black/70">
                                                {classYearTeacherSubject.teacher_subject.teacher.name}
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <p className="text-sm p-2">Nenhuma disciplina encontrada.</p>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "thursday_class_year_teacher_subject",
            header: ({ column }) => <div className="capitalize text-center">Quinta</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = state.findIndex(
                                (obj) => obj.hour == row.original.hour && obj.minute == row.original.minute
                            );
                            const data = state[index];
                            data.thursday_class_year_teacher_subject = value;
                            setState(state);
                        }}>
                        <SelectTrigger
                            className="text-[10px] md:text-sm border-0 shadow-none justify-center p-0 h-fit"
                            withoutIcon
                            aria-label="Seleciona uma disciplina">
                            <SelectValue
                                placeholder={
                                    row.original.thursday_class_year_teacher_subject != null ? (
                                        <div className="flex flex-col">
                                            <div>
                                                {
                                                    row.original.thursday_class_year_teacher_subject?.teacher_subject
                                                        .subject.name
                                                }
                                            </div>
                                            <div className="text-xs text-black/70">
                                                {
                                                    row.original.thursday_class_year_teacher_subject?.teacher_subject
                                                        .teacher.name
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        // row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name ?? "-"
                                        "-"
                                    )
                                }
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value={null}>-</SelectItem>
                            {classYearTeacherSubjects?.length > 0 ? (
                                classYearTeacherSubjects.map((classYearTeacherSubject) => (
                                    <SelectItem key={classYearTeacherSubject.id} value={classYearTeacherSubject}>
                                        <div className="flex flex-col">
                                            <div>{classYearTeacherSubject.teacher_subject.subject.name}</div>
                                            <div className="text-xs text-black/70">
                                                {classYearTeacherSubject.teacher_subject.teacher.name}
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <p className="text-sm p-2">Nenhuma disciplina encontrada.</p>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
        {
            accessorKey: "friday_class_year_teacher_subject",
            header: ({ column }) => <div className="capitalize text-center">Sexta</div>,
            cell: ({ row }) => (
                <div className="capitalize text-center">
                    <Select
                        onValueChange={(value) => {
                            const index = state.findIndex(
                                (obj) => obj.hour == row.original.hour && obj.minute == row.original.minute
                            );
                            const data = state[index];
                            data.friday_class_year_teacher_subject = value;
                            setState(state);
                        }}>
                        <SelectTrigger
                            className="text-[10px] md:text-sm border-0 shadow-none justify-center p-0 h-fit"
                            withoutIcon
                            aria-label="Seleciona uma disciplina">
                            <SelectValue
                                placeholder={
                                    row.original.friday_class_year_teacher_subject != null ? (
                                        <div className="flex flex-col">
                                            <div>
                                                {
                                                    row.original.friday_class_year_teacher_subject?.teacher_subject
                                                        .subject.name
                                                }
                                            </div>
                                            <div className="text-xs text-black/70">
                                                {
                                                    row.original.friday_class_year_teacher_subject?.teacher_subject
                                                        .teacher.name
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        // row.original.monday_class_year_teacher_subject?.teacher_subject.subject.name ?? "-"
                                        "-"
                                    )
                                }
                                className="text-center"
                            />
                        </SelectTrigger>
                        <SelectContent className="flex justify-center items-center">
                            <SelectItem value={null}>-</SelectItem>
                            {classYearTeacherSubjects?.length > 0 ? (
                                classYearTeacherSubjects.map((classYearTeacherSubject) => (
                                    <SelectItem key={classYearTeacherSubject.id} value={classYearTeacherSubject}>
                                        <div className="flex flex-col">
                                            <div>{classYearTeacherSubject.teacher_subject.subject.name}</div>
                                            <div className="text-xs text-black/70">
                                                {classYearTeacherSubject.teacher_subject.teacher.name}
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <p className="text-sm p-2">Nenhuma disciplina encontrada.</p>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
    ];

    return columns;
}

function TimeScheduleView() {
    const [timeSchedules, setTimeSchedules] = useState([]);
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
        const fetchClassYears = async () => {
            const res = await getRequest(`class_year/`);
            const data = await res.json();
            setClassYears(data.class_years);

            // class_year can by empty
            setSelectedClassYear(data.class_years[0]);
            onSelectClassYear(data.class_years[0], defaultTimeScheduleTemp);
            // setLoading(false);
        };
        setTimeSchedules(defaultTimeScheduleTemp);
        setDefaultTimeSchedule(defaultTimeScheduleTemp);

        fetchClassYears();
    }, []);

    // fetch timeSchedule
    async function onSelectClassYear(classYear, defaultTimeSchedule) {
        setLoading(true);
        const res = await getRequest(`all_teacher_subject_class/${classYear.id}/`);
        const data = await res.json();
        const timeScheduleRequest = await getRequest(`time_schedule/?class_year=${classYear.id}`);
        const timeSchedulesData = await timeScheduleRequest.json();
        setSelectedClassYear(classYear);
        setClassYearTeacherSubjects(data.class_year_teacher_subjects);

        let newTimeSchedule = [];
        if (classYear._class.shift == "Tarde") {
            newTimeSchedule = defaultTimeSchedule.map((item, index) => {
                return { ...item, hour: SHIFT_AFTERNOON[index][0], minute: SHIFT_AFTERNOON[index][1] };
            });
            newTimeSchedule = mergeLists(
                newTimeSchedule,
                timeSchedulesData.time_schedules,
                (item_first_list, item_second_list) => {
                    return (
                        item_first_list.hour == item_second_list.hour &&
                        item_first_list.minute == item_second_list.minute
                    );
                }
            );
        } else {
            newTimeSchedule = mergeLists(
                defaultTimeSchedule,
                timeSchedulesData.time_schedules,
                (item_first_list, item_second_list) => {
                    return (
                        item_first_list.hour == item_second_list.hour &&
                        item_first_list.minute == item_second_list.minute
                    );
                }
            );
        }

        setTimeSchedules(
            mergeLists(newTimeSchedule, timeSchedulesData.time_schedules, (item_first_list, item_second_list) => {
                return (
                    item_first_list.hour == item_second_list.hour && item_first_list.minute == item_second_list.minute
                );
            })
        );
        setLoading(false);
    }

    async function onSubmit(time_schedules) {
        setLoading(true);
        time_schedules = time_schedules.map((item) => {
            return {
                id: item?.id,
                hour: item?.hour,
                minute: item?.minute,
                monday_class_year_teacher_subject: item.monday_class_year_teacher_subject?.id,
                tuesday_class_year_teacher_subject: item.tuesday_class_year_teacher_subject?.id,
                wednesday_class_year_teacher_subject: item.wednesday_class_year_teacher_subject?.id,
                thursday_class_year_teacher_subject: item.thursday_class_year_teacher_subject?.id,
                friday_class_year_teacher_subject: item.friday_class_year_teacher_subject?.id,
                class_year: selectedClassYear.id,
            };
        });

        const res = await postRequest(`time_schedule/`, { time_schedules });
        const data = await res.json();

        setTimeSchedules(
            mergeLists(timeSchedules, data.time_schedules, (item_first_list, item_second_list) => {
                return (
                    item_first_list.hour == item_second_list.hour && item_first_list.minute == item_second_list.minute
                );
            })
        );
        if (res.ok) {
            toast({
                variant: "success",
                title: data.detail,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível atribuir horário",
            });
        }
        setLoading(false);
    }

    if (loading) return <Spinner />;

    return (
        <>
            <div className="flex gap-5 w-fit my-5">
                <Select
                    onValueChange={(value) => onSelectClassYear(value, defaultTimeSchedule)}
                    defaultValue={selectedClassYear}>
                    <SelectTrigger className="text-muted-foreground" aria-label="Seleciona uma turma">
                        <SelectValue placeholder="Selecione uma turma" />
                    </SelectTrigger>

                    <SelectContent>
                        {classYears ? (
                            classYears.map((classYear, index) => (
                                <SelectItem key={index} value={classYear}>
                                    {classYear._class.name}
                                </SelectItem>
                            ))
                        ) : (
                            <p className="text-sm p-2">Nenhuma disciplina encontrada.</p>
                        )}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-center items-center w-full">
                <div className="w-4/5 md:w-4/5">
                    <CustomTimeScheduleDataTable table={timeScheduleTable} />
                    <Button className="bg-orange-600 mt-4" onClick={() => onSubmit(timeSchedules)}>
                        Salvar horário
                    </Button>
                </div>
            </div>
        </>
    );
}

export default TimeScheduleView;
