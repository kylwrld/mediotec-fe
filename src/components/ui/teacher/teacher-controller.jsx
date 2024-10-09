"use client";

import { CirclePlus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useContext, useState } from "react";
import TeacherForm from "./teacher-form";
import AuthContext from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";

function TeacherController({ table, addTeacher, classes }) {
    const [_class, setClass] = useState({});
    const [teacherSubject, setTeacherSubject] = useState({});
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [subject, setSubject] = useState({});
    const { postRequest, getRequest } = useContext(AuthContext);

    const { toast } = useToast();

    async function fetchTeacherSubject() {
        const teacher_id = table.getSelectedRowModel().rows[0].original.id;
        const data = await (await getRequest(`http://127.0.0.1:8000/teacher/${teacher_id}/subjects/`)).json();
        setTeacherSubjects(data.teacher);
    }

    async function fetchSubjects() {
        if (subjects.length == 0) {
            const data = await (await getRequest("http://127.0.0.1:8000/subject/")).json();
            setSubjects(data.subjects);
        }
    }

    async function attachSubject(teacher_id, subject_id) {
        const data = {};
        data.teacher = teacher_id;
        data.subject = subject_id;
        const res = await postRequest("http://127.0.0.1:8000/teacher_subject/", data);

        if (res.ok) {
            toast({
                variant: "success",
                title: "Disciplina atribuída ao professor",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível atribuir professor a disciplina",
            });
        }
    }

    async function attachClass(class_id, teacherSubject_id) {
        const data = {};
        data.teacher_subject = teacherSubject_id;
        data._class = class_id;
        const res = await postRequest("http://127.0.0.1:8000/class_year_teacher_subject/", data);
        if (res.ok) {
            toast({
                variant: "success",
                title: "Turma atribuída ao professor",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível atribuir professor a turma",
            });
        }
    }

    async function onSubmit(user) {
        user.birth_date = formatDate(new Date(user.birth_date));
        user.type = "TEACHER";
        const res = await postRequest("http://127.0.0.1:8000/signup/", user);
        const teacher = await res.json()
        if (res.ok) {
            toast({
                variant: "success",
                title: "Professor criado com sucesso.",
            });
            addTeacher(teacher)
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível criar professor",
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
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="text-[10px] md:text-sm bg-orange-600 gap-2" onClick={fetchSubjects}>
                            <UsersRound size={20} />
                            Atribuir uma disciplina
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                            <DialogTitle>Atribuir uma disciplina</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                            <Select onValueChange={(value) => setSubject(value)}>
                                <SelectTrigger className="text-muted-foreground">
                                    <SelectValue placeholder="Selecione uma disciplina" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects
                                        ? subjects.map((subject, index) => (
                                              <SelectItem key={index} value={subject.id.toString()}>
                                                  {subject.name}
                                              </SelectItem>
                                          ))
                                        : null}
                                </SelectContent>
                            </Select>

                            <Button
                                onClick={() => attachSubject(table.getSelectedRowModel().rows[0].original.id, subject)}>
                                Enviar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="text-[10px] md:text-sm bg-orange-600 gap-2" onClick={fetchTeacherSubject}>
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

                            <Select onValueChange={(value) => setTeacherSubject(value)}>
                                <SelectTrigger className="text-muted-foreground">
                                    <SelectValue placeholder="Selecione uma disciplina" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teacherSubjects.length > 0 ? (
                                        teacherSubjects.map((teacherSubject, index) => (
                                            <SelectItem key={index} value={teacherSubject.id.toString()}>
                                                {teacherSubject.subject.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <p className="text-sm p-2">Nenhuma disciplina atribuida a esse professor</p>
                                    )}
                                </SelectContent>
                            </Select>

                            <Button onClick={() => attachClass(_class, teacherSubject)}>Enviar</Button>
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
                            <TeacherForm onSubmit={onSubmit}/>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default TeacherController;
