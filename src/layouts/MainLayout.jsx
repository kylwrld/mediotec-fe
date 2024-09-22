import React from "react";
import Sidebar from "@/components/Sidebar"
import {Outlet} from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import MobileNav from "@/components/ui/mobile-nav";

function MainLayout() {
    return (
        <>
            <header className="w-full h-16 flex items-center p-4 md:hidden fixed">
                <MobileNav />
            </header>
            <div className="flex flex-col h-full">
                <div className="flex h-full">
                    <div className="flex h-full hidden md:block">
                        <Sidebar />
                    </div>
                    {/* <ScrollArea> */}
                    <div className="px-4 md:px-8 pt-7 w-full mt-10">
                        <Outlet />
                    </div>
                    {/* </ScrollArea> */}
                </div>
            </div>
        </>
    );
}

export default MainLayout;
