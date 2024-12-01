import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthContext from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
    email: z
        .string({
            required_error: "Por favor preencha com um email.",
        })
        .email("Esse email não é válido."),
    password: z
        .string({
            required_error: "Por favor digite uma senha.",
        })
        .min(1, { message: "Digite sua senha" }),
});

function LoginPage() {
    const [loading, setLoading] = useState(false);

    const { postLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(user) {
        setLoading(true);
        const res = await postLogin(user);
        if (res.ok) {
            toast({
                variant: "success",
                title: "Login realizado com sucesso",
                description: "Redirecionando para página de estudantes.",
            });
            navigate("/estudantes");
        } else {
            const data = await res.json()
            toast({
                variant: "destructive",
                // title: "Não foi possível realizar o login",
                title: data.detail,
                description: "Tente novamente.",
            });
        }
        setLoading(false);
    }

    return (
        <div className="h-full p-4 md:px-16 md:py-10 bg-slate-300">
            <div className="h-full flex drop-shadow-md">
                <div className="flex justify-center items-center w-1/2 h-full rounded-l-xl bg-[radial-gradient(circle,rgba(106,151,255,1)_10%,rgba(0,80,255,1)_80%)] hidden lg:flex">
                    <img loading='eager' className="w-3/5" src="https://i.ibb.co/SJ3tWz4/mediotec-boneco.png" alt="Boneco do Mediotec" />
                </div>
                <div className="flex items-center flex-col w-full lg:w-1/2 h-full border border-gray-300 rounded-lg lg:rounded-l-none lg:rounded-r-xl bg-white">
                    {loading ? (<Spinner />) : (
                        <>
                            <div className="w-1/4 m-20">
                                <img src="https://i.ibb.co/6JNr3kJ/mediotec-mobile.webp" className="" alt="Logo do Mediotec" />
                            </div>
                            <div className="flex grow w-full">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-8 px-2 md:px-20 xl:px-32 w-full">
                                        <h1 className="text-4xl text-center">Login</h1>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Digite seu email" {...field} />
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
