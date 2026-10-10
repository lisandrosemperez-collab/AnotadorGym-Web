import React from "react";
import type { RutinaDto } from "../../types/RutinaDto";
import { useAuth } from "../../context/AuthContext";
import SemanaItem from "./SemanaItem";
import ProtectedElement from "../Auth/ProtectedElement";
import { useNavigate } from "react-router-dom";

type Props = {
  rutina: RutinaDto;
};

export const RutinaCard = ({ rutina }: Props) => {

    const navigate = useNavigate();
    const { userRole } = useAuth();
    const [abierto, setAbierto] = React.useState(false);    

    const handleAction = () => {
        console.log("Validando rol antes de ejecutar:", userRole);

        if (!userRole) {
            alert("Cargando permisos... intenta de nuevo en un segundo.");
            return;
        }

        if (userRole === "Invitado") {            
            alert("⚠️ Función exclusiva para Administradores.");
        } else {
        }
    };

    const toggle = () => { setAbierto(!abierto) }

    return (
        <article className="mx-auto w-full max-w-5xl text-center">
            <header className="flex flex-col items-center gap-3">
                <div className="flex w-full flex-wrap items-center justify-center gap-4">
                    <div className="flex min-w-0 items-center justify-center gap-2">
                        <h2 className="break-words">{rutina.nombre}</h2>
                        <button
                            type="button"
                            aria-expanded={abierto}
                            aria-label={abierto ? "Contraer rutina" : "Expandir rutina"}
                            onClick={toggle}
                            className="training-button-secondary inline-flex h-8 w-8 shrink-0 items-center justify-center border p-0 text-sm"
                        >
                            {abierto ? "▲" : "▼"}
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(`/entrenamiento?rutinaId=${rutina.rutinaId}`)}
                            className="training-button-primary whitespace-nowrap px-3 py-2 text-sm"
                        >
                            Iniciar rutina
                        </button>
                        <ProtectedElement roleRequired={["Admin"]}>
                            <button type="button" onClick={() => handleAction()} className="eliminar-button">🗑️</button>
                        </ProtectedElement>
                        <ProtectedElement roleRequired={["Admin"]}>
                            <button type="button" onClick={() => handleAction()} className="eliminar-button">✏️</button>
                        </ProtectedElement>
                    </div>
                </div>
            </header>

            <section className="mt-4 flex flex-col items-center text-center">
                <p className="mb-2">{rutina.descripcion}</p>
                <p>⏱ {rutina.tiempoPorSesion} min</p>
                <p>🔥 {rutina.dificultad}</p>
                <p>📆 Frecuencia: {rutina.frecuenciaPorGrupo}</p>
            </section>                                        
            
            {abierto && (
                <section className="mx-auto mt-4 w-full space-y-4">
                    {rutina.semanas?.map(s => (
                        <SemanaItem key={s.rutinaSemanaId} semana={s} rutinaId={rutina.rutinaId}/>
                    ))}
                </section>
            )}
            
        </article>
    );
};

export default RutinaCard;