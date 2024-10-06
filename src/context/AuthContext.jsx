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

    async function postLogin(userObject) {
        const res = await fetch("http://127.0.0.1:8000/login/", {
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
        postLogin,
        logout,
    };

    return (
        <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
    );
}
