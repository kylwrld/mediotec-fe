import React from 'react'
import DataTable from '@/components/ui/data-table'
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import MobileNav from '@/components/ui/mobile-nav';
import { filterFns } from '@tanstack/react-table';


const data = [
    {
        id: "m5gr84i9",
        degree: 3,
        name: "Daniel Henrique",
        email: "ken99@yahoo.com",
    },
    {
        id: "3u1reuv4",
        degree: 3,
        name: "Maria",
        email: "a@gmail.com",
    },
    {
        id: "derv1ws0",
        degree: 3,
        name: "João Gabriel",
        email: "Monserrat44@gmail.com",
    },
    {
        id: "5kma53ae",
        degree: 1,
        name: "Gustavo",
        email: "Silas22@gmail.com",
    },
    {
        id: "bhqecj4p",
        degree: 3,
        name: "José Guimarães",
        email: "carmella@hotmail.com",
    },
    {
        id: "bhqecj4p",
        degree: 2,
        name: "Júlia",
        email: "carmella@hotmail.com",
    },
    {
        id: "x7pq13jr",
        degree: 2,
        name: "Carla Silva",
        email: "carla_silva@gmail.com",
    },
    {
        id: "h8ytw90d",
        degree: 1,
        name: "Roberto Souza",
        email: "roberto_souza@outlook.com",
    },
    {
        id: "kd8n4l6s",
        degree: 3,
        name: "Fernanda Lima",
        email: "fernanda_lima@yahoo.com",
    },
    {
        id: "n9z45jqb",
        degree: 2,
        name: "Ricardo Almeida",
        email: "ricardo.almeida@gmail.com",
    },
    {
        id: "d5wq7l8v",
        degree: 1,
        name: "Pedro Henrique",
        email: "pedro_henrique@gmail.com",
    },
    {
        id: "c9ys3a8m",
        degree: 2,
        name: "Ana Clara",
        email: "ana.clara@hotmail.com",
    },
    {
        id: "v7dr6f2p",
        degree: 3,
        name: "Lucas Fernandes",
        email: "lucas.fernandes@gmail.com",
    },
    {
        id: "e4k9l2u3",
        degree: 1,
        name: "Felipe Santos",
        email: "felipe_santos@yahoo.com",
    },
];


export const columns = [

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
        accessorKey: "degree",
        // header: () => <div className="text-right">Ano</div>,
        header: ({ column }) => {
            return (
                <div className='flex justify-end'>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="justify-end"
                    >
                        Ano
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const degree = parseFloat(row.getValue("degree"));

            return <div className="text-right font-medium">{degree}</div>;
        },
        filterFn: "includesString"
    },

];

function EstudantesPage() {
  return (
    <div>
        <h1 className='text-4xl text-blue-600 font-bold'>Estudantes</h1>
        <DataTable columns={columns} data={data}></DataTable>
    </div>
  )
}

export default EstudantesPage
