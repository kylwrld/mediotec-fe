import { CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import StudentForm from "./student-form";

function StudentControllerClass({ table, addStudent, newStudentButton = false }) {
    const [_class, setClass] = useState({});
    const { id } = useParams();
    const { toast } = useToast();
    const { postRequest } = useContext(AuthContext);

    async function attachClass(student, _class) {
        const data = { student, _class };

        if (data.student.length === 0 || typeof data._class !== "string") return;

        const res = await postRequest("student_class/", data);

        if (res.ok) {
            toast({
                variant: "success",
                title: "Estudante adicionado a turma com sucesso.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível adicionar estudante a turma",
                description: "O estudante não pode faze parte da turma escolhida.",
            });
        }
    }

    async function onSubmitNewStudent(user) {
        user.birth_date = formatDate(new Date(user.birth_date));
        const form = new FormData()
        form.append("name", user.name)
        form.append("email", user.email)
        form.append("password", user.password)
        form.append("birth_date", user.birth_date)
        form.append("parent", JSON.stringify(user.parent))
        form.append("phone", JSON.stringify(user.phone))
        if (user.image.length > 0){
            form.append("image", user.image[0])
        }

        const res = await postRequest("signup/student/", form, false, false);
        const student = await res.json();

        if (res.ok) {
            toast({
                variant: "success",
                title: "Estudante criado com sucesso.",
            });
            attachClass(student.id, id);
            addStudent(student);
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível criar estudante.",
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
                <Select
                    onValueChange={(value) => {
                        table.getColumn("degree")?.setFilterValue(value);
                    }}>
                    <SelectTrigger aria-label="Filtrar estudante pelo ano" className="w-[180px] text-muted-foreground text-[10px] md:text-sm">
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
                {newStudentButton ? (
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
                                <StudentForm onSubmit={onSubmitNewStudent} />
                            </div>
                        </DialogContent>
                    </Dialog>
                ) : null}
            </div>
        </div>
    );
}

export default StudentControllerClass;
