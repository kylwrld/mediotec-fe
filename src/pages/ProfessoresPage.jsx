import React from "react";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import TeacherDataTable from "@/components/ui/teacher/teacher-data-table";

export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                // onCheckedChange={(value) =>
                //     table.toggleAllPageRowsSelected(!!value)
                // }
                aria-label="Seleciona todos"
            />
        ),
        cell: ({ row, table }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    const rowsModel = table.getSelectedRowModel()
                    if (rowsModel.rows.length > 0) {
                        const s_row = rowsModel.rows[0]
                        s_row.toggleSelected(false)
                        row.toggleSelected(!!value)
                    } else {
                        row.toggleSelected(!!value)
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
        // header: "Nome",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0"
                    aria-label="Ordena por nome"
                >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const payment = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 w-full justify-end">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(payment.id)}
                >
                  Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
];

function ProfessoresPage() {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeachers = async () => {
            const response = await fetch("http://127.0.0.1:8000/teacher/");
            const data = await response.json();
            setTeachers(data.teachers);
            setLoading(false);
        };
        const fetchClasses = async () => {
            const response = await fetch("http://127.0.0.1:8000/class-year/");
            const data = await response.json();
            setClasses(data.class_years);
        };

        fetchTeachers();
        fetchClasses();
    }, []);

    return (
        <div className="h-full">
            <h1 className="text-4xl text-blue-600 font-bold">Professores</h1>
            <TeacherDataTable columns={columns} data={teachers} classes={classes}></TeacherDataTable>
        </div>
    );
}

export default ProfessoresPage;
