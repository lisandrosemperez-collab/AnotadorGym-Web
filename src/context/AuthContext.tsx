import { createContext,useState,useContext,useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as authService from "../services/authService";

interface MyTokenPayload{
    role: string;
    unique_name: string;
    email: string;
    nameid: string;
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
    userId: number | null;
    userName: string | null;
    email: string | null;    
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: Props) => {

    const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    userRole: null as string | null,
    userId: null as number | null,
    userName: null as string | null,
    email: null as string | null,
    exp: null as number | null,    
    });

    const setAuthFromToken = (token: string) => {
        
        const decoded = jwtDecode<MyTokenPayload>(token);         
        
        if (decoded.exp * 1000 <= Date.now()) {
            throw new Error("Token expirado");
        }

        setAuth({
            token,
            userRole: decoded.role,
            userId: parseInt(decoded.nameid),
            userName: decoded.unique_name,
            email: decoded.email,
            exp: decoded.exp,              
        });

        console.log("Token decodificado:", decoded);
    }

    useEffect (() => {        
        const storedToken = localStorage.getItem("token");                
        
        if (!storedToken) return;
        
        try{                        
            setAuthFromToken(storedToken);
        }catch (error) {
            console.error("Error decoding token:", error);                
            logoutUser();                
        }
        
    },[]);

    const loginUser = async (userName: string,password: string) => {
        try{
            const data = await authService.login(userName,password);
            const token = data.token;

            if(!data.token) return false;
            
            localStorage.setItem("token", token);
            setAuthFromToken(token);

            return true;            

        }catch (error) {
            console.error(error);
            return false;
        }
    }

    const logoutUser = () => {
        setAuth(prevAuth => ({ ...prevAuth, userRole: null, exp: null, token: null, email: null, userId: null, userName: null }));
        localStorage.removeItem("token");
    }    

    console.log("Auth state:", auth);

    return (
        <AuthContext.Provider value={{ token: auth.token, userRole: auth.userRole, exp: auth.exp, loginUser, logoutUser, userId: auth.userId, userName: auth.userName, email: auth.email}}>            
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
