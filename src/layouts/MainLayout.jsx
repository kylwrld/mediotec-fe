import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/ui/mobile-nav";
import AuthContext from "@/context/AuthContext";
import { BookOpen, CalendarDays, GraduationCap, Megaphone, UserRound, UsersRound } from "lucide-react";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

const linksAdmin = [
    { url: "/estudantes", icon: <UserRound />, content: "Estudantes" },
    { url: "/turmas", icon: <UsersRound />, content: "Turmas" },
    { url: "/professores", icon: <GraduationCap />, content: "Professores" },
    { url: "/disciplinas", icon: <BookOpen />, content: "Disciplinas" },
    { url: "/avisos", icon: <Megaphone />, content: "Avisos" },
];

const linksTeacher = [
    { url: "/estudantes", icon: <UserRound />, content: "Estudantes" },
    { url: "/turmas", icon: <UsersRound />, content: "Turmas" },
    { url: "/avisos", icon: <Megaphone />, content: "Avisos" },
];

function MainLayout() {
    const { decodeToken } = useContext(AuthContext);
    const user = decodeToken()

    const links = user.type == "ADMIN" ? linksAdmin : linksTeacher

    return (
        <>
            <header className="w-full h-16 flex items-center p-4 md:hidden fixed z-50">
                <MobileNav links={links} />
            </header>
            <div className="flex h-full">
                <div className="flex h-full hidden md:flex">
                    <Sidebar links={links} />
                </div>
                <div className="px-4 md:px-8 pt-7 w-full mt-10 md:mt-0 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default MainLayout;
