import { NavLink, useNavigate } from "react-router-dom";
import appicon from "../assets/appicon.svg";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";
import ProtectedElement from "./Auth/ProtectedElement";

export const TabBar = () => {
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { userName, logoutUser } = useAuth();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <nav className="nav-bar grid w-full grid-cols-1 gap-3 p-3 lg:grid-cols-[minmax(12rem,1fr)_auto_minmax(12rem,1fr)] lg:items-center lg:gap-6 lg:px-6 lg:py-3">
            <div className="flex min-w-0 items-center justify-between gap-3 lg:contents">
                <div className="flex min-w-0 items-center gap-3 lg:col-start-1">
                    <img
                        src={appicon}
                        alt=""
                        className="h-7 w-7 shrink-0 rounded-full object-cover"
                    />
                    <h4 className="whitespace-nowrap text-base font-semibold">
                        AnotadorGym
                    </h4>
                </div>

                <div className="flex min-w-0 items-center justify-end gap-2 text-right text-xs lg:col-start-3">
                    <div className="flex min-w-0 flex-col items-end">
                        <span className="max-w-[38vw] break-words text-sm font-semibold sm:max-w-48">
                            {userName ?? "Usuario"}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="shrink-0 rounded-md border border-red-300 px-2 py-1 text-[11px] font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                    >
                        Salir
                    </button>
                </div>
            </div>

            <ul className="m-0 grid w-full list-none grid-cols-3 gap-2 p-0 sm:grid-cols-6 lg:col-start-2 lg:row-start-1 lg:flex lg:w-auto lg:justify-center lg:gap-4">
                <li className="min-w-0">
                    <NavLink to="/ejercicios" className={({ isActive }) => `nav-item w-full min-w-0 justify-center rounded-md px-1 py-2 text-center lg:min-w-[4.5rem] ${isActive ? "active" : ""}`}>
                        <span>🏋️</span>
                        <h4 className="break-words text-xs font-medium">Ejercicios</h4>
                    </NavLink>
                </li>

                <li className="min-w-0">
                    <NavLink to="/rutinas" className={({ isActive }) => `nav-item w-full min-w-0 justify-center rounded-md px-1 py-2 text-center lg:min-w-[4.5rem] ${isActive ? "active" : ""}`}>
                        <span>📋</span>
                        <h4 className="break-words text-xs font-medium">Rutinas</h4>
                    </NavLink>
                </li>

                <li className="min-w-0">
                    <NavLink to="/estadisticas" className={({ isActive }) => `nav-item w-full min-w-0 justify-center rounded-md px-1 py-2 text-center lg:min-w-[4.5rem] ${isActive ? "active" : ""}`}>
                        <span>📈</span>
                        <h4 className="break-words text-xs font-medium">Estadísticas</h4>
                    </NavLink>
                </li>

                <li className="min-w-0">
                    <ProtectedElement roleRequired={["Usuario", "Admin"]}>
                        <NavLink to="/entrenamiento" className={({ isActive }) => `nav-item w-full min-w-0 justify-center rounded-md px-1 py-2 text-center lg:min-w-[4.5rem] ${isActive ? "active" : ""}`}>
                            <span>💪</span>
                            <h4 className="break-words text-xs font-medium">Entrenamiento</h4>
                        </NavLink>
                    </ProtectedElement>
                </li>

                <li className="min-w-0">
                    <ProtectedElement roleRequired={["Admin"]}>
                        <NavLink to="/importar-rutinas" className={({ isActive }) => `nav-item w-full min-w-0 justify-center rounded-md px-1 py-2 text-center lg:min-w-[4.5rem] ${isActive ? "active" : ""}`}>
                            <span>📤</span>
                            <h4 className="break-words text-xs font-medium">Importar</h4>
                        </NavLink>
                    </ProtectedElement>
                </li>

                <li className="min-w-0">
                    <button onClick={toggleTheme} className="nav-item w-full min-w-0 cursor-pointer justify-center rounded-md border-none px-1 py-2 text-center lg:min-w-[4.5rem]">
                        <span>{dark ? "🌞" : "🌙"}</span>
                        <h4 className="break-words text-xs font-medium">Tema</h4>
                    </button>
                </li>
            </ul>
        </nav>

    );
}

