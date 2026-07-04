import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, type ReactNode } from "react";

interface Props{
    children: ReactNode;
    roleRequired: string[];
}

const ProtectedElement = ({ children, roleRequired }: Props) => {

    const { token, userRole } = useAuth();
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();
    
    const handleAction = (e: React.MouseEvent) => {                        
        if (!token) {
            e.preventDefault();
            e.stopPropagation();
            navigate("/login");
            return;
        }

        if (roleRequired && !roleRequired.includes(userRole ?? "")) {
            e.preventDefault();
            e.stopPropagation();
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            console.error(`¡ACCESO DENEGADO! Requerido: ${roleRequired}, Tenés: ${userRole}`);
            return;
        }
    }

    return(
        <div onClickCapture={handleAction} className="relative">
            {children}
            {showAlert && 
            (
                <div 
                    className="absolute z-index[100] top-[110%] left-1/2 -translate-x-1/2 bg-red-600 text-white text-[14px] font-bold py-1 px-2 rounded shadow-2xl whitespace-nowrap animate-bounce"
                    style={{ pointerEvents: 'none' }}>
                    (¡ACCESO DENEGADO! Requerido: {roleRequired}, Tenés: {userRole})
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-red-600"></div>
                </div>
            )}
        </div>
    )    
}

export default ProtectedElement;
