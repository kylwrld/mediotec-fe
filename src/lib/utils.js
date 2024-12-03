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
    Object.keys(obj).forEach((key) => key in obj && typeof obj[key] === "undefined" || (obj[key] instanceof FileList && obj[key].length == 0) ? delete obj[key] : null)
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

/**
 *  @param {object} fields
 *  @returns {FormData}
 */
export function appendFieldsUserForm(fields) {
    const form = new FormData();
    for (var key in fields) {
        if (key == "image") {
            if (fields[key].length > 0) {
                const image = fields[key][0]
                form.append(key, image);
            }
        } else if (typeof fields[key] === "object"){
            form.append(key, JSON.stringify(fields[key]));
        } else {
            form.append(key, fields[key])
        };
    }
    return form
}

// maybe there's something better than copying the whole array and changing
// one value
export function changeStateOnEdit(state, setState, row, newStateObj) {
    const fileReader = new FileReader;

    if (newStateObj["image"]) {
        const mergedObj = mergeObjs(state[row.index], newStateObj)
        fileReader.onload = () => {
            const tempObj = {...mergedObj, image: fileReader.result}

            // for some reason changing state[index] directly
            // doesn't work
            const tempList = [...state]
            tempList[row.index] = tempObj

            setState(tempList)
        }
        fileReader.readAsDataURL(newStateObj["image"][0])
    } else {
        const mergedObj = mergeObjs(state[row.index], newStateObj)

        // for some reason changing state[index] directly
        // doesn't work
        const tempList = [...state]
        tempList[row.index] = mergedObj

        setState(tempList)
    }

    // const newState = []
    // for (let stateObj of state) {
    //     if (stateObj.id != row.original.id) {
    //         newState.push(stateObj)
    //     } else if (newStateObj["image"]) {
    //         fileReader.onload = () => {
    //             newState.push({...stateObj, image: fileReader.result})
    //             setState(newState)
    //         }
    //         fileReader.readAsDataURL(newStateObj["image"][0])
    //     } else {
    //         const mergedObj = mergeObjs(stateObj, newStateObj)
    //         newState.push(mergedObj)
    //     }
    // }

    // setState(newState)
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

/**
 * Calculates the difference between two dates
 * @param date1 {Date}
 * @param date2 {Date}
 */
export const dateDiff = (date1, date2) => {
    const diff = date1 - date2;
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7))
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44))
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))

    if (seconds < 60) {
        return seconds == 1 ? "1 segundo" : seconds + " segundos"
    } else if (minutes < 60) {
        return minutes == 1 ? "1 minuto" : minutes + " minutos"
    } else if (hours < 25) {
        return hours == 1 ? "1 hora" : hours + " horas"
    } else if (days < 8) {
        return days == 1 ? "1 dia" : days + " dias"
    } else if (weeks < 31) {
        return weeks == 1 ? "1 semana" : weeks + " semanas"
    } else if (months < 13) {
        return months == 1 ? "1 mês" : months + " meses"
    }

    return years == 1 ?  "1 ano" : years + " anos"
}
