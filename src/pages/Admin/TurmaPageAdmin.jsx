import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import Spinner from "@/components/Spinner";
import GradeViewAdmin from "@/components/grade/grade-view-admin";
import StudentControllerClass from "@/components/student/student-controller-class";
import { Button } from "@/components/ui/button";
import CustomDataTable from "@/components/ui/custom-data-table";
import AuthContext from "@/context/AuthContext";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Dot, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

function getColumns(state, setState, class_id, year) {
    const { deleteRequest } = useContext(AuthContext)

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Seleciona todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Seleciona linha"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0">
                        Nome
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={row.original.image} />
                        <AvatarFallback>
                            <img src="https://tiermaker.com/images/media/avatars-2024/jvilla699/jvilla699.jpg?1721389851" />
                        </AvatarFallback>
                    </Avatar>
                    {row.getValue("name")}
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "degree",
            header: ({ column }) => {
                return (
                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="justify-end p-0">
                            Ano
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const degree = parseFloat(row.getValue("degree"));

                return <div className="text-right font-medium">{degree ? degree : 0}</div>;
            },
            filterFn: "includesString",
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-end items-end gap-2">
                        {/* delete */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    aria-label="Remover estudante"
                                    className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:text-white hover:bg-red-600 outline-none">
                                    <Trash2 size={18} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem certeza que deseja remover o estudante dessa turma?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Os dados serão permanentemente deletados dessa turma.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-800"
                                        onClick={async () => {
                                            console.log("here")
                                            const res = await deleteRequest(`student_class/${class_id}/${year}/${row.original.id}/`);
                                            if (res.ok) {
                                                toast({
                                                    variant: "success",
                                                    title: "Estudante removido com sucesso",
                                                });
                                                setState(
                                                    state.filter((studentObj) => studentObj.id !== row.original.id)
                                                );
                                            } else {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Não foi possível remover estudante",
                                                });
                                            }
                                        }}>
                                        Remover
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
            },
        },
    ];

    return columns
}


function TurmaPageAdmin() {
    const [loading, setLoading] = useState(true);
    const [classYear, setClassYear] = useState();
    const [_class, setClass] = useState({});
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [classes, setClasses] = useState([]);
    const [nextClass, setNextClass] = useState()
    const [error, setError] = useState("")

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { id } = useParams();
    //
    const { getRequest, postRequest } = useContext(AuthContext);

    const fetchData = async (year) => {
        setLoading(true);
        const fetchClasses = async (classData) => {
            const response = await getRequest(`class/?degree=${classData.degree+1}`);
            const data = await response.json();
            setClasses(data.classes);
        };
        const fetchStudents = async () => {
            const response = await getRequest(`student_class/${id}/${year}/`);
            const data = await response.json();
            if (!response.ok) {
                setError(data.detail)
                setLoading(false)
            } else {
                setStudents(data.class_year?.students);
                setYears(data.years);
                setClass(data._class);
                setClassYear(data.class_year);
                return data.class_year
            }
        };
        const fetchSubjects = async (classYearData) => {
            // const response = await getRequest("subject/");
            const response = await getRequest(`class_year/${classYearData.id}/subjects/`);
            const data = await response.json();
            setSubjects(data.subjects);
        };

        // Use Promise.all
        const classYearData = await fetchStudents();
        await fetchSubjects(classYearData);

        // pass class id after fetchStudents
        await fetchClasses(classYearData._class);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(selectedYear);
    }, []);

    const columns = getColumns(students, setStudents, classYear?._class.id, selectedYear)
    const studentsTable = useReactTable({
        columns,
        data: students,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        // onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    async function attachClass(rows, class_id, year) {
        const data = {};
        data.student = rows.map((row) => row.original.id);
        data._class = class_id;

        if (data.student.length === 0) {
            toast({
                variant: "destructive",
                title: "Selecione no mínimo 1 estudante.",
                description: "Você não selecionou um estudante.",
            });
            return
        };

        const res = await postRequest(`student_class/${class_id}/${year}/`, data);

        if (res.ok) {
            toast({
                variant: "success",
                title: "Estudante(s) adicionado(s) a turma com sucesso.",
                description: "Os estudantes foram adicionados no proxímo ano.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Selecione no mínimo 1 estudante",
                // description: "Os estudantes não podem fazer parte da turma escolhida.",
            });
        }
    }

    if (loading) return <Spinner />;
    if (error) return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col justify-start text-left gap-3">
                <h1 className="text-4xl text-blue-600 font-bold">{error}</h1>
            </div>
        </div>
    )

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col justify-start text-left gap-3">
                <div className="flex items-end gap-3">
                    <h1 className="text-4xl text-blue-600 font-bold">{_class.name || "Não especificado"}</h1>
                    <Select
                        onValueChange={(value) => {
                            setSelectedYear(value);
                            fetchData(value);
                        }}>
                        <SelectTrigger
                            withoutIcon
                            aria-label="Selecionar ano da turma"
                            className="w-fit border-0 shadow-none justify-center p-0 h-fit text-blue-600 text-2xl">
                            <SelectValue placeholder={selectedYear} />
                        </SelectTrigger>
                        <SelectContent>
                            {years
                                ? years.map((year, index) => <SelectItem key={index} value={year}>{year}</SelectItem>)
                                : "Não especificado"}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-end w-full">
                    <h2 className="text-muted-foreground ml-[1.5px]">Turma</h2>
                    <Dot className="text-muted-foreground" />
                    <p className="text-muted-foreground">{_class.shift || "Não especificado"}</p>
                    <Dot className="text-muted-foreground" />
                    <p className="text-muted-foreground">{_class.type || "Não especificado"}</p>
                </div>
            </div>
            <div className="flex flex-col flex-1 mt-5">
                <Tabs defaultValue="students" className="flex flex-col flex-1">
                    <TabsList className="w-full">
                        <TabsTrigger value="students" className="w-full">
                            Estudantes
                        </TabsTrigger>

                        {students?.length > 0 ? (
                            <TabsTrigger value="grades" className="w-full">
                                Conceitos
                            </TabsTrigger>
                        ) : null}
                    </TabsList>

                    <TabsContent value="students">
                        <CustomDataTable table={studentsTable} pagination>
                            <StudentControllerClass
                                table={studentsTable}
                                addStudent={(student) => {
                                    student.degree = classYear._class?.degree;
                                    setStudents([...students, student]);
                                }}
                                newStudentButton
                            />
                        </CustomDataTable>

                        {_class.degree < 3 ? (
                            <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="bg-orange-600 text-white">
                                            Matricular estudantes em {new Date().getFullYear() + 1}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[720px]">
                                        <DialogHeader>
                                            <DialogTitle>Atribuir estudantes na próxima turma</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-3">
                                            <Select onValueChange={(value) => {
                                                setNextClass(value)
                                            }}>
                                                <SelectTrigger
                                                    // withoutIcon
                                                    aria-label="Selecionar turma para próximo ano"
                                                    // className="w-fit border-0 shadow-none justify-center bg-orange-600 text-white h-fit"
                                                    className="text-muted-foreground text-[10px] md:text-sm">
                                                    <SelectValue placeholder="Selecionar turma" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {classes
                                                        ? classes.map((_class) => (
                                                            <SelectItem value={_class.id}>{_class.name}</SelectItem>
                                                        ))
                                                        : "Nenhuma turma encontrada"}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => attachClass(
                                                    studentsTable.getSelectedRowModel().rows,
                                                    nextClass,
                                                    new Date().getFullYear() + 1
                                                )}>
                                                Enviar
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ) : null}
                    </TabsContent>

                    {students?.length > 0 ? (
                        <TabsContent value="grades" className="flex-1">
                            <GradeViewAdmin students={students} subjects={subjects} year={selectedYear} />
                        </TabsContent>
                    ) : null}
                </Tabs>
            </div>
        </div>
    );
}

export default TurmaPageAdmin;
