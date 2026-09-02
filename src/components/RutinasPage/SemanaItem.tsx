import type { RutinaSemanaDto } from "../../types/RutinaDto";
import { useState } from "react";
import DiaItem from "./DiaItem";

type Props = {
    semana: RutinaSemanaDto    
    rutinaId?: number;
}

const SemanaItem = ({semana, rutinaId} : Props) => {
    const [abierto, setAbierto] = useState(false);
    const toggle = () => { setAbierto(!abierto) }

    return (
        <article>
            <header className="flex flex-row items-center gap-3 mb-2" onClick={toggle}>
                <h3>Semana {semana.numeroSemana}</h3>
                <span className="cursor-pointer">{abierto ? "▲" : "▼"}</span>
            </header>

            {abierto && (
            <section className="mt-4">                                       
                {semana.dias?.map(d => (
                    <DiaItem key={d.rutinaDiaId} dia={d} rutinaId={rutinaId} />
                ))}
            </section>)}
        </article>
    );
}

export default SemanaItem;