import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";

const AuthContext = createContext();
export default AuthContext;

export function AuthProvider({ children }) {
    const [tokens, setTokens] = useState(
        localStorage.getItem("tokens")
            ? JSON.parse(localStorage.getItem("tokens"))
            : null
    );

    async function postRequest(url, obj) {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + tokens.access
            },
            body: JSON.stringify(obj),
        });

        if (res.status === 401) {
            logout()
        }

        return res
    }

    async function getRequest(url) {
        const res = await fetch(url, {
            method: "GET",
            headers: { "Authorization": "Bearer " + tokens.access },
        });

        if (res.status === 401) {
            logout()
        }

        return res
    }

    async function deleteRequest(url) {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + tokens.access },
        });

        if (res.status === 401) {
            logout()
        }

        return res
    }

    async function patchRequest(url, obj) {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + tokens.access
            },
            body: JSON.stringify(obj),
        });

        if (res.status === 401) {
            logout()
        }

        return res
    }

    async function postLogin(userObject) {
        const res = await fetch("https://mediotec-fe.onrender.com/login/", {
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
        patchRequest,
        logout,
    };

    return (
        <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
    );
}
