import type { FC } from "react";
import type { EjercicioEntrenadoDTO } from "../../types/EntrenamientoDto";

interface EjercicioActualCardProps {
    ejercicio: EjercicioEntrenadoDTO | null;

    acciones: {
        completarSerie: (numeroSerie: number) => void;
        eliminarSerie: (numeroSerie: number) => void;
        agregarSerie: () => void;
        cambiarPeso: (numeroSerie: number, peso: number) => void;
        cambiarRepeticiones: (
            numeroSerie: number,
            repeticiones: number
        ) => void;
    };
}

const EjercicioActualCard: FC<EjercicioActualCardProps> = ({
    ejercicio,
    acciones
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border">

            <h2 className="text-2xl font-bold">
                {ejercicio?.Ejercicio.nombre}
            </h2>

            <p className="text-gray-500 mt-2">
                {ejercicio?.Ejercicio.descripcion}
            </p>

            <div className="mt-6 space-y-4">

                {ejercicio?.series.map((serie) => (

                    <div
                        key={serie.numeroSerie}
                        className="border rounded-lg p-4 flex items-center gap-4"
                    >

                        <div className="font-bold w-20">
                            Serie {serie.numeroSerie}
                        </div>

                        <input
                            type="number"
                            className="border rounded p-2 w-24"
                            value={serie.peso}
                            onChange={(e) =>
                                acciones.cambiarPeso(
                                    serie.numeroSerie,
                                    Number(e.target.value)
                                )
                            }
                        />

                        <span>kg</span>

                        <input
                            type="number"
                            className="border rounded p-2 w-20"
                            value={serie.repeticiones}
                            onChange={(e) =>
                                acciones.cambiarRepeticiones(
                                    serie.numeroSerie,
                                    Number(e.target.value)
                                )
                            }
                        />

                        <span>reps</span>

                        <button
                            className={`px-4 py-2 rounded
                                ${
                                    serie.completada
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-200"
                                }`}
                            onClick={() =>
                                acciones.completarSerie(serie.numeroSerie)
                            }
                        >
                            ✓
                        </button>

                        <button
                            className="text-red-600"
                            onClick={() =>
                                acciones.eliminarSerie(serie.numeroSerie)
                            }
                        >
                            Eliminar
                        </button>

                    </div>

                ))}

            </div>

            <button
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
                onClick={acciones.agregarSerie}
            >
                Agregar serie
            </button>

        </div>
    );
};

export default EjercicioActualCard;