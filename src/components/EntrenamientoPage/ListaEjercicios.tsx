import type { FC } from "react";
import { useState } from "react";
import type { EjercicioDTO } from "../../types/EjercicioDto";
import type { EjercicioEntrenadoDTO } from "../../types/EntrenamientoDto";
import ListaEjercicioDetalle from "./ListaEjercicioDetalle";

interface ListaEjerciciosProps {
    ejercicios: EjercicioEntrenadoDTO[];
    onFinalizarSerie: (indiceEjercicio: number, numeroSerie: number) => void;
    onCompletarSerie: (indiceEjercicio: number, numeroSerie: number) => void;
    onEliminarSerie: (indiceEjercicio: number, numeroSerie: number) => void;
    onAgregarSerie: (indiceEjercicio: number) => void;
    onCambiarPeso: (indiceEjercicio: number, numeroSerie: number, peso: number) => void;
    onCambiarRepeticiones: (indiceEjercicio: number, numeroSerie: number, repeticiones: number) => void;
}

const ListaEjercicios: FC<ListaEjerciciosProps> = ({
    ejercicios,
    onFinalizarSerie,
    onCompletarSerie,
    onEliminarSerie,
    onAgregarSerie,
    onCambiarPeso,
    onCambiarRepeticiones
}) => {

    const [ejercicioExpandido, setEjercicioExpandido] =
        useState<number | null>(null);
    const [serieEnEjecucion, setSerieEnEjecucion] = useState<{
        indiceEjercicio: number;
        numeroSerie: number;
    } | null>(null);

    const toggleEjercicio = (index: number) => {
        setEjercicioExpandido(
            ejercicioExpandido === index
                ? null
                : index
        );
    };

    const iniciarSerie = (indiceEjercicio: number, numeroSerie: number) => {
        setSerieEnEjecucion(prev =>
            prev ?? { indiceEjercicio, numeroSerie }
        );
    };

    const finalizarSerie = (indiceEjercicio: number, numeroSerie: number) => {
        onFinalizarSerie(indiceEjercicio, numeroSerie);
        setSerieEnEjecucion(prev =>
            prev?.indiceEjercicio === indiceEjercicio &&
            prev.numeroSerie === numeroSerie
                ? null
                : prev
        );
    };

    const eliminarSerie = (indiceEjercicio: number, numeroSerie: number) => {
        onEliminarSerie(indiceEjercicio, numeroSerie);
        setSerieEnEjecucion(prev => {
            if (prev?.indiceEjercicio !== indiceEjercicio) return prev;
            if (prev.numeroSerie === numeroSerie) return null;
            return prev.numeroSerie > numeroSerie
                ? { ...prev, numeroSerie: prev.numeroSerie - 1 }
                : prev;
        });
    };

    return (
        <div className="training-card rounded-xl shadow-md p-5 border">

            <h2 className="text-xl font-semibold mb-4">
                Ejercicios
            </h2>

            <div className="space-y-3">

                {ejercicios.map((ejercicio, index) => {
                    const datosEjercicio =
                        ejercicio.Ejercicio ?? (
                            ejercicio as EjercicioEntrenadoDTO & {
                                ejercicio?: EjercicioDTO;
                            }
                        ).ejercicio;

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
                                ejercicio.ejercicioEntrenadoId &&
                                ejercicio.ejercicioEntrenadoId > 0
                                    ? ejercicio.ejercicioEntrenadoId
                                    : `${ejercicio.ejercicioId}-${index}`
                            }
                            className="border-[var(--color-border)] rounded-lg overflow-hidden"
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
                                    hover:bg-[var(--color-background)]
                                    transition
                                "
                            >

                                <div>
                                    <p className="font-semibold text-[var(--color-text-primary)]">
                                        {datosEjercicio?.nombre ?? "Ejercicio"}
                                    </p>

                                    <p className="text-sm training-card-muted mt-1">
                                        {seriesCompletadas}
                                        /
                                        {totalSeries}
                                        {" "}
                                        series completadas
                                    </p>
                                </div>

                                <span className="training-card-muted">
                                    {expandido ? "▲" : "▼"}
                                </span>

                            </button>

                            {/* Detalle expandible */}
                            {expandido && (
                                <div className="border-t">
                                    <section className="training-data-panel m-4">
                                        <h3 className="training-data-heading">
                                            Información del ejercicio
                                        </h3>
                                        <div className="training-data-list">
                                            <div className="training-data-row">
                                                <span className="training-data-label">Orden</span>
                                                <span className="training-data-value">{ejercicio.orden}</span>
                                            </div>
                                            <div className="training-data-row">
                                                <span className="training-data-label">Estado</span>
                                                <span className="training-data-value">
                                                    {ejercicio.completado ? "Completado" : "Pendiente"}
                                                </span>
                                            </div>
                                            {datosEjercicio?.grupoMuscular?.nombre && (
                                                <div className="training-data-row">
                                                    <span className="training-data-label">Grupo muscular</span>
                                                    <span className="training-data-value">
                                                        {datosEjercicio.grupoMuscular.nombre}
                                                    </span>
                                                </div>
                                            )}
                                            {datosEjercicio?.musculoPrimario?.nombre && (
                                                <div className="training-data-row">
                                                    <span className="training-data-label">Músculo primario</span>
                                                    <span className="training-data-value">
                                                        {datosEjercicio.musculoPrimario.nombre}
                                                    </span>
                                                </div>
                                            )}
                                            {datosEjercicio?.musculosSecundarios?.length ? (
                                                <div className="training-data-row">
                                                    <span className="training-data-label">Músculos secundarios</span>
                                                    <span className="training-data-value text-right">
                                                        {datosEjercicio.musculosSecundarios
                                                            .map(musculo => musculo.nombre)
                                                            .join(", ")}
                                                    </span>
                                                </div>
                                            ) : null}
                                            {ejercicio.notas && (
                                                <div>
                                                    <p className="training-data-label">Notas</p>
                                                    <p className="training-data-value mt-1">
                                                        {ejercicio.notas}
                                                    </p>
                                                </div>
                                            )}
                                            {datosEjercicio?.descripcion && (
                                                <div>
                                                    <p className="training-data-label">Descripción</p>
                                                    <p className="training-data-value mt-1">
                                                        {datosEjercicio.descripcion}
                                                    </p>
                                                </div>
                                            )}
                                            {datosEjercicio?.urlVideo && (
                                                <div>
                                                    <p className="training-data-label">Video</p>
                                                    <a
                                                        className="training-accent mt-1 inline-block underline underline-offset-2"
                                                        href={datosEjercicio.urlVideo}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Ver video del ejercicio
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                    <ListaEjercicioDetalle
                                        ejercicio={ejercicio}
                                        onCompletarSerie={numeroSerie =>
                                            onCompletarSerie(index, numeroSerie)
                                        }
                                        onEliminarSerie={numeroSerie =>
                                            eliminarSerie(index, numeroSerie)
                                        }
                                        onAgregarSerie={() => onAgregarSerie(index)}
                                        onCambiarPeso={(numeroSerie, peso) =>
                                            onCambiarPeso(index, numeroSerie, peso)
                                        }
                                        onCambiarRepeticiones={(numeroSerie, repeticiones) =>
                                            onCambiarRepeticiones(index, numeroSerie, repeticiones)
                                        }
                                        serieEnEjecucion={
                                            serieEnEjecucion?.indiceEjercicio === index
                                                ? serieEnEjecucion.numeroSerie
                                                : null
                                        }
                                        haySerieEnEjecucion={serieEnEjecucion !== null}
                                        onIniciarSerie={numeroSerie =>
                                            iniciarSerie(index, numeroSerie)
                                        }
                                        onFinalizarSerie={numeroSerie =>
                                            finalizarSerie(index, numeroSerie)
                                        }
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