import { useEffect,useState } from "react";
import type { RutinaDto } from "../types/RutinaDto";
import {useRutinas} from "../hooks/useRutina";
import RutinaCard from "../components/RutinasPage/RutinaCard";

const rutinasPage = () => {
    const [rutinas, setRutinas] = useState<RutinaDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const { obtenerRutinas: getRutinas } = useRutinas();

    useEffect(() => {
        getRutinas()
            .then(data => {                
                setRutinas(data);
                setLoading(false);
            })
            .catch(err => {
                setError(`Error al cargar las rutinas: ${err.message}`);
                setLoading(false);
            });
    },[]);

    if (loading) {
        return (
        <div className="flex h-[60vh] items-center justify-center">
            <h2 className="animate-pulse font-bold text-var(--color-primary)]">                
                Cargando rutinas...
            </h2>
        </div>
        )                
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <section className="mx-auto w-full max-w-6xl p-4 text-center">
            <h1 className="mb-4">Mis Rutinas</h1>
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
                {rutinas.map(r => (
                    <RutinaCard key={r.rutinaId} rutina={r} />
                ))}
            </div>
        </section>
    );
}

export default rutinasPage;
