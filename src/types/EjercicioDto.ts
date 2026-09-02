export interface EjercicioDTO{
    nombre : string
    ejercicioId : number | null;
    descripcion : string    
    urlVideo : string
    musculoPrimario? : MusculoDTO
    musculosSecundarios? : MusculoDTO[]
    grupoMuscular? : GrupoMuscularDTO
}

export interface GrupoMuscularDTO {
  nombre: string
}

export interface MusculoDTO {
  nombre: string
}