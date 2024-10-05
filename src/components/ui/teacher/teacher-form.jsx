"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import AuthContext from "@/context/AuthContext";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = z.object({
    name: z.string({ required_error: "Por favor preencha com um nome." }),
    email: z
        .string({
            required_error: "Por favor preencha com um email.",
        })
        .email("Esse email não é válido."),
    password: z
        .string({
            required_error: "Por favor digite uma senha.",
        })
        .min(3, { message: "A senha precisa ter no mínimo 3 caracteres." }),
    birth_date: z.date({
        required_error: "Por favor especifique a data de nascimento.",
    }),
});

function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

function TeacherForm() {
    const { toast } = useToast();
    const { postRequest } = useContext(AuthContext);

    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(user) {
        user.birth_date = formatDate(new Date(user.birth_date));
        user.type = "TEACHER";
        const res = await postRequest("http://127.0.0.1:8000/signup/", user);
        if (res.ok) {
            toast({
                variant: "success",
                title: "Professor criado com sucesso.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Não foi possível criar professor",
            });
        }
    }

    async function attachClass(rows, teacher_id) {
        // const data = {};
        // data.student = rows.map((row) => row.original.id);
        // data._class = class_id;
        // if (data.student.length === 0 || typeof data._class !== "string") return;
        // const res = await postRequest("http://127.0.0.1:8000/student_class/", data);
        // if (res.ok) {
        //     toast({
        //         variant: "success",
        //         title: "Estudante(s) adicionado(s) a turma com sucesso.",
        //     });
        // } else {
        //     toast({
        //         variant: "destructive",
        //         title: "Selecione no mínimo 1 estudante e uma turma",
        //         description: "Os estudantes não podem fazer parte da turma escolhida.",
        //     });
        // }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 px-2 xl:px-20 w-full overflow-y-auto max-h-[600px]">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome do professor</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o nome do professor" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o email do professor" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Digite a senha do professor" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Data de nascimento</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}>
                                            {field.value ? (
                                                format(field.value, "PPP", {
                                                    locale: ptBR,
                                                })
                                            ) : (
                                                <span>Selecione uma data</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                A data de nascimento é usada para calcular a idade do professor.
                            </FormDescription>
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

export default TeacherForm;
