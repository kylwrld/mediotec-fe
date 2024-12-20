import {
    CircleUser,
    Menu
} from "lucide-react";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./custom-sheet";

import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import SidebarLink from "../SidebarLink";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu";
import { useNavigate } from "react-router-dom";

export default function MobileNav({ links }) {
    const { decodeToken, logout } = useContext(AuthContext);
    const user = decodeToken();
    const profile = user?.type == "ADMIN" ? "Coordenação" : "Professor";
    const navigate = useNavigate();

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
                        {links.map((link, index) => (
                            <SidebarLink key={index} to={link.url} icon={link.icon} content={link.content} />
                        ))}
                        {/* <SidebarLink to="/estudantes" icon={<User/>} content={"Estudantes"}/>
                        <SidebarLink to="/turmas" icon={<UsersRound/>} content={"Turmas"} />
                        <SidebarLink to="/professores" icon={<GraduationCap/>} content={"Professores"}/>
                        <SidebarLink to="/horarios" icon={<CalendarDays/>} content={"Horários"}/>
                        <SidebarLink to="/avisos" icon={<Megaphone/>} content={"Avisos"}/>
                        <SidebarLink to="/faltas" icon={<FileChartColumn/>} content={"Faltas"}/> */}
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
                                { user?.type == "TEACHER" ? (<DropdownMenuItem className="font-medium" onClick={() => navigate(`professor/${user.id}`)}>Perfil</DropdownMenuItem>) : null }
                                <DropdownMenuItem className="font-medium" onClick={() => logout()}>
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
