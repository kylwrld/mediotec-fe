import React from "react";
import {
    User,
    UsersRound,
    GraduationCap,
    CalendarDays,
    Megaphone,
    FileChartColumn,
} from "lucide-react";

import SidebarLink from "./SidebarLink";

function Sidebar() {
    return (
        <aside className="flex flex-col h-full w-60 lg:w-72 bg-blue-600 text-white">
            <div className="flex justify-center items-center h-24 hidden md:flex">
                <img className="" src="\src\assets\mediotec (6).svg" alt="" />
            </div>
            <div className="flex flex-col w-full pl-5 pt-16">
                <SidebarLink to="/estudantes" icon={<User/>} content={"Estudantes"}/>
                <SidebarLink to="/turmas" icon={<UsersRound/>} content={"Turmas"} />
                <SidebarLink to="/professores" icon={<GraduationCap/>} content={"Professores"}/>
                <SidebarLink to="/horarios" icon={<CalendarDays/>} content={"Horários"}/>
                <SidebarLink to="/avisos" icon={<Megaphone/>} content={"Avisos"}/>
                <SidebarLink to="/faltas" icon={<FileChartColumn/>} content={"Faltas"}/>
            </div>
        </aside>
    );
}

export default Sidebar;
