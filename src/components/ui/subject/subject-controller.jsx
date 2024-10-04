import { CirclePlus, GraduationCap } from "lucide-react";
import SubjectForm from "./subject-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { z } from "zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";


function SubjectController({ table, teachers }) {
    const [teacher, setTeacher] = useState({});

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
                            <GraduationCap size={20} />
                            Atribuir a um professor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                            <DialogTitle>Atribuir a um professor</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                            <Select onValueChange={(value) => setTeacher(value)}>
                                <SelectTrigger className="text-muted-foreground">
                                    <SelectValue placeholder="Selecione uma turma" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers
                                        ? teachers.map((teacher, index) => (
                                              <SelectItem key={index} value={teacher.id.toString()}>
                                                  {teacher.name}
                                              </SelectItem>
                                          ))
                                        : null}
                                </SelectContent>
                            </Select>
                            <Button onClick={() => attachTeacher(table.getSelectedRowModel().rows, teacher)}>
                                Enviar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="text-[10px] md:text-sm bg-orange-600 gap-2">
                            <CirclePlus size={20} />
                            Nova disciplina
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                            <DialogTitle>Novo disciplina</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <SubjectForm />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default SubjectController;
