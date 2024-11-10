"use client";

import { CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useContext } from "react";
import AnnouncementForm from "./announcement-form";

function AnnouncementController({ table, addAnnouncement, classes }) {
    const { toast } = useToast();
    const { postRequest } = useContext(AuthContext);

    async function onSubmit(announcement) {
        const res = await postRequest("http://192.168.1.9:8000/announcement/", announcement);
        const data = await res.json();
        if (res.ok) {
            toast({
                variant: "success",
                title: "Aviso criado com sucesso",
            });
            addAnnouncement(data.announcement);
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível criar aviso",
            });
        }
    }

    return (
        <div className="flex justify-between items-center flex-wrap gap-2 py-4 ">
            <div className="flex gap-2">
                <Input
                    placeholder="Filtrar título..."
                    value={table.getColumn("title")?.getFilterValue() ?? ""}
                    onChange={(event) => {
                        table.getColumn("title")?.setFilterValue(event.target.value);
                    }}
                    className="max-w-sm text-[10px] md:text-sm"
                />

                <Button
                    className="text-[10px] md:text-sm bg-orange-600"
                    onClick={(event) => {
                        table.resetColumnFilters();
                    }}>
                    Remover filtros
                </Button>
                <Button
                    className="text-[10px] md:text-sm bg-orange-600"
                    onClick={(event) => {
                        table.getColumn("fixed").setFilterValue(true);
                    }}>
                    Fixados
                </Button>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="text-[10px] md:text-sm bg-orange-600 gap-2">
                        <CirclePlus size={20} />
                        Novo aviso
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[720px]">
                    <DialogHeader>
                        <DialogTitle>Novo aviso</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 overflow-y-auto max-h-[600px]">
                        <AnnouncementForm classes={classes} onSubmit={onSubmit} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AnnouncementController;
