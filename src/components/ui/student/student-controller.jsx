"use client";

import { CirclePlus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useContext } from "react";

import AuthContext from "@/context/AuthContext";

import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import StudentForm from "./student-form";

function StudentController({ table, classes }) {
    const [_class, setClass] = useState({});

    async function attachClass(rows, class_id) {
        const data = {};
        data.student = rows.map((row) => row.original.id);
        data._class = class_id;

        if (data.student.length === 0 || typeof data._class !== "string") return;

        const res = await postRequest("http://127.0.0.1:8000/student_class/", data);

        if (res.ok) {
            toast({
                variant: "success",
                title: "Estudante(s) adicionado(s) a turma com sucesso.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Selecione no mínimo 1 estudante e uma turma",
                description: "Os estudantes não podem fazer parte da turma escolhida.",
            });
        }
    }

    const { toast } = useToast();
    const { postRequest } = useContext(AuthContext);
    return (
        <div className="flex justify-between items-center flex-wrap gap-2 py-4 ">
            <div className="flex gap-2">
                <Input
                    placeholder="Filtrar nome..."
                    value={table.getColumn("name")?.getFilterValue() ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="max-w-sm text-[10px] md:text-sm"
                />
                <Select
                    onValueChange={(value) => {
                        table.getColumn("degree")?.setFilterValue(value);
                    }}>
                    <SelectTrigger className="w-[180px] text-muted-foreground text-[10px] md:text-sm">
                        <SelectValue placeholder="Filtrar ano" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                </Select>

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
                            Novo estudante
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                            <DialogTitle>Novo estudante</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <StudentForm />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default StudentController;
