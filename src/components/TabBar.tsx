import { NavLink } from "react-router-dom";
import appicon from "../assets/appicon.svg";
import { useTheme } from "../hooks/useTheme";
import ProtectedElement from "./Auth/ProtectedElement";

export const TabBar = () => {
    const { dark, toggleTheme } = useTheme();                  

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

                <li className="relative flex items-center justify-center">
                    <ProtectedElement roleRequired="Admin">
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

