import { useAuth } from "../../context/AuthContext";    
import LoginPage from "../../pages/LoginPage";
import { Navigate } from "react-router-dom";    

const AuthRedirect = () => {
    
    const { token, exp } = useAuth();
    console.log("AuthRedirect", {
    token,
    exp,    
    valid: !!token && !!exp && exp * 1000 > Date.now()
    });    

    if (token && exp && exp * 1000 > Date.now()) {
        return <Navigate to="/rutinas" replace />;
    }
    return <LoginPage />;
}

export default AuthRedirect;