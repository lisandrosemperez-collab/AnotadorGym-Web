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
        <article>      
            <header>

                <div className="mt-2">
                    <h5>📅 Día {dia.numeroDia}</h5>
                    <span className="text-gray-500">
                            {dia.nombreRutinaDia}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        handleSeleccionarDia()
                    }
                    className="
                        px-4
                        py-2
                        rounded-lg
                        font-medium
                        transition
                        bg-blue-600
                        text-white
                        hover:bg-blue-700
                    "
                    >
                    Entrenar
                </button>
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