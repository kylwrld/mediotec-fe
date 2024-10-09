"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const TYPES = ["Informática", "Logística"];
const SHIFT_TYPES = ["Manhã", "Tarde"];

const formSchema = z.object({
    name: z.string({ required_error: "Por favor preencha com um nome." }),
    degree: z.string({
        required_error: "Por favor preencha com um ano.",
    }),
    type: z.enum(TYPES, {
        errorMap: (issue, ctx) => ({ message: "Informe o curso da turma" }),
    }),
    shift: z.enum(SHIFT_TYPES, {
        errorMap: (issue, ctx) => ({ message: "Informe o turno da turma" }),
    }),
});

function ClassForm() {
    const { toast } = useToast();
    const { postRequest } = useContext(AuthContext);

    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(_class) {
        const res = await postRequest("http://127.0.0.1:8000/class/", _class);
        if (res.ok) {
            toast({
                variant: "success",
                title: "Turma criada com sucesso.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível criar turma",
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-2 xl:px-20 w-full">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o nome da turma" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ano da turma</FormLabel>
                            <Select onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger className="text-muted-foreground">
                                        <SelectValue placeholder="Selecione um ano" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Turma</FormLabel>
                            <Select onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger className="text-muted-foreground">
                                        <SelectValue placeholder="Selecione o curso" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {TYPES
                                        ? TYPES.map((type, index) => (
                                              <SelectItem key={index} value={type}>
                                                  {type}
                                              </SelectItem>
                                          ))
                                        : null}
                                </SelectContent>
                            </Select>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shift"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Turno</FormLabel>
                            <Select onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger className="text-muted-foreground">
                                        <SelectValue placeholder="Selecione o turno" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {SHIFT_TYPES
                                        ? SHIFT_TYPES.map((type, index) => (
                                              <SelectItem key={index} value={type}>
                                                  {type}
                                              </SelectItem>
                                          ))
                                        : null}
                                </SelectContent>
                            </Select>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2">
                    <Button type="submit">Enviar</Button>
                </div>
            </form>
        </Form>
    );
}

export default ClassForm;
