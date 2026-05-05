import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const loginPage = () => {
    const { loginUser, token, exp } = useAuth();    
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
               document.title = "Iniciar Sesión - GymApp";
        if (token && exp && exp * 1000 > Date.now()) {                                                    
            navigate("/rutinas");
        }
    },[token, exp]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {        
            const isLogged = await loginUser(userName, password);
            if (isLogged) {
                navigate("/rutinas");
            }else{
                setError("Credenciales incorrectas");
            }
        }catch {
            setError("Credenciales incorrectas");            
        }finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
                <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2> 
            <div className="flex items-center justify-center shadow-lg p-8 max-w-md">                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">                
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Email</label>
                        <input 
                            className="focus:ring-2 focus:ring-blue-500 outline-none"
                            value={userName} 
                            onChange={e => setUserName(e.target.value)} 
                            type="username" 
                            placeholder="correo@ejemplo.com" 
                            required 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Contraseña</label>
                        <input 
                            className="focus:ring-2 focus:ring-blue-500 outline-none"
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="w-full py-3" disabled={loading}>{loading ? "Cargando..." : "Iniciar Sesión"}</button>                        

                        {/* BOTÓN DE INVITADO */}
                        <div className="relative flex items-center py-2">
                            <div className="grow border-t border-gray-300"></div>
                            <span className="shrink mx-4 text-gray-400 text-sm">o</span>
                            <div className="grow border-t border-gray-300"></div>
                        </div>

                        <button 
                            type="button" // IMPORTANTE: type="button" para que no dispare el submit del form por error
                            onClick={() => {
                                setUserName("Invitado");
                                setPassword("Invitado");
                            }}
                            className="w-full py-2 border-2 border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                            Probar como Invitado
                        </button>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
        </main>
    );
}

export default loginPage;


