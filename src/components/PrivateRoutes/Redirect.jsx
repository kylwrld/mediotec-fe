import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function Redirect({ teacher, admin }) {
    const { decodeToken } = useContext(AuthContext);
    const user = decodeToken();
    return user?.type == "TEACHER" ? teacher : user?.type == "ADMIN" ? admin : <Navigate to="/login" />;
}

export default Redirect;
