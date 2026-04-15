import type { EjercicioDTO } from "./EjercicioDto.ts"

export interface RutinaDto{
    nombre : string
    descripcion : string
    tiempoPorSesion : string
    dificultad : string
    frecuenciaPorGrupo : string    
    rutinaId : number
    semanas? : RutinaSemanaDto[]
}

export interface RutinaSemanaDto{
    rutinaSemanaId : number
    nombreSemana : string
    numeroSemana : number
    dias? : RutinaDiaDto[]
}

export interface RutinaDiaDto{
    nombreRutinaDia : string
    numeroDia : number
    rutinaDiaId : number
    ejercicios? : RutinaEjercicioDto[]
}

export interface RutinaEjercicioDto{
    ejercicio: EjercicioDTO
    series?: RutinaSeriesDto[]
    numeroEjercicio: number
    rutinaEjercicioId : number
}

export interface RutinaSeriesDto{
    rutinaSerieId : number
    descanso : string
    repeticiones : number
    porcentaje1RM : number
    numeroSerie : number
    tipo : TipoSerie
}

export type TipoSerie = 0 | 1 | 2 | 3 | 4 | 5