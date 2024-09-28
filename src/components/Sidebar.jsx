import {
    CalendarDays,
    CircleUser,
    FileChartColumn,
    GraduationCap,
    Megaphone,
    User,
    UsersRound,
} from "lucide-react";
import { useContext } from "react";

import AuthContext from "@/context/AuthContext";
import SidebarLink from "./SidebarLink";

function Sidebar() {
    const { decodeToken, logout } = useContext(AuthContext);
    const user = decodeToken();
    const profile =
        user.type == "ADMIN"
            ? "Coordenação"
            : "Professor"

    return (
        <aside className="flex flex-col h-full w-60 lg:w-72 bg-blue-600 text-white">
            <div className="flex justify-center items-center h-24 hidden md:flex">
                <img className="" src="\src\assets\mediotec (6).svg" alt="" />
            </div>
            <div className="flex flex-col justify-between h-full">
                <nav className="flex flex-col w-full pl-5 pt-16 gap-2">
                    <SidebarLink
                        to="/estudantes"
                        icon={<User />}
                        content={"Estudantes"}
                    />
                    <SidebarLink
                        to="/turmas"
                        icon={<UsersRound />}
                        content={"Turmas"}
                    />
                    <SidebarLink
                        to="/professores"
                        icon={<GraduationCap />}
                        content={"Professores"}
                    />
                    <SidebarLink
                        to="/avisos"
                        icon={<Megaphone />}
                        content={"Avisos"}
                    />
                    <SidebarLink
                        to="/faltas"
                        icon={<FileChartColumn />}
                        content={"Faltas"}
                    />
                    <SidebarLink
                        to="/horarios"
                        icon={<CalendarDays />}
                        content={"Horários"}
                    />
                </nav>
                <div className="flex pl-5 mb-2 gap-2">
                    <div className="flex justify-center items-center py-6 px-4 gap-2">
                        <CircleUser />
                        <span className="text-sm">{profile}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
