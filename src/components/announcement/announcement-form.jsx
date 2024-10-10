"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
    title: z.string({ required_error: "Por favor preencha com um título." }).min(3, {
        message: "Título precisa ter pelo menos 3 caracteres.",
    }),
    body: z.string({
        required_error: "Por favor preencha com algum conteúdo.",
    }),
    fixed: z.boolean().default(false),
    _class: z.string().optional(),
});

function AnnouncementForm({ classes, onSubmit }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-2 md:px-20 xl:px-32 w-full">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o nome do professor" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Conteúdo</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Digite o conteúdo do aviso" className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="_class"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Turma</FormLabel>
                            <Select onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger className="text-muted-foreground">
                                        <SelectValue placeholder="Selecione uma turma (opcional)" />
                                    </SelectTrigger>
                                </FormControl>
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

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="fixed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormLabel>Fixar</FormLabel>
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
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

export default AnnouncementForm;
