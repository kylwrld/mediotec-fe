import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";

function Redirect({ teacher, admin }) {
    const { decodeToken } = useContext(AuthContext);
    const user = decodeToken()
    return user?.type == "TEACHER" ? teacher : user?.type == "ADMIN" ? admin : <Navigate to="/login"/>
}

export default Redirect;
