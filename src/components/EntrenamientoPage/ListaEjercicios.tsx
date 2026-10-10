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

const obtenerDatosEjercicio = (ejercicio: EjercicioEntrenadoDTO) =>
    ejercicio.Ejercicio ?? (
        ejercicio as EjercicioEntrenadoDTO & { ejercicio?: EjercicioDTO }
    ).ejercicio;

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

    const ejercicioSeleccionado = ejercicioExpandido == null
        ? null
        : ejercicios[ejercicioExpandido] ?? null;
    const datosEjercicioSeleccionado = ejercicioSeleccionado
        ? obtenerDatosEjercicio(ejercicioSeleccionado)
        : null;

    return (
        <div className="training-card rounded-xl shadow-md p-5 border">

            <h2 className="text-xl font-semibold mb-4">
                Ejercicios
            </h2>

            <div className="grid min-w-0 grid-cols-1 items-start gap-4 md:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1.6fr)]">
                <section className="min-w-0 self-start space-y-3" aria-label="Seleccionar ejercicio">

                {ejercicios.map((ejercicio, index) => {
                    const datosEjercicio = obtenerDatosEjercicio(ejercicio);

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
                            className={`overflow-hidden rounded-lg border ${
                                expandido
                                    ? "border-[var(--color-primary)]"
                                    : "border-[var(--color-border)]"
                            }`}
                        >

                            {/* Encabezado del ejercicio */}
                            <button
                                type="button"
                                onClick={() =>
                                    toggleEjercicio(index)
                                }
                                aria-expanded={expandido}
                                className={`flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-[var(--color-background)] ${
                                    expandido ? "training-item-active" : "training-button-secondary"
                                }`}
                            >

                                <div className="min-w-0">
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

                                <span className="training-accent shrink-0 text-xl" aria-hidden="true">
                                    {expandido ? "←" : "→"}
                                </span>

                            </button>
                        </div>
                    );
                })}

                </section>

                <section className="training-data-panel min-w-0 self-start p-0 md:sticky md:top-4" aria-live="polite" aria-label="Detalle del ejercicio seleccionado">
                    {ejercicioSeleccionado && datosEjercicioSeleccionado ? (
                        <>
                            <div className="border-b border-[var(--color-border)] p-4">
                                <h3 className="training-data-heading text-lg">
                                    {datosEjercicioSeleccionado.nombre}
                                </h3>
                                <div className="training-data-list">
                                    <div className="training-data-row">
                                        <span className="training-data-label">Orden</span>
                                        <span className="training-data-value">{ejercicioSeleccionado.orden}</span>
                                    </div>
                                    <div className="training-data-row">
                                        <span className="training-data-label">Estado</span>
                                        <span className="training-data-value">
                                            {ejercicioSeleccionado.completado ? "Completado" : "Pendiente"}
                                        </span>
                                    </div>
                                    {datosEjercicioSeleccionado.grupoMuscular?.nombre && (
                                        <div className="training-data-row">
                                            <span className="training-data-label">Grupo muscular</span>
                                            <span className="training-data-value">
                                                {datosEjercicioSeleccionado.grupoMuscular.nombre}
                                            </span>
                                        </div>
                                    )}
                                    {datosEjercicioSeleccionado.musculoPrimario?.nombre && (
                                        <div className="training-data-row">
                                            <span className="training-data-label">Músculo primario</span>
                                            <span className="training-data-value">
                                                {datosEjercicioSeleccionado.musculoPrimario.nombre}
                                            </span>
                                        </div>
                                    )}
                                    {datosEjercicioSeleccionado.musculosSecundarios?.length ? (
                                        <div className="training-data-row">
                                            <span className="training-data-label">Músculos secundarios</span>
                                            <span className="training-data-value text-right">
                                                {datosEjercicioSeleccionado.musculosSecundarios
                                                    .map(musculo => musculo.nombre)
                                                    .join(", ")}
                                            </span>
                                        </div>
                                    ) : null}
                                    {ejercicioSeleccionado.notas && (
                                        <p className="training-data-value">
                                            Notas: {ejercicioSeleccionado.notas}
                                        </p>
                                    )}
                                    {datosEjercicioSeleccionado.descripcion && (
                                        <p className="training-card-muted">
                                            {datosEjercicioSeleccionado.descripcion}
                                        </p>
                                    )}
                                    {datosEjercicioSeleccionado.urlVideo && (
                                        <a
                                            className="training-accent inline-block underline underline-offset-2"
                                            href={datosEjercicioSeleccionado.urlVideo}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Ver video del ejercicio
                                        </a>
                                    )}
                                </div>
                            </div>
                            <ListaEjercicioDetalle
                                ejercicio={ejercicioSeleccionado}
                                onCompletarSerie={numeroSerie =>
                                    onCompletarSerie(ejercicioExpandido!, numeroSerie)
                                }
                                onEliminarSerie={numeroSerie =>
                                    eliminarSerie(ejercicioExpandido!, numeroSerie)
                                }
                                onAgregarSerie={() => onAgregarSerie(ejercicioExpandido!)}
                                onCambiarPeso={(numeroSerie, peso) =>
                                    onCambiarPeso(ejercicioExpandido!, numeroSerie, peso)
                                }
                                onCambiarRepeticiones={(numeroSerie, repeticiones) =>
                                    onCambiarRepeticiones(ejercicioExpandido!, numeroSerie, repeticiones)
                                }
                                serieEnEjecucion={
                                    serieEnEjecucion?.indiceEjercicio === ejercicioExpandido
                                        ? serieEnEjecucion.numeroSerie
                                        : null
                                }
                                haySerieEnEjecucion={serieEnEjecucion !== null}
                                onIniciarSerie={numeroSerie =>
                                    iniciarSerie(ejercicioExpandido!, numeroSerie)
                                }
                                onFinalizarSerie={numeroSerie =>
                                    finalizarSerie(ejercicioExpandido!, numeroSerie)
                                }
                            />
                        </>
                    ) : (
                        <div className="p-6 text-center">
                            <p className="training-card-muted">
                                Seleccioná un ejercicio para ver sus series.
                            </p>
                        </div>
                    )}
                </section>
            </div>

        </div>
    );
};

export default ListaEjercicios;