import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

const TIME = ["7h", "7h50", "8h40", "9h30", "10h0", "10h50", "11h40", "12h30", "13h20"]

function CustomTimeScheduleDataTable({ table, children, rowOnClick }) {
    return (
        <div className="w-full">
            {children}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="px-4">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="p-4"
                                            // Redirect
                                            onClick={() => (rowOnClick ? rowOnClick(row) : null)}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            {/* {(() => {
                                                const [index, column] = cell.id.split("_")
                                                console.log(column)
                                                if (column == "hour") {
                                                    return TIME[parseInt(index)]
                                                }

                                            })()
                                            }
                                            {console.log(
                                                cell.id
                                            )} */}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Nenhum resultado
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default CustomTimeScheduleDataTable;
