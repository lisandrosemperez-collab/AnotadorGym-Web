import { createContext,useState,useContext,useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as authService from "../services/authService";

interface MyTokenPayload{
    role: string;
    unique_name: string;
    exp: number;
}

type Props = {
    children: React.ReactNode
}

type AuthContextType = {
    token: string | null;
    userRole: string | null;
    exp: number | null;    
    loginUser: (userName: string, password: string) => Promise<boolean>;
    logoutUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: Props) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userRole, setUserRole] = useState<string | null>(null);
    const [exp, setExp] = useState<number | null>(null);

    useEffect (() => {        
        if (token) {
            try {
                const decoded = jwtDecode<MyTokenPayload>(token);
                console.log("Token decodificado completo:", decoded);
                setUserRole(decoded.role);
                setExp(decoded.exp);

            } catch (error) {
                console.error("Error al decodificar el token:", error);
                logoutUser();
            }
        }
    },[token]);


    const loginUser = async (userName: string,password: string) => {
        try{

            const data = await authService.login(userName,password);
            const token = data.token;
            if (token) {
                localStorage.setItem("token", token);
                setToken(token);
                return true;
            }
            return false;
        }catch (error) {
            console.error(error);
            return false;
        }
    }

    const logoutUser = () => {
        setUserRole(null);
        setExp(null);
        setToken(null);
        localStorage.removeItem("token");
    }    

    return (
    <AuthContext.Provider value={{ token,userRole,exp, loginUser, logoutUser}}>
        {children}
    </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};