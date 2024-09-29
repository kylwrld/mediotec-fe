import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./custom-sheet";
import { Button } from "./button";
import {
    CalendarDays,
    CircleUser,
    FileChartColumn,
    GraduationCap,
    Megaphone,
    Menu,
    User,
    UsersRound,
} from "lucide-react";

import SidebarLink from "../SidebarLink";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export default function MobileNav() {
    const { decodeToken, logout } = useContext(AuthContext);
    const user = decodeToken();
    const profile =
        user.type == "ADMIN"
            ? "Coordenação"
            : "Professor"

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col justify-between">
                <nav className="flex flex-col justify-between text-lg font-medium h-full">
                    <div className="flex flex-col gap-2">
                        <SidebarLink to="/estudantes" icon={<User/>} content={"Estudantes"}/>
                        <SidebarLink to="/turmas" icon={<UsersRound/>} content={"Turmas"} />
                        <SidebarLink to="/professores" icon={<GraduationCap/>} content={"Professores"}/>
                        <SidebarLink to="/horarios" icon={<CalendarDays/>} content={"Horários"}/>
                        <SidebarLink to="/avisos" icon={<Megaphone/>} content={"Avisos"}/>
                        <SidebarLink to="/faltas" icon={<FileChartColumn/>} content={"Faltas"}/>
                    </div>
                    <div className="flex mb-2 gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div className="flex justify-center items-center py-6 px-4 gap-2">
                                    <CircleUser />
                                    <span className="text-sm">{profile}</span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="font-medium">Perfil</DropdownMenuItem>
                                <DropdownMenuItem className="font-medium" onClick={() => logout()}>Sair</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
