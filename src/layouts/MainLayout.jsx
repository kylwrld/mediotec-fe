import React from "react";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import MobileNav from "@/components/ui/mobile-nav";
import { BookOpen, CalendarDays, GraduationCap, Megaphone, User, UserRound } from "lucide-react";

const links = [
    { url: "/estudantes", icon: <User />, content: "Estudantes" },
    { url: "/turmas", icon: <UserRound />, content: "Turmas" },
    { url: "/professores", icon: <GraduationCap />, content: "Professores" },
    { url: "/disciplinas", icon: <BookOpen />, content: "Disciplinas" },
    { url: "/avisos", icon: <Megaphone />, content: "Avisos" },
    { url: "/horarios", icon: <CalendarDays />, content: "Horários" },
];

function MainLayout() {
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
