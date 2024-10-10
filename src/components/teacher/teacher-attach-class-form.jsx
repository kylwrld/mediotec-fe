const formSchema = z.object({
    teacher_subject: z.string({ required_error: "Por favor preencha com um nome." }),
    _class: z.string({ required_error: "Por favor preencha com um nome." }),
});

function AttachClassForm({ classes, subjects }) {
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 px-2 xl:px-20 w-full overflow-y-auto max-h-[600px]">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Turma</FormLabel>
                            <Select onValueChange={(value) => setClass(value)}>
                                <FormControl>
                                    <SelectTrigger className="text-muted-foreground">
                                        <SelectValue placeholder="Selecione uma turma" />
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
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Turma</FormLabel>
                            <Select onValueChange={(value) => setSubject(value)}>
                                <FormControl>
                                    <SelectTrigger className="text-muted-foreground">
                                        <SelectValue placeholder="Selecione uma disciplina" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subjects.length > 0 ? (
                                        subjects.map((subject, index) => (
                                            <SelectItem key={index} value={subject.id.toString()}>
                                                {subject.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <p className="text-sm p-2">Nenhuma disciplina atribuida a esse professor</p>
                                    )}
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

export default AttachClassForm;
