import ClassController from "@/components/class/class-controller";
import Spinner from "@/components/Spinner";
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
import { ArrowUpDown } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getColumns() {
    const navigate = useNavigate();

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
            cell: ({ row }) => (
                <div className="capitalize" onClick={() => navigate(`/turma/${row.original.id}`)}>
                    {row.getValue("name")}
                </div>
            ),
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

    return columns;
}

function ClassViewTeacher({ id }) {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getRequest, decodeToken } = useContext(AuthContext);

    const columns = getColumns();
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        columns,
        data: classes,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

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
            const response = await getRequest(`teacher/${id}/classes/`);
            const data = await response.json();
            setClasses(data.classes);
            setLoading(false);
        };
        fetchClasses();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="h-full">
            <CustomDataTable table={table} pagination>
                <ClassController table={table} />
            </CustomDataTable>
        </div>
    );
}

export default ClassViewTeacher;
