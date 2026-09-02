import type { FC } from "react";
import type { EjercicioEntrenadoDTO } from "../../types/EntrenamientoDto";

interface Props {
    ejercicio: EjercicioEntrenadoDTO;    
}

const ListaEjercicioItem: FC<Props> = ({
    ejercicio,    
}) => {        
    return (
        <div className="p-4 space-y-3">

            {ejercicio.series?.map((serie) => (
                <div
                    key={serie.serieEntrenadaId}
                    className="border rounded-lg p-3"
                >
                    <div className="flex justify-between">

                        <span className="font-medium">
                            Serie {serie.numeroSerie}
                        </span>

                        <span>
                            {serie.completada
                                ? "✓ Completada"
                                : "Pendiente"}
                        </span>

                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                        <p>
                            Peso: {serie.peso} kg
                        </p>

                        <p>
                            Repeticiones: {serie.repeticiones}
                        </p>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default ListaEjercicioItem;

