import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function TeacherOrAdminRoute() {
    const { decodeToken } = useContext(AuthContext);
    const user = decodeToken();
    return user?.type == "TEACHER" || user?.type == "ADMIN" ? <Outlet /> : <Navigate to="/login" replace />;
}

export default TeacherOrAdminRoute;
