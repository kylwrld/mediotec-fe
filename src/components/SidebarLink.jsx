import React from "react";
import { NavLink } from "react-router-dom";

function SidebarLink({ icon, content, ...props }) {
    const BASE = "inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 "
    const NOT_ACTIVE = BASE + "hover:bg-accent hover:text-accent-foreground h-9 px-4 gap-2 py-6 justify-start rounded-r-none";
    const ACTIVE = BASE + "bg-accent text-accent-foreground h-9 px-4 gap-2 py-6 justify-start rounded-r-none";

    return (
        <NavLink
            className={({ isActive }) =>
                isActive ? "active " + ACTIVE : NOT_ACTIVE
            }
            {...props}
        >
            {icon}
            <span className="">{content}</span>
        </NavLink>
    );
}

export default SidebarLink;
