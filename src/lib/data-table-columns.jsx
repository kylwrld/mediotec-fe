import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function getGradeColumnsTeacher(grades, setGrades) {
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

// export function getGradeColumnsAdmin()
export const gradeColumnsAdmin = [
    {
        accessorKey: "teacher_subject",
        header: "Disciplina",
        cell: ({ row }) => <div className="capitalize text-left">{row.original.teacher_subject.subject.name}</div>,
    },
    {
        accessorKey: "av1_1",
        header: "AV1",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av1_1 || "-"}</div>,
    },
    {
        accessorKey: "av2_1",
        header: "AV2",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av2_1 || "-"}</div>,
    },
    {
        accessorKey: "mu_1",
        header: "Menção da Unidade",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.mu_1 || "-"}</div>,
    },
    {
        accessorKey: "noa_1",
        header: "NOA",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.noa_1 || "-"}</div>,
    },
    {
        accessorKey: "cf_1",
        header: "Conceito Final",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.cf_1 || "-"}</div>,
    },

    {
        accessorKey: "av1_2",
        header: "AV1",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av1_2 || "-"}</div>,
    },
    {
        accessorKey: "av2_2",
        header: "AV2",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av2_2 || "-"}</div>,
    },
    {
        accessorKey: "mu_2",
        header: "Menção da Unidade",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.mu_2 || "-"}</div>,
    },
    {
        accessorKey: "noa_2",
        header: "NOA",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.noa_2 || "-"}</div>,
    },
    {
        accessorKey: "cf_2",
        header: "Conceito Final",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.cf_2 || "-"}</div>,
    },

    {
        accessorKey: "av1_3",
        header: "AV1",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av1_3 || "-"}</div>,
    },
    {
        accessorKey: "av2_3",
        header: "AV2",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.av2_3 || "-"}</div>,
    },
    {
        accessorKey: "mu_3",
        header: "Menção da Unidade",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.mu_3 || "-"}</div>,
    },
    {
        accessorKey: "noa_3",
        header: "NOA",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.noa_3 || "-"}</div>,
    },
    {
        accessorKey: "cf_3",
        header: "Conceito Final",
        cell: ({ row }) => <div className="capitalize text-center">{row.original.cf_3 || "-"}</div>,
    },
];
