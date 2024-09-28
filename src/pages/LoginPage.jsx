import React, { useContext } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthContext from "@/context/AuthContext";

const formSchema = z.object({
    email: z
        .string({
            required_error: "Por favor preencha com um email.",
        })
        .email("Esse email não é válido."),
    password: z
        .string({
            required_error: "Por favor digite uma senha.",
        }).min(3, {"message":"A senha precisa ter no mínimo 3 caracteres."})

});

function LoginPage() {
    const { postLogin } = useContext(AuthContext);

    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(user) {
        postLogin(user)
    }

    return (
        <div className="h-full p-4 md:px-16 md:py-10 bg-slate-300">
            <div className="h-full flex drop-shadow-md">
                <div className="flex justify-center items-center w-1/2 h-full rounded-l-xl bg-[radial-gradient(circle,rgba(106,151,255,1)_10%,rgba(0,80,255,1)_80%)] hidden lg:flex">
                    <img
                        className="w-3/5"
                        src="\src\assets\mediotec boneco.svg"
                        alt=""
                    />
                </div>
                <div className="flex justify-center items-center w-full lg:w-1/2 h-full border border-gray-300 rounded-lg lg:rounded-l-none lg:rounded-r-xl bg-white">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 px-2 md:px-20 xl:px-32 w-full"
                        >
                            <h1 className="text-4xl text-center">Login</h1>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite seu email"
                                                {...field}
                                            />
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
                                            <Input
                                                placeholder="Digite sua senha"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Enviar</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
