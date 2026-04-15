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

        if (!response.ok) throw new Error("Error en la petición");

        return response.json();    
    };
    return { callApi };
}

