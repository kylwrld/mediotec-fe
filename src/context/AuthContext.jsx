import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState } from "react";

const BACKEND_API_URL = "https://mediotec-be.onrender.com/"
// const BACKEND_API_URL = "http://127.0.0.1:8000/"

const AuthContext = createContext();
const useAuthContext = () => useContext(AuthContext);
export default AuthContext;

export function AuthProvider({ children }) {
    const [tokens, setTokens] = useState(
        localStorage.getItem("tokens")
            ? JSON.parse(localStorage.getItem("tokens"))
            : null
    );

    async function postRequest(url, obj, stringify=true, json=true) {
        const headers = json ? {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + tokens.access
        } : {
            "Authorization": "Bearer " + tokens.access
        }

        const res = await fetch(BACKEND_API_URL + url, {
            method: "POST",
            headers,
            body: stringify ? JSON.stringify(obj) : obj,
        });

        if (res.status === 401) {
            logout()
        }

        return res
    }

    async function getRequest(url) {
        const res = await fetch(BACKEND_API_URL + url, {
            method: "GET",
            headers: { "Authorization": "Bearer " + tokens.access },
        });

        if (res.status === 401) {
            logout()
        }

        return res
    }

    async function deleteRequest(url) {
        const res = await fetch(BACKEND_API_URL + url, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + tokens.access },
        });

        if (res.status === 401) {
            logout()
        }

        return res
    }

    async function putRequest(url, obj, stringify=true, json=true) {
        const headers = json ? {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + tokens.access
        } : {
            "Authorization": "Bearer " + tokens.access
        }


        const res = await fetch(BACKEND_API_URL + url, {
            method: "PUT",
            headers,
            body: stringify ? JSON.stringify(obj) : obj,
        });

        if (res.status === 401) {
            logout()
        }

        return res
    }

    async function postLogin(userObject) {
        const res = await fetch(BACKEND_API_URL + "login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userObject),
        });

        const data = await res.json();

        if (res.ok) {
            setTokens(data);
            localStorage.setItem("tokens", JSON.stringify(data));
        }

        return res;
    }

    async function logout() {
        localStorage.removeItem("tokens");
        setTokens(null);
    }

    function decodeToken() {
        try {
            return jwtDecode(JSON.stringify(tokens))
        } catch {
            return null
        }
    }

    const context = {
        tokens,
        decodeToken,
        postRequest,
        postLogin,
        getRequest,
        deleteRequest,
        putRequest,
        logout,
    };

    return (
        <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
    );
}
