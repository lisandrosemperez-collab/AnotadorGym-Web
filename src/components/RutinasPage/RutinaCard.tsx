import React from "react";
import type { RutinaDto } from "../../types/RutinaDto";
import { useAuth } from "../../context/AuthContext";
import SemanaItem from "./SemanaItem";
import ProtectedElement from "../Auth/ProtectedElement";

type Props = {
  rutina: RutinaDto;
};

export const RutinaCard = ({ rutina }: Props) => {

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
        <article>
            <header>
                <h2 className="flex flex-row items-center">{rutina.nombre}
                    <span onClick={toggle} className="cursor-pointer ml-2 mr-4 hover:text-var(--color-secondary)">{abierto ? "  ▲" : "  ▼"}</span>
                    <ProtectedElement roleRequired={["Admin"]}>
                        <button onClick={() => handleAction()} className="eliminar-button">🗑️</button>
                    </ProtectedElement>
                    <ProtectedElement roleRequired={["Admin"]}>
                        <button onClick={() => handleAction()} className="eliminar-button">✏️</button>
                    </ProtectedElement>
                </h2>                
            </header>

            <section>
                <p style={{ color: "#666", marginBottom: 10 }}>{rutina.descripcion}</p>
                <p>⏱ {rutina.tiempoPorSesion} min</p>
                <p>🔥 {rutina.dificultad}</p>
                <p>📆 Frecuencia: {rutina.frecuenciaPorGrupo}</p>
            </section>                                        
            
            {abierto && (
                <section className="mt-4">
                    {rutina.semanas?.map(s => (
                        <SemanaItem key={s.rutinaSemanaId} semana={s} rutinaId={rutina.rutinaId}/>
                    ))}
                </section>
            )}
            
        </article>
    );
};

export default RutinaCard;