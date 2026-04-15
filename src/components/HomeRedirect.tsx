import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomeRedirect = () => {
    const { token } = useAuth();

    if (token) {
        return <Navigate to="/login"/>;
    }

    return <Navigate to="/ejercicios"/>;
}

export default HomeRedirect;