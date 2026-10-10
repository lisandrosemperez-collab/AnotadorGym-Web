export interface FiltroEstadisticasDto {
    desde?: string;
    hasta?: string;
}

export interface ResumenEstadisticasDto {
    entrenamientosCompletados: number;
    tiempoTotalSegundos: number;
    duracionPromedioSegundos: number | null;
    frecuenciaSemanal: number | null;
    volumenTotal: number | null;
}

export interface PuntoFrecuenciaDto {
    periodo: string;
    entrenamientos: number;
}

export interface PuntoDuracionDto {
    periodo: string;
    duracionSegundos: number;
}

export interface PuntoVolumenDto {
    periodo: string;
    volumen: number;
}

export interface MejorMarcaEjercicioDto {
    pesoMaximo: number;
    repeticiones: number;
    fecha: string;
    rmEstimado: number | null;
}

export interface SesionEjercicioDto {
    entrenamientoId: number;
    fecha: string;
    pesoMaximo: number | null;
    repeticionesEnPesoMaximo: number | null;
    repeticionesMaximas: number | null;
    cantidadSeriesValidas: number;
    volumen: number;
    rmEstimado: number | null;
    mejorMarca: boolean;
}

export interface ProgresoEjercicioDto {
    sesiones: SesionEjercicioDto[];
    mejorMarcaHistorica: MejorMarcaEjercicioDto | null;
}
