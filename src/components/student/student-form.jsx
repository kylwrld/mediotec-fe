import { useState } from "react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 500_000;

const phoneSchema = z.object({
    ddd: z
        .string()
        .min(2, { message: "DDD precisa conter dois dígitos" })
        .max(2, { message: "DDD precisa ser exatamente dois dígitos" })
        .regex(/^[0-9]+$/, { message: "DDD precisa conter apenas números" }),
    number: z
        .string()
        .min(8, { message: "Telefone precisa ter pelo menos 8 dígitos" })
        .max(9, { message: "Telefone precisa ter no máximo 9 dígitos" })
        .regex(/^[0-9]+$/, {
            message: "Telefone precisa conter apenas números",
        }),
});

const formSchema = z.object({
    name: z.string({ required_error: "Por favor preencha com um nome." }).min(3, {
        message: "Nome precisa ter no mínimo 3 caracteres.",
    }),
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
    parent: z.object({
        name: z.string({
            required_error: "Por favor preencha o nome do responsável.",
        }),
        cpf: z
            .string({
                required_error: "Por favor preencha o CPF do responsável.",
            })
            .min(14, { message: "O CPF precisa ter 14 dígitos" })
            //
            .regex(/[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/, { message: "CPF precisa estar no padrão XXX.XXX.XXX-XX" }),
    }),
    phone: z.array(phoneSchema),
    image: z.instanceof(FileList).optional()
});

function StudentForm({ onSubmit }) {
    const [_class, setClass] = useState({});


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phone: [{ ddd: "", number: "" }],
            parent: { name: "", cpf: "" },
        },
    });

    const fileRef = form.register("image");

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 px-2 sm:px-16 xl:px-20 w-full overflow-y-auto max-h-[600px]">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome do Estudante</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o nome do estudante" {...field} />
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
                                <Input placeholder="Digite o email do estudante" {...field} />
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
                                <Input type="password" placeholder="Digite a senha do estudante" {...field} />
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
                                A data de nascimento é usada para calcular a idade do estudante.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="parent.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome do responsável</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o nome do responsável" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="parent.cpf"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CPF do responsável</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o CPF do responsável" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Foto do estudante</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/*" placeholder="Imagem do aluno" {...fileRef} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                {(form.watch("phone") || []).map((phone, index) => {
                    return (
                        <div key={index} className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`phone.${index}.ddd`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>DDD</FormLabel>
                                        <FormControl>
                                            <Input placeholder="DDD" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`phone.${index}.number`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de telefone</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite o número de telefone do responsável"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    );
                })}

                <div className="flex gap-2">
                    <Button type="submit">Enviar</Button>

                    <Button
                        type="button"
                        onClick={() => {
                            form.setValue("phone", [...(form.watch("phone") || []), { ddd: "", number: "" }]);
                        }}>
                        Adicionar outro telefone
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default StudentForm;
