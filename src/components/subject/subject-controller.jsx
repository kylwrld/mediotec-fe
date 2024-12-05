import { CirclePlus, GraduationCap } from "lucide-react";
import SubjectForm from "./subject-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuthContext from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useContext, useState } from "react";

function SubjectController({ table, addSubject, teachers, attachTeacherButton, addNewSubjectButton }) {
    const [teacher, setTeacher] = useState({});

    const { postRequest } = useContext(AuthContext);

    async function attachTeacher(subjects, teacher) {
        const subject = subjects.map((subject) => subject.original.id);
        const obj = { subject, teacher };
        const res = await postRequest("teacher_subject/", obj);
        if (res.ok) {
            toast({
                variant: "success",
                title: "Professor atribuído com sucesso",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível atribuir disciplina(s) ao professor",
            });
        }
    }

    async function onSubmit(subject) {
        const res = await postRequest("subject/", subject);
        const data = await res.json();
        if (res.ok) {
            toast({
                variant: "success",
                title: "Disciplina criada com sucesso",
            });
            addSubject(data.subject);
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível criar disciplina",
            });
        }
    }

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
                {attachTeacherButton && (
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
                                        <SelectValue placeholder="Selecione um professor" />
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
                )}

                {addNewSubjectButton && (
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
                                <SubjectForm onSubmit={onSubmit} />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

            </div>
        </div>
    );
}

export default SubjectController;
