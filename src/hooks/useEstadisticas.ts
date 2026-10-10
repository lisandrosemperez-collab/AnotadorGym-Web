import { useApi } from "./useApi";
import type {
    FiltroEstadisticasDto,
    PuntoDuracionDto,
    PuntoFrecuenciaDto,
    PuntoVolumenDto,
    ProgresoEjercicioDto,
    ResumenEstadisticasDto
} from "../types/EstadisticasDto";

const crearQuery = ({ desde, hasta }: FiltroEstadisticasDto) => {
    const params = new URLSearchParams();
    if (desde) params.set("desde", desde);
    if (hasta) params.set("hasta", hasta);
    const query = params.toString();
    return query ? `?${query}` : "";
};

export const useEstadisticas = () => {
    const { callApi } = useApi();

    const obtenerResumen = (filtro: FiltroEstadisticasDto) =>
        callApi(`/Estadisticas/Resumen${crearQuery(filtro)}`) as Promise<ResumenEstadisticasDto>;

    const obtenerFrecuencia = (filtro: FiltroEstadisticasDto) =>
        callApi(`/Estadisticas/Frecuencia${crearQuery(filtro)}`) as Promise<PuntoFrecuenciaDto[]>;

    const obtenerDuracion = (filtro: FiltroEstadisticasDto) =>
        callApi(`/Estadisticas/Duracion${crearQuery(filtro)}`) as Promise<PuntoDuracionDto[]>;

    const obtenerVolumen = (filtro: FiltroEstadisticasDto) =>
        callApi(`/Estadisticas/Volumen${crearQuery(filtro)}`) as Promise<PuntoVolumenDto[]>;

    const obtenerProgresoEjercicio = (
        ejercicioId: number,
        filtro: FiltroEstadisticasDto
    ) => callApi(
        `/Estadisticas/ProgresoEjercicio/${ejercicioId}${crearQuery(filtro)}`
    ) as Promise<ProgresoEjercicioDto>;

    return {
        obtenerResumen,
        obtenerFrecuencia,
        obtenerDuracion,
        obtenerVolumen,
        obtenerProgresoEjercicio
    };
};
