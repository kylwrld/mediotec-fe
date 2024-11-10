"use client";

import { CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useContext } from "react";
import ClassForm from "./class-form";

function ClassController({ table, addClass, newClassButton = false }) {
    const { toast } = useToast();
    const { postRequest } = useContext(AuthContext);

    async function onSubmit(_class) {
        const res = await postRequest("class/", _class);
        const data = await res.json();
        if (res.ok) {
            toast({
                variant: "success",
                title: "Turma criada com sucesso.",
            });
            addClass(data.class_year._class);
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível criar turma",
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
                        table.getColumn("type")?.setFilterValue(value);
                    }}>
                    <SelectTrigger aria-label="Seleciona um curso" className="w-[180px] text-muted-foreground text-[10px] md:text-sm">
                        <SelectValue placeholder="Filtrar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Informática">Informática</SelectItem>
                        <SelectItem value="Logística">Logística</SelectItem>
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

            {newClassButton ? (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button aria-label="Adiciona nova turma" className="text-[10px] md:text-sm bg-orange-600 gap-2">
                            <CirclePlus size={20} />
                            Nova turma
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[720px]">
                        <DialogHeader>
                            <DialogTitle>Nova turma</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 overflow-y-auto max-h-[600px]">
                            <ClassForm onSubmit={onSubmit} />
                        </div>
                    </DialogContent>
                </Dialog>
            ) : null}
        </div>
    );
}

export default ClassController;
