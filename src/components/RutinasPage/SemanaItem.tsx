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
        <article className="mx-auto w-full max-w-4xl text-center">
            <header className="mb-2 flex flex-wrap items-center justify-center gap-3">
                <h3>Semana {semana.numeroSemana}</h3>
                <button
                    type="button"
                    aria-expanded={abierto}
                    aria-label={abierto ? "Contraer semana" : "Expandir semana"}
                    className="training-button-secondary inline-flex h-8 w-8 items-center justify-center border p-0 text-sm"
                    onClick={toggle}
                >
                    {abierto ? "▲" : "▼"}
                </button>
            </header>

            {abierto && (
            <section className="mx-auto mt-4 flex w-full flex-col items-center gap-4">                                       
                {semana.dias?.map(d => (
                    <DiaItem key={d.rutinaDiaId} dia={d} rutinaId={rutinaId} />
                ))}
            </section>)}
        </article>
    );
}

export default SemanaItem;