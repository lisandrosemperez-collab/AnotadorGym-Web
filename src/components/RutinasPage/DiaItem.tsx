import type { RutinaDiaDto } from "../../types/RutinaDto";
import EjercicioItem from "./EjercicioItem";
import { useNavigate } from "react-router-dom";

type Props = {
    dia: RutinaDiaDto    
    rutinaId?: number;    
}

const DiaItem = ({dia, rutinaId} : Props) => {

    const navigate = useNavigate();

    const handleSeleccionarDia = () => {
        if (!rutinaId) return;
        navigate(`/rutinas/${rutinaId}/dias/${dia.rutinaDiaId}`);
    }

    return (
        <article className="mx-auto w-full max-w-3xl text-center">
            <header className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">

                <div className="mt-2 min-w-0 text-center sm:text-left">
                    <h5>📅 Día {dia.numeroDia}</h5>
                    <span className="training-card-muted block break-words text-sm">
                            {dia.nombreRutinaDia}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        handleSeleccionarDia()
                    }
                    className="training-button-primary whitespace-nowrap px-4 py-2 font-medium"
                    >
                    Entrenar
                </button>
            </header>

            <section className="mt-4 flex w-full flex-col items-center gap-3 text-center">
                {dia.ejercicios?.map(e => (
                    <EjercicioItem key={e.rutinaEjercicioId} rutinaEjercicio={e} />
                ))}
            </section>

        </article>
    );
}

export default DiaItem;