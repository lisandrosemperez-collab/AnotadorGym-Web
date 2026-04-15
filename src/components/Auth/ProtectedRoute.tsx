import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
    roleRequired?: string;
}

const ProtectedRoute = ({ children, roleRequired }: ProtectedRouteProps) => {
    const { token, exp,userRole } = useAuth();
    const isExpired = exp ? exp * 1000 < Date.now() : true;

    if (!token || isExpired) {
        return <Navigate to="/login" replace />;
    }

    if(roleRequired && userRole === null) {        
        return <div>Cargando permisos...</div>;
    }

    if (roleRequired && userRole !== roleRequired) {
        console.error(`¡ACCESO DENEGADO! Requerido: ${roleRequired}, Tenés: ${userRole}`);
        return <Navigate to="/rutinas" replace />;
    }

    return children;
}

export default ProtectedRoute;
