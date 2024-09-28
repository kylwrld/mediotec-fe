import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";

function TeacherOrAdminRoute() {
    const { decodeToken } = useContext(AuthContext);
    const user = decodeToken()
    return user?.type == "TEACHER" || user?.type == "ADMIN" ? <Outlet /> : <Navigate to="/login"/>
}

export default TeacherOrAdminRoute;
