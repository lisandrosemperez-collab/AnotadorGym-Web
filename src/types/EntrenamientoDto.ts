import type { EjercicioDTO } from "./EjercicioDto";
import type { RutinaDiaDto } from "./RutinaDto";

export interface EntrenamientoDTO {
    entrenamientoId: number | null;
    fecha: string;
    duracionSegundos: number;
    notas: string | null;
    completado: boolean;
    rutinaDiaId: number | null;
    rutinaDia: RutinaDiaDto | null;
    rutinaId: number | null;
    ejercicios: EjercicioEntrenadoDTO[];
}

export interface EjercicioEntrenadoDTO {
    ejercicioEntrenadoId: number | null;
    ejercicioId: number;
    Ejercicio: EjercicioDTO;
    orden: number;
    notas: string | null;
    completado: boolean;
    series: SerieEntrenadaDTO[];
}

export interface SerieEntrenadaDTO {
    serieEntrenadaId: number | null;
    numeroSerie: number;
    peso: number;
    repeticiones: number;
    completada: boolean;
    fuePR: boolean;
    rpe: number | null;
    descansoSegundos: number;
    
    serieReferencia?: SeriesReferenciaDto;
}

export interface SeriesReferenciaDto {    
    porcentaje1RM: number;
    repeticiones: number;
    descansoSegundos?: number;
}

export type EstadoEntrenamiento =
    | "EnCurso"
    | "Completado"
    | "Cancelado";
