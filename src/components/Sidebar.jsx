import React from "react";
import { NavLink } from "react-router-dom";
import {
    UserIcon,
    UsersRoundIcon,
    GraduationCapIcon,
    CalendarDaysIcon,
    MegaphoneIcon,
    FileChartColumnIcon,
} from "lucide-react";

import SidebarLink from "./SidebarLink";

function Sidebar() {
    return (
        <div className="flex flex-col h-full w-18 md:w-72 bg-blue-600 text-white">
            <div className="flex justify-center items-center h-24 hidden md:flex">
                <img className="" src="\src\assets\mediotec (6).svg" alt="" />
            </div>
            <div className="flex flex-col w-full pl-5 pt-16">
                <SidebarLink to="/estudantes" icon={<UserIcon/>} content={"Estudantes"}/>
                <SidebarLink to="/turmas" icon={<UsersRoundIcon/>} content={"Turmas"} />
                <SidebarLink to="/professores" icon={<GraduationCapIcon/>} content={"Professores"}/>
                <SidebarLink to="/horarios" icon={<CalendarDaysIcon/>} content={"Horários"}/>
                <SidebarLink to="/avisos" icon={<MegaphoneIcon/>} content={"Avisos"}/>
                <SidebarLink to="/faltas" icon={<FileChartColumnIcon/>} content={"Faltas"}/>
            </div>
        </div>
    );
}

export default Sidebar;
