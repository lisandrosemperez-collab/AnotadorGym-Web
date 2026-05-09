import useEjercicio from "../hooks/useEjercicio";
import { useState,useEffect } from "react";
import type { EjercicioDTO } from "../types/EjercicioDto";
import ProtectedElement from "../components/Auth/ProtectedElement";
import { VideoPreview } from "../components/VideoPreview";

const EjerciciosPage = () => {    
    const [ejercicios, setEjercicios] = useState<EjercicioDTO[]>([]);
    const [loading, setLoading] = useState(true);    
    const [error, setError] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState(""); 
    const {getEjercicios,deleteEjercicio,updateEjercicio} = useEjercicio();       

    useEffect(() => {
        const cargarEjercicios = async () => {
            try {                
                setEjercicios(await getEjercicios());
            } catch (err) {
                setError(`Error al cargar los ejercicios: ${err instanceof Error ? err.message : String(err)}`);
            } finally {
                setLoading(false);
            }
        };
        cargarEjercicios();
    },[]);

    const ejerciciosFiltrados = ejercicios.filter(e => 
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())        
    );

    if (loading) {
        return (
        <div className="flex h-[60vh] items-center justify-center">
            <h2 className="animate-pulse font-bold text-var(--color-primary)]">
                Cargando ejercicios...
            </h2>
        </div>
        )
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>            
            <input style={{
                    width: "100%",
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 8,
                    border: "1px solid #ccc"
                }}
                type="text"
                placeholder="Buscar ejercicios..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
            />

            {ejerciciosFiltrados.length === 0 ? (
                <p>No se encontraron ejercicios.</p>
            ) : (                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {ejerciciosFiltrados.map(ejercicio => (
                        <article key={ejercicio.ejercicioId} className="flex flex-col shadow-xl transition-all duration-400">
                            <div className="flex flex-row gap-4">
                                <h3>{ejercicio.nombre}</h3>
                                <ProtectedElement roleRequired="Admin">
                                    <button className="eliminar-button" onClick={async () => await deleteEjercicio(ejercicio.ejercicioId)}>🗑️</button>
                                </ProtectedElement>                                
                                <ProtectedElement roleRequired="Admin">
                                    <button className="eliminar-button" onClick={async () => await updateEjercicio(ejercicio.ejercicioId, { nombre: ejercicio.nombre })}>✏️</button>
                                </ProtectedElement>
                            </div>
                            <p>
                                {ejercicio.grupoMuscular?.nombre}
                            </p>
                            <p>{ejercicio.descripcion}</p>          
                            <VideoPreview
                                url={ejercicio.urlVideo}
                                title={ejercicio.nombre}
                                className="mb-3"
                            />                  
                        </article>
                    ))}
                </div>                
            )}
        </div>
    );
}

export default EjerciciosPage;