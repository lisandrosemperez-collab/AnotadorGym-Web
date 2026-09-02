import type { FC } from "react";
import type { RutinaDto } from "../../types/RutinaDto";

interface SelectorSemanaDiaProps {
    rutina: RutinaDto;
    onSeleccionarDia: (diaId: number) => void;
}

const SelectorSemanaDia: FC<SelectorSemanaDiaProps> = ({
    rutina,
    onSeleccionarDia,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border space-y-6">

            <div>
                <h2 className="text-xl font-bold text-gray-900">
                    Seleccioná qué día entrenar
                </h2>

                <p className="text-gray-500 mt-1">
                    Elegí un día de la rutina para comenzar el entrenamiento.
                </p>
            </div>

            {rutina.semanas.length > 0 ? (
                rutina.semanas.map((semana) => (
                    <div key={semana.rutinaSemanaId}>

                        <h3 className="font-semibold text-lg mb-3">
                            Semana {semana.numeroSemana}
                        </h3>

                        {semana.dias.length > 0 ? (
                            <div className="flex flex-col gap-2">

                                {semana.dias.map((dia) => (
                                    <div
                                        key={dia.rutinaDiaId}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">
                                                Día {dia.numeroDia}
                                            </span>

                                            <span className="text-gray-500">
                                                {dia.nombreRutinaDia}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onSeleccionarDia(
                                                    dia.rutinaDiaId
                                                )
                                            }
                                            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                                        >
                                            Entrenar
                                        </button>
                                    </div>
                                ))}

                            </div>
                        ) : (
                            <p className="text-gray-500">
                                No hay días disponibles en esta semana.
                            </p>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">
                    No hay semanas disponibles en esta rutina.
                </p>
            )}

        </div>
    );
};

export default SelectorSemanaDia;