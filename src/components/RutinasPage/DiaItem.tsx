import type { RutinaDiaDto } from "../../types/RutinaDto";
import EjercicioItem from "./EjercicioItem";

type Props = {
    dia: RutinaDiaDto
}

const DiaItem = ({dia} : Props) => {
    return (
        <article>      
            <header>
                <h5>📅 Día {dia.numeroDia}</h5>
            </header>

            <section className="mt-4">
                {dia.ejercicios?.map(e => (
                    <EjercicioItem key={e.rutinaEjercicioId} rutinaEjercicio={e} />
                ))}
            </section>

        </article>
    );
}

export default DiaItem;