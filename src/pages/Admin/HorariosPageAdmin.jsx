import TimeScheduleView from "@/components/timeSchedule/timeschedule-view";
import React from "react";

function HorariosPageAdmin() {
    return (
        <div className="h-full">
            <h1 className="text-4xl text-blue-600 font-bold">Horários</h1>
            <TimeScheduleView />
        </div>
    );
}

export default HorariosPageAdmin;
