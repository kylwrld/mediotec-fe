import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { postRequest } from "@/lib/utils";

const formSchema = z.object({
    name: z.string({ required_error: "Por favor preencha com um nome." }),
});

function SubjectForm() {
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(subject) {
        const res = await postRequest("http://127.0.0.1:8000/subject/", subject);
        if (res.ok) {
            toast({
                variant: "success",
                title: "Disciplina criada com sucesso",
            });
        }
    }

    async function attachTeacher(subject, teacher_id) {
        const data = {};
        // TODO: Handle multiple subjects
        data.subject = subject[0].original.id;
        data.teacher = teacher_id;
        console.log(data);
        const res = await postRequest("http://127.0.0.1:8000/teacher_subject/", data);
        if (res.ok) {
            toast({
                variant: "success",
                title: "Disciplina(s) atribuída(s) ao professor com sucesso.",
            });
        }
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
