import AnnouncementDataTable from "@/components/ui/announcement/announcement-data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import AnnouncementController from "@/components/ui/announcement/announcement-controller";

export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        // header: "Nome",
        header: "Título",
        cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "body",
        // header: () => <div className="text-right">Ano</div>,
        header: "Conteúdo",
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.getValue("body")}</div>;
        },
        filterFn: "includesString",
    },
    {
        accessorKey: "fixed",
        // header: () => <div className="text-right">Ano</div>,
        header: "Fixado",
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.getValue("fixed")}</div>;
        },
        filterFn: "includesString",
    },
];

function AvisosPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 4,
    });

    const table = useReactTable({
        columns,
        data: announcements,
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
        const fetchAnnouncements = async () => {
            const response = await fetch("http://127.0.0.1:8000/announcement/");
            const data = await response.json();
            setAnnouncements(data.announcements);
        };

        const fetchClasses = async () => {
            const response = await fetch("http://127.0.0.1:8000/class_year/");
            const data = await response.json();
            setClasses(data.class_years);
        };

        fetchClasses();
        fetchAnnouncements();
        setLoading(false);
    }, []);

    return (
        <div className="h-full">
            <h1 className="text-4xl text-blue-600 font-bold">Avisos</h1>
            <div className="">
                <AnnouncementDataTable
                    table={table}
                    controller={<AnnouncementController table={table} classes={classes} />}></AnnouncementDataTable>
            </div>
        </div>
    );
}

export default AvisosPage;
