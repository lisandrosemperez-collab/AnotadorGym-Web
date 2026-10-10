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
        <div className="training-card rounded-xl shadow-md p-6 border">

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        {rutina.nombre}
                    </h1>

                    <p className="training-card-muted mt-2">
                        {rutina.descripcion}
                    </p>
                </div>

                <span
                        className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold ${
                        entrenamiento.completado
                            ? "training-chip"
                            : "training-item-active border"
                    }`}
                >
                    {entrenamiento.completado
                        ? "Completado"
                        : "En curso"}
                </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">

                <div>
                    <p className="training-card-muted text-sm">
                        Duración
                    </p>

                    <p className="font-semibold">
                        {formatearDuracion(
                            entrenamiento.duracionSegundos ?? 0
                        )}
                    </p>
                </div>

                <div>
                    <p className="training-card-muted text-sm">
                        Ejercicios
                    </p>

                    <p className="font-semibold">
                        {totalEjercicios}
                    </p>
                </div>

                <div>
                    <p className="training-card-muted text-sm">
                        Fecha
                    </p>

                    <p className="font-semibold">
                        {new Date(
                            entrenamiento.fecha
                        ).toLocaleDateString("es-AR")}
                    </p>
                </div>

                <div>
                    <p className="training-card-muted text-sm">
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