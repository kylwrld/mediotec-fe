"use client";

import { CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import ClassForm from "./class-form";

function ClassController({ table }) {
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
                    <SelectTrigger className="w-[180px] text-muted-foreground text-[10px] md:text-sm">
                        <SelectValue placeholder="Filtrar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="informatica">Informática</SelectItem>
                        <SelectItem value="logistica">Logística</SelectItem>
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

            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className="text-[10px] md:text-sm bg-orange-600 gap-2"
                        onClick={(event) => {
                            console.log(table.getState().columnFilters);
                        }}>
                        <CirclePlus size={20} />
                        Nova turma
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[720px]">
                    <DialogHeader>
                        <DialogTitle>Nova turma</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 overflow-y-auto max-h-[600px]">
                        <ClassForm />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ClassController;
