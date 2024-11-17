import AuthContext from "@/context/AuthContext";
import { clsx } from "clsx";
import { useContext } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// type = '%Y-%m-%d'
export function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

// deprecated
// export function mergeLists(first_list, second_list) {
//     return first_list.map(first_list_item => {
//         const found = second_list.find(item => item.teacher_subject.subject.name === first_list_item.teacher_subject.subject.name);
//         return found ? found : first_list_item
//     });
// }

// merges the first list with the second one
// puts items found in the second list into the first one
// takes a function that compares an element of the second list with the first one
export function mergeLists(first_list, second_list, condition) {
    return first_list.map(first_list_item => {
        const found = second_list.find(item => {
            return condition(item, first_list_item)
        });
        return found ? found : first_list_item
    });
}

export function mergeObjs(first_obj, second_obj) {
    const newObj = {}
    Object.keys(first_obj).map(key => newObj[key] = first_obj[key])
    Object.keys(second_obj).map(key => newObj[key] = second_obj[key])
    return newObj
}

export function deleteUndefinedKeys(obj) {
    Object.keys(obj).forEach((key) => key in obj && typeof obj[key] === "undefined" ? delete obj[key] : null)
    return obj
}



/**
 * given an array of arrays, checks if
 * a value exists in that array
 * @param {Array} arr
 * @param {Array} value
 * @returns {boolean}
 */
export function containsArray(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] == value[0] && arr[i][1] == value[1]) {
            return true
        }
    }
    return false
}


export const MAX_TIMESCHEDULES = 8;
export const SHIFT_MORNING = [
    [7, 0],
    [7, 50],
    [8, 40],
    [10, 0],
    [10, 50],
    [11, 40],
    [12, 30],
    [13, 20],
];
export const SHIFT_AFTERNOON = [
    [13, 40],
    [14, 30],
    [15, 20],
    [16, 40],
    [17, 30],
    [18, 20],
    [19, 10],
    [20, 0],
];
