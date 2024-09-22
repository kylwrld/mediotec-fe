import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./custom-sheet";
import { Button } from "./button";
import {
    CalendarDays,
    FileChartColumn,
    GraduationCap,
    Megaphone,
    Menu,
    User,
    UsersRound,
} from "lucide-react";

import SidebarLink from "../SidebarLink";

export default function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <SidebarLink to="/estudantes" icon={<User/>} content={"Estudantes"}/>
                    <SidebarLink to="/turmas" icon={<UsersRound/>} content={"Turmas"} />
                    <SidebarLink to="/professores" icon={<GraduationCap/>} content={"Professores"}/>
                    <SidebarLink to="/horarios" icon={<CalendarDays/>} content={"Horários"}/>
                    <SidebarLink to="/avisos" icon={<Megaphone/>} content={"Avisos"}/>
                    <SidebarLink to="/faltas" icon={<FileChartColumn/>} content={"Faltas"}/>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
