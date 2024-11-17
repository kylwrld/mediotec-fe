"use client";

import { CirclePlus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

import AuthContext from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useContext, useState } from "react";
import AdminForm from "./admin-form";

function AdminController({ table, classes, addAdmin, newAdminButton = false }) {
    const [_class, setClass] = useState({});
    const { toast } = useToast();
    const { postRequest } = useContext(AuthContext);

    // name
    // email
    // password
    // birth_date
    // parent
    // phone
    // image
    async function onSubmitNew(user) {
        user.birth_date = formatDate(new Date(user.birth_date));
        const form = new FormData()
        form.append("name", user.name)
        form.append("email", user.email)
        form.append("password", user.password)
        form.append("birth_date", user.birth_date)
        form.append("type", "ADMIN")
        if (user.image.length > 0){
            form.append("image", user.image[0])
        }

        const res = await postRequest("signup/", form, false, false);
        const newUser = await res.json();

        if (res.ok) {
            toast({
                variant: "success",
                title: "Coordenador(a) criado com sucesso.",
            });
            addAdmin(newUser);
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível criar coordenador(a).",
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
                {newAdminButton ? (
                    <Dialog>
                        <DialogTrigger aria-label="Adiciona novo estudante" asChild>
                            <Button className="text-[10px] md:text-sm bg-orange-600 gap-2">
                                <CirclePlus size={20} />
                                Novo coordenador(a)
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[720px]">
                            <DialogHeader>
                                <DialogTitle>Novo coordenador(a)</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <AdminForm onSubmit={onSubmitNew} />
                            </div>
                        </DialogContent>
                    </Dialog>
                ) : null}
            </div>
        </div>
    );
}

export default AdminController;
