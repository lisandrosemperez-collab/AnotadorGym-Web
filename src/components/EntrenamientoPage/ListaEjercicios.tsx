import type { FC } from "react";
import { useState } from "react";
import type { EjercicioEntrenadoDTO } from "../../types/EntrenamientoDto";
import ListaEjercicioDetalle from "./ListaEjercicioDetalle";

interface ListaEjerciciosProps {
    ejercicios: EjercicioEntrenadoDTO[];    
    onSeleccionarEjercicio: (index: number) => void;
}

const ListaEjercicios: FC<ListaEjerciciosProps> = ({
    ejercicios
}) => {

    const [ejercicioExpandido, setEjercicioExpandido] =
        useState<number | null>(null);

    const toggleEjercicio = (index: number) => {
        setEjercicioExpandido(
            ejercicioExpandido === index
                ? null
                : index
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5">

            <h2 className="text-xl font-semibold mb-4">
                Ejercicios
            </h2>

            <div className="space-y-3">

                {ejercicios.map((ejercicio, index) => {

                    const expandido =
                        ejercicioExpandido === index;

                    const seriesCompletadas =
                        ejercicio.series?.filter(
                            serie => serie.completada
                        ).length ?? 0;

                    const totalSeries =
                        ejercicio.series?.length ?? 0;

                    return (
                        <div
                            key={
                                ejercicio.ejercicioEntrenadoId ??
                                `${ejercicio.ejercicioId}-${index}`
                            }
                            className="border rounded-lg overflow-hidden"
                        >

                            {/* Encabezado del ejercicio */}
                            <button
                                type="button"
                                onClick={() =>
                                    toggleEjercicio(index)
                                }
                                className="
                                    w-full
                                    flex
                                    items-center
                                    justify-between
                                    p-4
                                    text-left
                                    hover:bg-gray-50
                                    transition
                                "
                            >

                                <div>
                                    <p className="font-semibold">
                                        {ejercicio.ejercicioId}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {seriesCompletadas}
                                        /
                                        {totalSeries}
                                        {" "}
                                        series completadas
                                    </p>
                                </div>

                                <span className="text-gray-400">
                                    {expandido ? "▲" : "▼"}
                                </span>

                            </button>

                            {/* Detalle expandible */}
                            {expandido && (
                                <div className="border-t">
                                    <ListaEjercicioDetalle
                                        ejercicio={ejercicio}                                        
                                    />
                                </div>
                            )}

                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default ListaEjercicios;