import type { FC } from "react";
import type { EjercicioEntrenadoDTO } from "../../types/EntrenamientoDto";

interface Props {
    ejercicio: EjercicioEntrenadoDTO;
    onCompletarSerie: (numeroSerie: number) => void;
    onEliminarSerie: (numeroSerie: number) => void;
    onAgregarSerie: () => void;
    onCambiarPeso: (numeroSerie: number, peso: number) => void;
    onCambiarRepeticiones: (numeroSerie: number, repeticiones: number) => void;
    serieEnEjecucion: number | null;
    haySerieEnEjecucion: boolean;
    onIniciarSerie: (numeroSerie: number) => void;
    onFinalizarSerie: (numeroSerie: number) => void;
}

const ListaEjercicioItem: FC<Props> = ({
    ejercicio,
    onCompletarSerie,
    onEliminarSerie,
    onAgregarSerie,
    onCambiarPeso,
    onCambiarRepeticiones,
    serieEnEjecucion,
    haySerieEnEjecucion,
    onIniciarSerie,
    onFinalizarSerie
}) => {
    return (
        <div className="p-4 space-y-3">

            {ejercicio.series?.map((serie,index) => {
                const estaEnEjecucion = serieEnEjecucion === serie.numeroSerie;

                return (
                <div
                    key={
                        serie.serieEntrenadaId != null && serie.serieEntrenadaId > 0
                            ? serie.serieEntrenadaId
                            : `${serie.numeroSerie}-${index}`
                    }
                    className="training-card border rounded-lg p-3"
                >
                    <div className="flex justify-between">
                        <span className="font-medium">
                            Serie {serie.numeroSerie}
                        </span>
                        <span className={
                            serie.completada
                                ? "training-chip rounded-full px-3 py-1"
                                    : estaEnEjecucion
                                    ? "training-item-active border rounded-full px-3 py-1"
                                    : "training-card-muted"
                        }>
                            {serie.completada
                                ? "Completada"
                                : estaEnEjecucion
                                    ? "En curso"
                                    : "Pendiente"}
                        </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <section className="training-data-panel">
                            <h3 className="training-data-heading">
                                Registrado
                            </h3>
                            <div className="training-data-list">
                                <label className="training-data-row items-center">
                                    <span className="training-data-label">Peso (kg)</span>
                                    <input
                                        type="number"
                                        className="training-input w-28 rounded border p-2"
                                        value={serie.peso === 0 ? "" : serie.peso}
                                            disabled={!serie.completada}
                                        onChange={event =>
                                            onCambiarPeso(
                                                serie.numeroSerie,
                                                Number(event.target.value)
                                            )
                                        }
                                    />
                                </label>
                                <label className="training-data-row items-center">
                                    <span className="training-data-label">Repeticiones</span>
                                    <input
                                        type="number"
                                        className="training-input w-28 rounded border p-2"
                                        value={serie.repeticiones === 0 ? "" : serie.repeticiones}
                                            disabled={!serie.completada}
                                        onChange={event =>
                                            onCambiarRepeticiones(
                                                serie.numeroSerie,
                                                Number(event.target.value)
                                            )
                                        }
                                    />
                                </label>
                                <div className="training-data-row">
                                    <span className="training-data-label">Descanso</span>
                                    <span className="training-data-value">{serie.descansoSegundos} s</span>
                                </div>
                                <div className="training-data-row">
                                    <span className="training-data-label">RPE</span>
                                    <span className="training-data-value">{serie.rpe ?? "Sin registrar"}</span>
                                </div>
                                <div className="training-data-row">
                                    <span className="training-data-label">Récord personal</span>
                                    <span className="training-data-value">{serie.fuePR ? "Sí" : "No"}</span>
                                </div>
                            </div>
                        </section>

                        <section className="training-data-panel">
                            <h3 className="training-data-heading">
                                Referencia
                            </h3>
                            {serie.serieReferencia ? (
                                <div className="training-data-list">
                                    <div className="training-data-row">
                                        <span className="training-data-label">Intensidad</span>
                                        <span className="training-data-value">{serie.serieReferencia.porcentaje1RM}% 1RM</span>
                                    </div>
                                    <div className="training-data-row">
                                        <span className="training-data-label">Repeticiones</span>
                                        <span className="training-data-value">{serie.serieReferencia.repeticiones}</span>
                                    </div>
                                    <div className="training-data-row">
                                        <span className="training-data-label">Descanso</span>
                                        <span className="training-data-value">{serie.serieReferencia.descansoSegundos ?? "No definido"} s</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="training-data-label mt-3">
                                    Sin datos de referencia
                                </p>
                            )}
                        </section>
                    </div>

                    {!serie.completada && (
                        <div className="mt-3 flex flex-wrap justify-between gap-2">
                            <button
                                type="button"
                                className="training-button-secondary border px-4 py-2"
                                onClick={() => onEliminarSerie(serie.numeroSerie)}
                            >
                                Eliminar serie
                            </button>
                            {estaEnEjecucion ? (
                                <button
                                    type="button"
                                    className="training-button-primary px-4 py-2"
                                    onClick={() => onFinalizarSerie(serie.numeroSerie)}
                                >
                                    Finalizar serie
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="training-button-secondary border px-4 py-2"
                                    disabled={haySerieEnEjecucion}
                                    onClick={() => onIniciarSerie(serie.numeroSerie)}
                                >
                                    Iniciar serie
                                </button>
                            )}
                        </div>
                    )}
                    {serie.completada && (
                        <div className="mt-3 flex justify-between gap-2">
                            <button
                                type="button"
                                className="training-button-secondary border px-4 py-2"
                                onClick={() => onEliminarSerie(serie.numeroSerie)}
                            >
                                Eliminar serie
                            </button>
                            <button
                                type="button"
                                className="training-button-secondary border px-4 py-2"
                                onClick={() => onCompletarSerie(serie.numeroSerie)}
                            >
                                Marcar pendiente
                            </button>
                        </div>
                    )}
                </div>
                );
            })}

            <button
                type="button"
                className="training-button-secondary border px-4 py-2"
                onClick={onAgregarSerie}
            >
                Agregar serie
            </button>

        </div>
    );
};

export default ListaEjercicioItem;

