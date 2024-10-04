"use client";

import { CirclePlus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TeacherForm from "./teacher-form";
import { useState } from "react";

function TeacherController({ table, classes }) {
    const [_class, setClass] = useState({});

    return (
        <div className="flex justify-between items-center flex-wrap gap-2 py-4 ">
            <div className="flex gap-2">
                <Input
                    placeholder="Filtrar nome..."
                    value={table.getColumn("name")?.getFilterValue() ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="max-w-sm text-[10px] md:text-sm"
                />

                <Button
                    className="text-[10px] md:text-sm bg-orange-600"
                    onClick={(event) => {
                        table.resetColumnFilters();
                    }}>
                    Remover filtros
                </Button>
            </div>

            <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="text-[10px] md:text-sm bg-orange-600 gap-2">
                            <UsersRound size={20} />
                            Atribuir a uma turma
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                            <DialogTitle>Atribuir a uma turma</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                            <Select onValueChange={(value) => setClass(value)}>
                                <SelectTrigger className="text-muted-foreground">
                                    <SelectValue placeholder="Selecione uma turma" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes
                                        ? classes.map((class_year, index) => (
                                              <SelectItem key={index} value={class_year._class.id.toString()}>
                                                  {class_year._class.name}
                                              </SelectItem>
                                          ))
                                        : null}
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(value) => setClass(value)}>
                                <SelectTrigger className="text-muted-foreground">
                                    <SelectValue placeholder="Selecione uma disciplina" />
                                </SelectTrigger>
                                <SelectContent>
                                    
                                </SelectContent>
                            </Select>
                            <Button onClick={() => attachClass(table.getSelectedRowModel().rows, _class)}>
                                Enviar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="text-[10px] md:text-sm bg-orange-600 gap-2">
                            <CirclePlus size={20} />
                            Novo professor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                            <DialogTitle>Novo professor</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <TeacherForm />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default TeacherController;
