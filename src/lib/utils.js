import AuthContext from "@/context/AuthContext";
import { clsx } from "clsx";
import { useContext } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

export function mergeLists(first_list, second_list) {
    return first_list.map(first_list_item => {
        const found = second_list.find(item => item.teacher_subject.subject.name === first_list_item.teacher_subject.subject.name);
        return found ? found : first_list_item
    });
}
