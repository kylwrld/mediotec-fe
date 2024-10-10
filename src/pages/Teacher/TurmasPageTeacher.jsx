import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ClassController from "@/components/class/class-controller";
import CustomDataTable from "@/components/ui/custom-data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthContext from "@/context/AuthContext";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getColumns() {
    const navigate = useNavigate()

    const columns = [
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
            cell: ({ row }) => <div className="capitalize" onClick={() => navigate(`/turma/${row.original.id}`)}>{row.getValue("name")}</div>,
        },
        {
            accessorKey: "degree",
            header: "Ano",
            cell: ({ row }) => <div className="lowercase">{row.getValue("degree")}</div>,
        },
        {
            accessorKey: "type",
            header: () => <div className="text-right">Curso</div>,
            cell: ({ row }) => {
                return <div className="text-right font-medium">{row.getValue("type")}</div>;
            },
            filterFn: "includesString",
        },
    ];

    return columns
}

function TurmasPageTeacher() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { decodeToken } = useContext(AuthContext);
    const user = decodeToken()

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { getRequest } = useContext(AuthContext);
    const columns = getColumns()

    const table = useReactTable({
        columns,
        data: classes,
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

    useEffect(() => {
        const fetchClasses = async () => {
            const response = await getRequest(`https://mediotec-be.onrender.com/teacher/${user.id}/classes/`);
            const data = await response.json();
            setClasses(data.classes);
            setLoading(false);
        };
        fetchClasses();
    }, []);

    return (
        <div className="h-full">
            <h1 className="text-4xl text-blue-600 font-bold">Turmas</h1>
            <CustomDataTable table={table}>
                <ClassController table={table} />
            </CustomDataTable>
        </div>
    );
}

export default TurmasPageTeacher;
