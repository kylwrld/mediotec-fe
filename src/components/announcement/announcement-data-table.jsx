"use client";

import { Pencil, Pin, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/custom-table-announcement";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { deleteUndefinedKeys, mergeObjs } from "@/lib/utils";
import { useContext } from "react";
import AnnouncementFormEdit from "./announcement-form-edit";

export default function AnnouncementDataTable({ table, controller, classes, state, setState }) {
    const { toast } = useToast();
    const { deleteRequest, patchRequest } = useContext(AuthContext);

    return (
        <div className="w-full">
            {controller}

            <div className="rounded-md border-0 lg:px-20 xl:px-40 2xl:px-72 py-8">
                <Table>
                    <TableBody className="flex flex-col gap-5">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    <td className="flex flex-col h-fit p-4 border rounded-md">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-2 items-center">
                                                <div className="flex flex-col">
                                                    <p className="font-bold">{row.original.user.name}</p>
                                                    <span className="text-muted-foreground">
                                                        {new Date(row.original.created_at).toLocaleString("pt-BR")}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-5">
                                                <div>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button aria-label="Editar aviso" className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:bg-slate-200 outline-none">
                                                                <Pencil size={18} />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[720px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Editar aviso</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <AnnouncementFormEdit
                                                                    classes={classes}
                                                                    onSubmit={async (obj) => {
                                                                        obj = deleteUndefinedKeys(obj);
                                                                        const res = await patchRequest(
                                                                            `mascate-be.onrender.com/announcement/${row.original.id}/`,
                                                                            obj
                                                                        );
                                                                        if (res.ok) {
                                                                            toast({
                                                                                variant: "success",
                                                                                title: "Aviso editado com sucesso",
                                                                            });
                                                                            setState(
                                                                                state.map((stateObj) =>
                                                                                    stateObj.id !== row.original.id
                                                                                        ? stateObj
                                                                                        : mergeObjs(stateObj, obj)
                                                                                )
                                                                            );
                                                                        } else {
                                                                            toast({
                                                                                variant: "destructive",
                                                                                title: "Não foi possível editar informações do aviso",
                                                                            });
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    {/* delete */}
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button aria-label="Remover aviso" className="justify-start px-2 shadow-none gap-2 bg-transparent text-black hover:text-white hover:bg-red-600 outline-none">
                                                                <Trash2 size={18} />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Tem certeza que deseja remover um aviso?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta ação não pode ser desfeita. Os dados serão
                                                                    permanentemente deletados.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-red-600 hover:bg-red-800"
                                                                    onClick={async () => {
                                                                        const res = await deleteRequest(
                                                                            `mascate-be.onrender.com/announcement/${row.original.id}/`
                                                                        );
                                                                        if (res.ok) {
                                                                            toast({
                                                                                variant: "success",
                                                                                title: "Turma removida com sucesso",
                                                                            });
                                                                            setState(
                                                                                state.filter(
                                                                                    (obj) => obj.id !== row.original.id
                                                                                )
                                                                            );
                                                                        } else {
                                                                            toast({
                                                                                variant: "destructive",
                                                                                title: "Não foi possível remover aviso",
                                                                            });
                                                                        }
                                                                    }}>
                                                                    Remover
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                                <div className="flex justify-center items-center">
                                                    {row.original.fixed && <Pin></Pin>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <p className="text-xl font-bold">{row.original.title}</p>
                                            <p>{row.original.body}</p>
                                        </div>
                                    </td>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className="flex justify-center items-center h-24 text-center border rounded-md">
                                    Nenhum resultado
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}>
                        Próximo
                    </Button>
                </div>
            </div>
        </div>
    );
}
