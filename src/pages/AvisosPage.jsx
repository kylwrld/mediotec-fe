import AnnouncementDataTable from '@/components/ui/announcement/announcement-data-table';
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
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
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("title")}</div>
        ),
    },
    {
        accessorKey: "body",
        // header: () => <div className="text-right">Ano</div>,
        header: "Conteúdo",
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium">
                    {row.getValue("body")}
                </div>
            );
        },
        filterFn: "includesString",
    },
    {
        accessorKey: "fixed",
        // header: () => <div className="text-right">Ano</div>,
        header: "Fixado",
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium">
                    {row.getValue("fixed")}
                </div>
            );
        },
        filterFn: "includesString",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const payment = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
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

function AvisosPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const response = await fetch("http://127.0.0.1:8000/announcement/");
            const data = await response.json();
            setAnnouncements(data.announcements);
        };

        const fetchClasses = async () => {
            const response = await fetch("http://127.0.0.1:8000/class-year/");
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
            <div className=''>
                <AnnouncementDataTable
                    columns={columns}
                    data={announcements}
                    classes={classes}
                ></AnnouncementDataTable>
            </div>
        </div>
    );
}

export default AvisosPage
