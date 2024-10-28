import AnnouncementController from "@/components/announcement/announcement-controller";
import AnnouncementDataTable from "@/components/announcement/announcement-data-table";
import { Checkbox } from "@/components/ui/checkbox";
import AuthContext from "@/context/AuthContext";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useContext, useEffect, useState } from "react";

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
        accessorKey: "title",
        header: "Título",
        cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "body",
        header: "Conteúdo",
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.getValue("body")}</div>;
        },
        filterFn: "includesString",
    },
    {
        accessorKey: "fixed",
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
    const { getRequest } = useContext(AuthContext);

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
            const response = await getRequest("https://mediotec-be.onrender.com/announcement/");
            const data = await response.json();
            setAnnouncements(data.announcements);
        };

        const fetchClasses = async () => {
            const response = await getRequest("https://mediotec-be.onrender.com/class_year/");
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
                    state={announcements}
                    classes={classes}
                    setState={setAnnouncements}
                    controller={
                        <AnnouncementController
                            table={table}
                            classes={classes}
                            addAnnouncement={(announcement) => setAnnouncements([...announcements, announcement])}
                        />
                    }></AnnouncementDataTable>
            </div>
        </div>
    );
}

export default AvisosPage;
