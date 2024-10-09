import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { z } from "zod";

const formSchema = z.object({
    name: z.string({ required_error: "Por favor preencha com um nome." }),
});

function SubjectForm({ onSubmit }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
    });

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
                            <FormLabel>Nome da disciplina</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o nome do professor" {...field} />
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

export default SubjectForm;
