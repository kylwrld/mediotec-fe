import { useContext, useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import Spinner from "@/components/Spinner";
import SubjectController from "@/components/subject/subject-controller";
import CustomDataTable from "@/components/ui/custom-data-table";
import AuthContext from "@/context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function getColumns(state, setState) {
    const navigate = useNavigate();

    const columns = [
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label="Seleciona todos"
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             aria-label="Seleciona linha"
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "name",
            header: "Nome",
            cell: ({ row }) => (
                <div className="capitalize" onClick={() => navigate(`/disciplina/${row.original.id}`)}>
                    {row.getValue("name")}
                </div>
            ),
        },
    ];

    return columns;
}

function SubjectView() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { id } = useParams();
    const { getRequest } = useContext(AuthContext);
    const columns = getColumns(subjects, setSubjects);

    const table = useReactTable({
        columns,
        data: subjects,
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
        const fetchSubjects = async () => {
            const response = await getRequest(`teacher/${id}/subjects/`);
            const data = await response.json();
            const subjects = [];
            for (const teacherSubject of data.teacher_subjects) {
                subjects.push(teacherSubject.subject);
            }
            setSubjects(subjects);

            setLoading(false);
        };

        fetchSubjects();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="flex justify-center items-center w-full">
            <CustomDataTable table={table} pagination>
                <SubjectController table={table} />
            </CustomDataTable>
        </div>
    );
}

export default SubjectView;
