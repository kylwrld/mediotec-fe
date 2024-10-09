import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function OnlyAdminRoute() {
    const { decodeToken } = useContext(AuthContext);
    const user = decodeToken()
    return user?.type == "ADMIN" ? <Outlet /> : <Navigate to="/estudantes"/>
}

export default OnlyAdminRoute;
