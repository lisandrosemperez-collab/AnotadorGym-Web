import { NavLink, useNavigate } from "react-router-dom";
import appicon from "../assets/appicon.svg";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";
import ProtectedElement from "./Auth/ProtectedElement";

export const TabBar = () => {
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { userName, userId, logoutUser } = useAuth();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <nav className="nav-bar gap-0">            
            <div className="absolute left-6 rounded-full flex flex-row items-center gap-4" >
                <img 
                    src={appicon} 
                    alt="App Icon" 
                    className="object-cover transform scale-140 h-7 w-7 rounded-full"
                    />                
                <h4 className="">AnotadorGym</h4>
            </div>

            <div className="absolute right-6 flex items-center gap-3 text-right text-xs">
                <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">{userName ?? "Usuario"}</span>
                    <small>ID: {userId ?? "-"}</small>
                </div>
                <button
                    onClick={handleLogout}
                    className="rounded-md border border-red-300 px-2 py-1 text-[11px] font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950">
                    Salir
                </button>
            </div>
            
            <ul className="flex flex-row justify-items-center items-end gap-8 list-none m-0 p-0">
                <li>
                    <NavLink to="/ejercicios" className={({isActive}) => `nav-item justify-center ${isActive ? 'active' : ''}`}>
                        <span>🏋️</span>
                        <h4>Ejercicios</h4>
                    </NavLink>
                </li>
                
                <li>
                    <NavLink to="/rutinas" className={({isActive}) => `nav-item justify-center ${isActive ? 'active' : ''}`}>
                        <span>📋</span>
                        <h4>Rutinas</h4>
                    </NavLink>
                </li>

                <li>
                    <ProtectedElement roleRequired={["Usuario", "Admin"]}>
                        <NavLink to="/entrenamiento" className={({isActive}) => `nav-item justify-center ${isActive ? 'active' : ''}`}>
                            <span>💪</span>
                            <h4>Entrenamiento</h4>
                        </NavLink>
                    </ProtectedElement>
                </li>

                <li className="relative flex items-center justify-center">
                    <ProtectedElement roleRequired={["Admin"]}>
                        <NavLink to="/importar-rutinas" className={({isActive}) => `nav-item justify-center ${isActive ? 'active' : ''}`}>
                            <span>📤</span>
                            <h4>Importar</h4>
                        </NavLink>
                    </ProtectedElement>
                </li>

                <li>
                    <button onClick={toggleTheme} className="nav-item border-none cursor-pointer">
                        <span>
                            {dark ? "🌞" : "🌙"}
                        </span>
                        <h4>Tema</h4>
                    </button>                
                </li>
            </ul>
        </nav>

    );
}

