import AuthContext from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import CustomDataTable from "@/components/ui/custom-data-table";
import TeacherController from "@/components/teacher/teacher-controller";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/Spinner";

function getColumns(state, setState) {
    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    aria-label="Seleciona todos"
                />
            ),
            cell: ({ row, table }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        const rowsModel = table.getSelectedRowModel();
                        if (rowsModel.rows.length > 0) {
                            const s_row = rowsModel.rows[0];
                            s_row.toggleSelected(false);
                            row.toggleSelected(!!value);
                        } else {
                            row.toggleSelected(!!value);
                        }
                    }}
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
                        className="p-0"
                        aria-label="Ordena por nome">
                        Nome
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },
    ];

    return columns
}


function DisciplinaPageAdmin() {
    const { id } = useParams();
    const [subject, setSubject] = useState({});
    // const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { getRequest } = useContext(AuthContext);


    useEffect(() => {
        const fetchSubject = async () => {
            const response = await getRequest(`subject/${id}/`);
            const data = await response.json();
            setSubject(data);
        };
        const fetchTeacherSubjects = async () => {
            const response = await getRequest(`subject/${id}/teachers/`);
            const data = await response.json();
            // setTeacherSubjects(data.teacher_subject);
            setTeachers(data.teacher_subject.map((teacher_subject) => teacher_subject.teacher))
            setLoading(false)
        }

        fetchSubject();
        fetchTeacherSubjects()
    }, []);

    const teachersColumn = getColumns(teachers, setTeachers);

    const teachersTable = useReactTable({
        columns: teachersColumn,
        data: teachers,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
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

    if (loading) return <Spinner />

    return (
        <div className="h-full">
            <h1 className="text-4xl text-blue-600 font-bold">{subject?.name}</h1>
            <Tabs defaultValue="teachers" className="py-4">
                <TabsList className="w-full">
                    <TabsTrigger value="teachers" className="w-full">
                        Professores
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="teachers">
                    <CustomDataTable table={teachersTable} pagination>
                    <TeacherController
                        table={teachersTable}
                    />
                    </CustomDataTable>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default DisciplinaPageAdmin;
