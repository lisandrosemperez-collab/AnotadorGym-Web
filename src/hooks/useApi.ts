import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useApi = () => {
    const { token,logoutUser } = useAuth();
    const navigate = useNavigate();    
    const baseUrl = `${import.meta.env.VITE_API_URL}`;
        
    const callApi = async (endpoint: string, options: RequestInit = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        };

        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers,
        });
        
        if (response.status === 401) {                
            logoutUser();
            navigate("/login");
            throw new Error("Sesión expirada");
        }

        // 204 No Content: la operación fue exitosa, pero no hay JSON.
        if (response.status === 204) {
            return undefined;
        }

        
        if (!response.ok) {
            const error = new Error("Error en la petición");
            (error as any).status = response.status;
            throw error;
        }
        
        // Evitar intentar interpretar un cuerpo vacío.
        const text = await response.text();

        if (!text) {
            return undefined;
        }
        return JSON.parse(text);    
    };
    return { callApi };
}

