import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registro } from "../services/authService";


const RegistroPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        try {
            const response = await registro(username, email, password);

            if (!response.success) {
                setError(response.message || "No se pudo completar el registro");
                return;
            }

            navigate("/login");
        } catch (err) {
            const message = err instanceof Error ? err.message : "No se pudo completar el registro";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center p-4 min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-6">Crear Cuenta</h2>

            <div className="flex items-center justify-center shadow-lg p-8 max-w-md w-full">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Nombre</label>
                        <input
                            className="focus:ring-2 focus:ring-blue-500 outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Tu nombre"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Email</label>
                        <input
                            className="focus:ring-2 focus:ring-blue-500 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="correo@ejemplo.com"                            
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Contraseña</label>
                        <input
                            className="focus:ring-2 focus:ring-blue-500 outline-none"
                            value={password} minLength={8}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Confirmar contraseña</label>
                        <input
                            className="focus:ring-2 focus:ring-blue-500 outline-none"
                            value={confirmPassword} minLength={8}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full py-3" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>

                    <button
                        type="button"
                        className="w-full py-3 border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => navigate("/login")}
                    >
                        Volver al login
                    </button>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </div>
        </main>
    );
};

export default RegistroPage;
