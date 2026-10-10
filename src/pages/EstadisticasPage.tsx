import { useEffect, useEffectEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { useEjercicios } from "../hooks/useEjercicio";
import { useEstadisticas } from "../hooks/useEstadisticas";
import type { EjercicioDTO } from "../types/EjercicioDto";
import type {
    FiltroEstadisticasDto,
    MejorMarcaEjercicioDto,
    PuntoDuracionDto,
    PuntoFrecuenciaDto,
    PuntoVolumenDto,
    ResumenEstadisticasDto,
    SesionEjercicioDto
} from "../types/EstadisticasDto";

type Periodo = "7dias" | "30dias" | "3meses" | "6meses" | "todo" | "personalizado";
type Pestana = "general" | "ejercicio";
type Metrica = "peso" | "repeticiones" | "volumen" | "rmEstimado";

interface DatosGenerales {
    resumen: ResumenEstadisticasDto;
    frecuencia: PuntoFrecuenciaDto[];
    duracion: PuntoDuracionDto[];
    volumen: PuntoVolumenDto[];
    resumenAnterior: ResumenEstadisticasDto | null;
}

interface DatosEjercicio {
    sesiones: SesionEjercicioDto[];
    mejorMarca: MejorMarcaEjercicioDto | null;
}

const hoyLocal = () => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
};

const fechaLocal = (fecha: Date) =>
    `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

const restarMeses = (fecha: Date, meses: number) => {
    const destino = new Date(fecha.getFullYear(), fecha.getMonth() - meses, 1);
    const ultimoDia = new Date(destino.getFullYear(), destino.getMonth() + 1, 0).getDate();
    destino.setDate(Math.min(fecha.getDate(), ultimoDia));
    return destino;
};

const crearFiltroPeriodo = (
    periodo: Periodo,
    desdePersonalizado: string,
    hastaPersonalizado: string
): FiltroEstadisticasDto | null => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const hasta = fechaLocal(hoy);

    if (periodo === "todo") return {};
    if (periodo === "personalizado") {
        if (!desdePersonalizado || !hastaPersonalizado || desdePersonalizado > hastaPersonalizado) {
            return null;
        }
        return { desde: desdePersonalizado, hasta: hastaPersonalizado };
    }

    const desde = new Date(hoy);
    if (periodo === "7dias") desde.setDate(desde.getDate() - 6);
    if (periodo === "30dias") desde.setDate(desde.getDate() - 29);
    if (periodo === "3meses") return { desde: fechaLocal(restarMeses(hoy, 3)), hasta };
    if (periodo === "6meses") return { desde: fechaLocal(restarMeses(hoy, 6)), hasta };

    return { desde: fechaLocal(desde), hasta };
};

const crearPeriodoAnterior = (
    filtro: FiltroEstadisticasDto
): FiltroEstadisticasDto | null => {
    if (!filtro.desde || !filtro.hasta) return null;

    const desdeActual = new Date(`${filtro.desde}T00:00:00`);
    const hastaActual = new Date(`${filtro.hasta}T00:00:00`);
    const dias = Math.round((Date.UTC(
        hastaActual.getFullYear(), hastaActual.getMonth(), hastaActual.getDate()
    ) - Date.UTC(
        desdeActual.getFullYear(), desdeActual.getMonth(), desdeActual.getDate()
    )) / 86400000) + 1;

    const hastaAnterior = new Date(desdeActual);
    hastaAnterior.setDate(hastaAnterior.getDate() - 1);
    const desdeAnterior = new Date(hastaAnterior);
    desdeAnterior.setDate(desdeAnterior.getDate() - dias + 1);

    return { desde: fechaLocal(desdeAnterior), hasta: fechaLocal(hastaAnterior) };
};

const formatearDuracion = (segundos: number | null | undefined) => {
    if (segundos == null || !Number.isFinite(segundos)) return "Sin datos";
    const minutos = Math.round(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return horas > 0 ? `${horas} h ${minutosRestantes} min` : `${minutos} min`;
};

const formatearNumero = (valor: number | null | undefined, decimales = 0) =>
    valor == null || !Number.isFinite(valor)
        ? "Sin datos"
        : new Intl.NumberFormat("es-AR", { maximumFractionDigits: decimales }).format(valor);

const formatearFecha = (valor: string) => {
    const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(valor);
    const fecha = coincidencia
        ? new Date(Number(coincidencia[1]), Number(coincidencia[2]) - 1, Number(coincidencia[3]))
        : new Date(valor);
    return Number.isNaN(fecha.getTime())
        ? valor
        : fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "2-digit" });
};

const formatearEtiquetaTooltip = (valor: ReactNode) =>
    typeof valor === "string" || typeof valor === "number"
        ? formatearFecha(String(valor))
        : valor ?? "";

const mostrarError = (error: unknown) => {
    const status = (error as { status?: number } | null)?.status;
    if (status === 404) {
        return "La API todavía no dispone de este historial de estadísticas.";
    }
    return error instanceof Error ? error.message : "No se pudieron cargar las estadísticas.";
};

const tooltipStyle = {
    backgroundColor: "var(--color-card)",
    borderColor: "var(--color-border)",
    color: "var(--color-text-primary)",
    borderRadius: 8
};

const TarjetaIndicador = ({ titulo, valor, detalle }: {
    titulo: string;
    valor: string;
    detalle?: string;
}) => (
    <article className="training-card mb-0 min-w-0 text-center">
        <p className="training-card-muted">{titulo}</p>
        <p className="mt-2 break-words text-2xl font-semibold text-[var(--color-text-primary)]">{valor}</p>
        {detalle && <small>{detalle}</small>}
    </article>
);

const EstadoVacio = ({ children }: { children: string }) => (
    <div className="training-data-panel py-10 text-center">
        <p className="training-card-muted">{children}</p>
    </div>
);

const EstadisticasPage = () => {
    const estadisticas = useEstadisticas();
    const { getEjercicios } = useEjercicios();

    const [pestana, setPestana] = useState<Pestana>("general");
    const [periodo, setPeriodo] = useState<Periodo>("30dias");
    const [desdePersonalizado, setDesdePersonalizado] = useState("");
    const [hastaPersonalizado, setHastaPersonalizado] = useState(hoyLocal);

    const [datosGenerales, setDatosGenerales] = useState<DatosGenerales | null>(null);
    const [cargandoGeneral, setCargandoGeneral] = useState(true);
    const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

    const [ejercicios, setEjercicios] = useState<EjercicioDTO[]>([]);
    const [cargandoEjercicios, setCargandoEjercicios] = useState(true);
    const [errorEjercicios, setErrorEjercicios] = useState<string | null>(null);
    const [busquedaEjercicio, setBusquedaEjercicio] = useState("");
    const [ejercicioId, setEjercicioId] = useState<number | null>(null);
    const [metrica, setMetrica] = useState<Metrica>("peso");
    const [ordenAscendente, setOrdenAscendente] = useState(false);
    const [datosEjercicio, setDatosEjercicio] = useState<DatosEjercicio | null>(null);
    const [cargandoProgreso, setCargandoProgreso] = useState(false);
    const [errorProgreso, setErrorProgreso] = useState<string | null>(null);

    const filtro = crearFiltroPeriodo(periodo, desdePersonalizado, hastaPersonalizado);
    const cargarEjercicios = useEffectEvent(async () => {
        setCargandoEjercicios(true);
        setErrorEjercicios(null);
        try {
            const catalogo = await getEjercicios();
            const unicos = new Map<number, EjercicioDTO>();
            catalogo.forEach(ejercicio => {
                if (ejercicio.ejercicioId != null && !unicos.has(ejercicio.ejercicioId)) {
                    unicos.set(ejercicio.ejercicioId, ejercicio);
                }
            });
            const ordenados = [...unicos.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
            setEjercicios(ordenados);
            setEjercicioId(actual => actual ?? ordenados[0]?.ejercicioId ?? null);
        } catch (error) {
            setErrorEjercicios(mostrarError(error));
        } finally {
            setCargandoEjercicios(false);
        }
    });

    useEffect(() => {
        void cargarEjercicios();
    }, []);

    const cargarDatosGenerales = useEffectEvent(async (
        filtroActual: FiltroEstadisticasDto,
        filtroAnterior: FiltroEstadisticasDto | null
    ) => {
        setCargandoGeneral(true);
        setErrorGeneral(null);
        try {
            const [resumen, frecuencia, duracion, volumen, resumenAnterior] = await Promise.all([
                estadisticas.obtenerResumen(filtroActual),
                estadisticas.obtenerFrecuencia(filtroActual),
                estadisticas.obtenerDuracion(filtroActual),
                estadisticas.obtenerVolumen(filtroActual),
                filtroAnterior
                    ? estadisticas.obtenerResumen(filtroAnterior)
                    : Promise.resolve(null)
            ]);
            setDatosGenerales({ resumen, frecuencia, duracion, volumen, resumenAnterior });
        } catch (error) {
            setDatosGenerales(null);
            setErrorGeneral(mostrarError(error));
        } finally {
            setCargandoGeneral(false);
        }
    });

    useEffect(() => {
        const filtroActual = crearFiltroPeriodo(periodo, desdePersonalizado, hastaPersonalizado);
        if (!filtroActual) {
            setCargandoGeneral(false);
            setDatosGenerales(null);
            setErrorGeneral(null);
            return;
        }
        void cargarDatosGenerales(filtroActual, crearPeriodoAnterior(filtroActual));
    }, [periodo, desdePersonalizado, hastaPersonalizado]);

    const cargarDatosEjercicio = useEffectEvent(async (
        id: number,
        filtroActual: FiltroEstadisticasDto
    ) => {
        setCargandoProgreso(true);
        setErrorProgreso(null);
        try {
            const progreso = await estadisticas.obtenerProgresoEjercicio(id, filtroActual);
            setDatosEjercicio({
                sesiones: progreso.sesiones,
                mejorMarca: progreso.mejorMarcaHistorica
            });
        } catch (error) {
            setDatosEjercicio(null);
            setErrorProgreso(mostrarError(error));
        } finally {
            setCargandoProgreso(false);
        }
    });

    useEffect(() => {
        const filtroActual = crearFiltroPeriodo(periodo, desdePersonalizado, hastaPersonalizado);
        if (pestana !== "ejercicio" || ejercicioId == null || !filtroActual) {
            setCargandoProgreso(false);
            if (!filtroActual && pestana === "ejercicio") {
                setDatosEjercicio(null);
                setErrorProgreso(null);
            }
            return;
        }
        void cargarDatosEjercicio(ejercicioId, filtroActual);
    }, [pestana, ejercicioId, periodo, desdePersonalizado, hastaPersonalizado]);

    const ejerciciosFiltrados = useMemo(() => {
        const termino = busquedaEjercicio.trim().toLocaleLowerCase("es");
        return ejercicios.filter(ejercicio => ejercicio.nombre.toLocaleLowerCase("es").includes(termino));
    }, [ejercicios, busquedaEjercicio]);

    const sesionesOrdenadas = useMemo(() => {
        const sesiones = datosEjercicio?.sesiones ?? [];
        return [...sesiones].sort((a, b) => {
            const resultado = a.fecha.localeCompare(b.fecha);
            return ordenAscendente ? resultado : -resultado;
        });
    }, [datosEjercicio, ordenAscendente]);

    const puntosMetrica = useMemo(() => {
        return sesionesOrdenadas
            .filter(sesion => sesion.cantidadSeriesValidas > 0)
            .map(sesion => ({
                ...sesion,
                etiqueta: formatearFecha(sesion.fecha),
                valor: metrica === "peso"
                    ? sesion.pesoMaximo
                    : metrica === "repeticiones"
                        ? sesion.repeticionesMaximas
                        : metrica === "volumen"
                            ? sesion.volumen
                            : sesion.rmEstimado
            }))
            .filter(punto => punto.valor != null);
    }, [sesionesOrdenadas, metrica]);

    const resumen = datosGenerales?.resumen;
    const periodoPersonalizadoInvalido = periodo === "personalizado" && !filtro;
    const hayHistorial = (datosGenerales?.resumen.entrenamientosCompletados ?? 0) > 0;

    const datosComparacion = resumen && datosGenerales?.resumenAnterior
        ? [
            {
                etiqueta: "Entrenamientos",
                actual: resumen.entrenamientosCompletados,
                anterior: datosGenerales.resumenAnterior.entrenamientosCompletados,
                unidad: "entrenamientos"
            },
            {
                etiqueta: "Volumen",
                actual: resumen.volumenTotal,
                anterior: datosGenerales.resumenAnterior.volumenTotal,
                unidad: "kg·reps"
            }
        ]
        : [];

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-5 sm:px-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="training-accent font-semibold">Progreso de entrenamiento</p>
                    <h1 className="text-[var(--color-text-primary)]">Estadísticas</h1>
                </div>
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Secciones de estadísticas">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={pestana === "general"}
                        className={pestana === "general" ? "training-button-primary px-4 py-2" : "training-button-secondary border px-4 py-2"}
                        onClick={() => setPestana("general")}
                    >
                        General
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={pestana === "ejercicio"}
                        className={pestana === "ejercicio" ? "training-button-primary px-4 py-2" : "training-button-secondary border px-4 py-2"}
                        onClick={() => setPestana("ejercicio")}
                    >
                        Por ejercicio
                    </button>
                </div>
            </header>

            <section className="training-data-panel flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between" aria-label="Filtros de período">
                <label className="flex min-w-48 flex-col gap-1">
                    <span className="training-data-label">Período</span>
                    <select
                        className="training-input w-full rounded border p-2"
                        value={periodo}
                        onChange={event => setPeriodo(event.target.value as Periodo)}
                    >
                        <option value="7dias">Últimos 7 días</option>
                        <option value="30dias">Últimos 30 días</option>
                        <option value="3meses">Últimos 3 meses</option>
                        <option value="6meses">Últimos 6 meses</option>
                        <option value="todo">Todo el historial</option>
                        <option value="personalizado">Rango personalizado</option>
                    </select>
                </label>
                {periodo === "personalizado" && (
                    <>
                        <label className="flex min-w-40 flex-col gap-1">
                            <span className="training-data-label">Desde</span>
                            <input className="training-input rounded border p-2" type="date" value={desdePersonalizado} onChange={event => setDesdePersonalizado(event.target.value)} />
                        </label>
                        <label className="flex min-w-40 flex-col gap-1">
                            <span className="training-data-label">Hasta</span>
                            <input className="training-input rounded border p-2" type="date" value={hastaPersonalizado} onChange={event => setHastaPersonalizado(event.target.value)} />
                        </label>
                    </>
                )}
            </section>

            {periodoPersonalizadoInvalido && (
                <p className="training-card-muted" role="status">Seleccioná un rango válido: fecha inicial y final, en ese orden.</p>
            )}

            {pestana === "general" ? (
                <section role="tabpanel" aria-label="Estadísticas generales" className="space-y-6">
                    {cargandoGeneral ? (
                        <EstadoVacio>Cargando estadísticas...</EstadoVacio>
                    ) : errorGeneral ? (
                        <EstadoVacio>{errorGeneral}</EstadoVacio>
                    ) : datosGenerales ? (
                        <>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                                <TarjetaIndicador titulo="Entrenamientos completados" valor={formatearNumero(resumen?.entrenamientosCompletados)} />
                                <TarjetaIndicador titulo="Tiempo total entrenado" valor={formatearDuracion(resumen?.tiempoTotalSegundos)} />
                                <TarjetaIndicador titulo="Duración promedio" valor={formatearDuracion(resumen?.duracionPromedioSegundos)} />
                                <TarjetaIndicador titulo="Frecuencia semanal" valor={resumen?.frecuenciaSemanal == null ? "Sin datos" : `${formatearNumero(resumen.frecuenciaSemanal, 1)} / semana`} />
                                <TarjetaIndicador titulo="Volumen movilizado" valor={resumen?.volumenTotal == null ? "Sin datos" : `${formatearNumero(resumen.volumenTotal)} kg·reps`} detalle="Estimación de carga externa; no es comparable directamente entre ejercicios." />
                            </div>

                            {!hayHistorial ? (
                                <EstadoVacio>No hay entrenamientos completados en este período.</EstadoVacio>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                        <article className="training-card mb-0 min-w-0">
                                            <h2 className="text-lg">Frecuencia de entrenamiento</h2>
                                            {datosGenerales.frecuencia.length ? (
                                                <div className="mt-4 h-64 w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={datosGenerales.frecuencia} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
                                                            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                                                            <XAxis dataKey="periodo" tickFormatter={formatearFecha} tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} />
                                                            <YAxis allowDecimals={false} tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} />
                                                            <Tooltip contentStyle={tooltipStyle} labelFormatter={formatearEtiquetaTooltip} />
                                                            <Bar dataKey="entrenamientos" name="Entrenamientos" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            ) : <EstadoVacio>Sin datos de frecuencia para este período.</EstadoVacio>}
                                        </article>

                                        <article className="training-card mb-0 min-w-0">
                                            <h2 className="text-lg">Duración por período</h2>
                                            {datosGenerales.duracion.length ? (
                                                <div className="mt-4 h-64 w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={datosGenerales.duracion} margin={{ top: 8, right: 12, bottom: 8, left: -8 }}>
                                                            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                                                            <XAxis dataKey="periodo" tickFormatter={formatearFecha} tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} />
                                                            <YAxis tickFormatter={value => `${Math.round(Number(value) / 60)}m`} tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} />
                                                            <Tooltip contentStyle={tooltipStyle} labelFormatter={formatearEtiquetaTooltip} formatter={value => [formatearDuracion(Number(value)), "Duración"]} />
                                                            <Line type="monotone" dataKey="duracionSegundos" name="Duración" stroke="var(--color-secondary)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            ) : <EstadoVacio>Sin datos de duración para este período.</EstadoVacio>}
                                        </article>

                                        <article className="training-card mb-0 min-w-0 xl:col-span-2">
                                            <h2 className="text-lg">Volumen por período</h2>
                                            {datosGenerales.volumen.length ? (
                                                <div className="mt-4 h-64 w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={datosGenerales.volumen} margin={{ top: 8, right: 12, bottom: 8, left: 4 }}>
                                                            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                                                            <XAxis dataKey="periodo" tickFormatter={formatearFecha} tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} />
                                                            <YAxis tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} />
                                                            <Tooltip contentStyle={tooltipStyle} labelFormatter={formatearEtiquetaTooltip} formatter={value => [`${formatearNumero(Number(value))} kg·reps`, "Volumen"]} />
                                                            <Line type="monotone" dataKey="volumen" name="Volumen" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            ) : <EstadoVacio>Sin datos válidos de volumen para este período.</EstadoVacio>}
                                        </article>
                                    </div>

                                    {datosComparacion.length > 0 && (
                                        <article className="training-card mb-0">
                                            <h2 className="text-lg">Comparación con el período anterior</h2>
                                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                {datosComparacion.map(item => {
                                                    const delta = item.actual == null || item.anterior == null
                                                        ? null
                                                        : item.actual - item.anterior;
                                                    const porcentaje = item.anterior && delta != null
                                                        ? delta / item.anterior * 100
                                                        : null;
                                                    const texto = delta == null
                                                        ? "Sin datos suficientes"
                                                        : item.anterior === 0
                                                            ? delta === 0 ? "Sin cambio" : `Nuevo: +${formatearNumero(delta)} ${item.unidad}`
                                                            : `${delta > 0 ? "+" : ""}${formatearNumero(delta)} ${item.unidad} (${porcentaje! > 0 ? "+" : ""}${formatearNumero(porcentaje, 1)}%)`;
                                                    return (
                                                        <div key={item.etiqueta} className="training-data-panel text-center">
                                                            <p className="training-data-label">{item.etiqueta}</p>
                                                            <p className="training-data-value mt-2">{texto}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </article>
                                    )}
                                </>
                            )}
                        </>
                    ) : !periodoPersonalizadoInvalido ? (
                        <EstadoVacio>No hay datos para mostrar.</EstadoVacio>
                    ) : null}
                </section>
            ) : (
                <section role="tabpanel" aria-label="Estadísticas por ejercicio" className="space-y-6">
                    <div className="training-data-panel grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.5fr)]">
                        <label className="flex min-w-0 flex-col gap-1">
                            <span className="training-data-label">Buscar ejercicio</span>
                            <input className="training-input rounded border p-2" type="search" placeholder="Nombre del ejercicio" value={busquedaEjercicio} onChange={event => setBusquedaEjercicio(event.target.value)} />
                        </label>
                        <label className="flex min-w-0 flex-col gap-1">
                            <span className="training-data-label">Ejercicio</span>
                            <select className="training-input rounded border p-2" value={ejercicioId ?? ""} onChange={event => setEjercicioId(event.target.value ? Number(event.target.value) : null)} disabled={cargandoEjercicios || ejerciciosFiltrados.length === 0}>
                                {ejerciciosFiltrados.map(ejercicio => (
                                    <option key={ejercicio.ejercicioId} value={ejercicio.ejercicioId!}>{ejercicio.nombre}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {errorEjercicios ? (
                        <EstadoVacio>{errorEjercicios}</EstadoVacio>
                    ) : cargandoEjercicios ? (
                        <EstadoVacio>Cargando ejercicios...</EstadoVacio>
                    ) : ejercicios.length === 0 ? (
                        <EstadoVacio>No hay ejercicios disponibles en el catálogo.</EstadoVacio>
                    ) : ejerciciosFiltrados.length === 0 ? (
                        <EstadoVacio>No se encontraron ejercicios con ese nombre.</EstadoVacio>
                    ) : ejercicioId == null ? (
                        <EstadoVacio>Seleccioná un ejercicio para consultar su historial.</EstadoVacio>
                    ) : cargandoProgreso ? (
                        <EstadoVacio>Cargando historial del ejercicio...</EstadoVacio>
                    ) : errorProgreso ? (
                        <EstadoVacio>{errorProgreso}</EstadoVacio>
                    ) : datosEjercicio ? (
                        <>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <TarjetaIndicador
                                    titulo="Mayor peso registrado"
                                    valor={datosEjercicio.mejorMarca
                                        ? `${formatearNumero(datosEjercicio.mejorMarca.pesoMaximo, 2)} kg`
                                        : "Sin marca válida"}
                                    detalle={datosEjercicio.mejorMarca
                                        ? `${datosEjercicio.mejorMarca.repeticiones} reps · ${formatearFecha(datosEjercicio.mejorMarca.fecha)}`
                                        : undefined}
                                />
                                <TarjetaIndicador
                                    titulo="Mejor 1RM estimado"
                                    valor={datosEjercicio.mejorMarca?.rmEstimado == null
                                        ? "Sin datos suficientes"
                                        : `${formatearNumero(datosEjercicio.mejorMarca.rmEstimado, 2)} kg`}
                                    detalle="Estimación Epley; no es un máximo medido directamente."
                                />
                            </div>

                            <article className="training-card mb-0">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <h2 className="text-lg">Evolución del ejercicio</h2>
                                        <p className="training-card-muted">Cada punto representa una sesión. El peso es el máximo válido y las repeticiones asociadas corresponden a esa serie.</p>
                                    </div>
                                    <label className="flex flex-col gap-1 sm:min-w-48">
                                        <span className="training-data-label">Métrica</span>
                                        <select className="training-input rounded border p-2" value={metrica} onChange={event => setMetrica(event.target.value as Metrica)}>
                                            <option value="peso">Peso utilizado</option>
                                            <option value="repeticiones">Repeticiones</option>
                                            <option value="volumen">Volumen por sesión</option>
                                            <option value="rmEstimado">1RM estimado</option>
                                        </select>
                                    </label>
                                </div>
                                {puntosMetrica.length ? (
                                    <div className="mt-5 h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={puntosMetrica} margin={{ top: 8, right: 12, bottom: 8, left: 4 }}>
                                                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                                                <XAxis dataKey="etiqueta" tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} />
                                                <YAxis tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} />
                                                <Tooltip contentStyle={tooltipStyle} formatter={value => [formatearNumero(Number(value), 2), metrica === "peso" || metrica === "rmEstimado" ? "kg" : metrica === "volumen" ? "kg·reps" : "reps"]} />
                                                <Line type="monotone" dataKey="valor" name="Valor" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <EstadoVacio>No hay series válidas para esta métrica en el período. El 1RM estimado requiere peso externo y repeticiones válidas.</EstadoVacio>
                                )}
                            </article>

                            <article className="training-card mb-0">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-lg">Últimas sesiones</h2>
                                    <button type="button" className="training-button-secondary border px-3 py-2" onClick={() => setOrdenAscendente(value => !value)}>
                                        Fecha: {ordenAscendente ? "más antiguas primero" : "más recientes primero"}
                                    </button>
                                </div>
                                {sesionesOrdenadas.length ? (
                                    <div className="mt-4 overflow-x-auto">
                                        <table className="w-full min-w-[42rem] border-collapse text-left">
                                            <thead>
                                                <tr className="border-b border-[var(--color-border)]">
                                                    <th className="p-2">Fecha</th>
                                                    <th className="p-2">Peso máximo</th>
                                                    <th className="p-2">Reps</th>
                                                    <th className="p-2">Series válidas</th>
                                                    <th className="p-2">Volumen</th>
                                                    <th className="p-2">Marca</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sesionesOrdenadas.map(sesion => (
                                                    <tr key={`${sesion.entrenamientoId}-${sesion.fecha}`} className="border-b border-[var(--color-border)] last:border-0">
                                                        <td className="p-2">{formatearFecha(sesion.fecha)}</td>
                                                        <td className="p-2">{sesion.pesoMaximo == null ? "Sin peso externo" : `${formatearNumero(sesion.pesoMaximo, 2)} kg`}</td>
                                                        <td className="p-2">{sesion.repeticionesEnPesoMaximo ?? sesion.repeticionesMaximas ?? "—"}</td>
                                                        <td className="p-2">{sesion.cantidadSeriesValidas}</td>
                                                        <td className="p-2">{formatearNumero(sesion.volumen)} kg·reps</td>
                                                        <td className="p-2">{sesion.mejorMarca ? "Mejor marca" : "—"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <EstadoVacio>No hay sesiones del ejercicio en este período.</EstadoVacio>}
                            </article>
                        </>
                    ) : (
                        <EstadoVacio>Seleccioná un ejercicio para consultar su historial.</EstadoVacio>
                    )}
                </section>
            )}
        </main>
    );
};

export default EstadisticasPage;
