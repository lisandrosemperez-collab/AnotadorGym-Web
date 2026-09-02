import type { FC } from "react";
import type { EntrenamientoDTO } from "../../types/EntrenamientoDto";
import type { RutinaDto } from "../../types/RutinaDto";

interface EntrenamientoHeaderProps {
    rutina: RutinaDto;
    entrenamiento: EntrenamientoDTO;
}

const formatearDuracion = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);

    if (horas > 0) {
        return `${horas} h ${minutos} min`;
    }

    return `${minutos} min`;
};

const EntrenamientoHeader: FC<EntrenamientoHeaderProps> = ({
    rutina,
    entrenamiento,}) => {
    
        const ejerciciosCompletados =
        entrenamiento.ejercicios.filter(
            x => x.completado
        ).length;

    const totalEjercicios =
        entrenamiento.ejercicios.length;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border">

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {rutina.nombre}
                    </h1>

                    <p className="text-gray-600 mt-2">
                        {rutina.descripcion}
                    </p>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        entrenamiento.completado
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {entrenamiento.completado
                        ? "Completado"
                        : "En curso"}
                </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">

                <div>
                    <p className="text-gray-500 text-sm">
                        Duración
                    </p>

                    <p className="font-semibold">
                        {formatearDuracion(
                            entrenamiento.duracionSegundos ?? 0
                        )}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">
                        Ejercicios
                    </p>

                    <p className="font-semibold">
                        {totalEjercicios}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">
                        Fecha
                    </p>

                    <p className="font-semibold">
                        {new Date(
                            entrenamiento.fecha
                        ).toLocaleDateString("es-AR")}
                    </p>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">
                        Progreso
                    </p>

                    <p className="font-semibold">
                        {ejerciciosCompletados}/{totalEjercicios}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default EntrenamientoHeader;