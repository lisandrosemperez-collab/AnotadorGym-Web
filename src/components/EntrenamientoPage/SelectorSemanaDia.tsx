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
        <div className="training-card rounded-xl shadow-md p-6 border space-y-6">

            <div>
                <h2 className="text-2xl font-bold">
                    Seleccioná qué día entrenar
                </h2>

                <p className="training-card-muted mt-1">
                    Elegí un día de la rutina para comenzar el entrenamiento.
                </p>
            </div>

            {rutina.semanas.length > 0 ? (
                rutina.semanas.map((semana) => (
                    <div key={semana.rutinaSemanaId}>

                        <h3 className="h3 mb-3">
                            Semana {semana.numeroSemana}
                        </h3>

                        {semana.dias.length > 0 ? (
                            <div className="flex flex-wrap gap-2">

                                {semana.dias.map((dia) => (
                                    <div
                                        key={dia.rutinaDiaId}
                                        className="flex items-center justify-between rounded-lg border px-4 py-3 training-card w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">
                                                Día {dia.numeroDia}
                                            </span>

                                            <span className="training-card-muted">
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
                                            className="px-4 py-2 rounded-lg training-button-primary font-medium hover:opacity-90 transition"
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