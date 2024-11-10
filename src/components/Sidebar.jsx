import { CircleUser } from "lucide-react";
import { useContext } from "react";

import AuthContext from "@/context/AuthContext";
import SidebarLink from "./SidebarLink";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Sidebar({ links }) {
    const { decodeToken, logout } = useContext(AuthContext);
    const user = decodeToken();
    const profile = user?.type == "ADMIN" ? "Coordenação" : "Professor";

    return (
        <aside className="flex flex-col h-full w-60 lg:w-72 bg-blue-600 text-white">
            <div className="flex justify-center items-center h-24 hidden md:flex">
                <img className="" src="https://i.ibb.co/8D6k8Bg/mediotec-branca.png" alt="Logo branca do Mediotec" />
                {/* <img src="\src\assets\mediotec-mobile.webp" className="w-2/4 pt-6" alt="Logo do Mediotec" /> */}
            </div>
            <div className="flex flex-col justify-between h-full">
                <nav className="flex flex-col w-full pl-5 pt-16 gap-2">
                    {links.map((link, index) => (
                        <SidebarLink key={index} to={link.url} icon={link.icon} content={link.content} />
                    ))}
                </nav>
                <div className="flex pl-5 mb-2 gap-2">
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
                            <DropdownMenuItem className="font-medium" onClick={() => logout()}>
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
