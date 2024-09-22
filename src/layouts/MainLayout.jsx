import React from "react";
import Sidebar from "@/components/Sidebar"
import {Outlet} from 'react-router-dom';

function MainLayout() {
    return (
    <div className="flex h-full">
        <div className="flex h-full">
            <Sidebar />
        </div>
        <div className="px-8 pt-7 w-full">
            <Outlet />
        </div>
    </div>
    );
}

export default MainLayout;
