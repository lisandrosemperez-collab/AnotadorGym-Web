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
        <section className="p-4">
            <h1 className="mb-4">Mis Rutinas</h1>
            {rutinas.map(r => (
                <RutinaCard key={r.rutinaId} rutina={r} />
            ))}
        </section>
    );
}

export default rutinasPage;
