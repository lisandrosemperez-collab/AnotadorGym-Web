import type { EntrenamientoDTO } from "../types/EntrenamientoDto";
import type { RutinaDiaDto } from "../types/RutinaDto";

//Esta factoria se encarga de crear un entrenamiento a partir de una rutina

export class EntrenamientoFactory {
    static crearEntrenamientoDesdeRutina(rutinaDia: RutinaDiaDto): EntrenamientoDTO {
        const entrenamiento: EntrenamientoDTO = {
            estado: "EnCurso",
            fecha: new Date(),
            duracionSegundos: 0,            
            ejercicios: rutinaDia.ejercicios?.map((ejercicio, index) => ({
                orden: index + 1,            
                ejercicio: ejercicio.ejercicio,
                ejercicioId: ejercicio.ejercicio.ejercicioId,
                seriesEntrenadas: ejercicio.series?.map((serie, serieIndex) => ({
                    numeroSerie: serieIndex + 1,
                    peso: 0,
                    repeticiones: 0,
                    completada: false,
                    fuePR: false,
                    rpe: undefined,
                    descansoSegundos: 0,
                    serieReferencia: {
                        porcentaje1RM: serie.porcentaje1RM,
                        repeticiones: serie.repeticiones,
                        descansoSegundos: serie.descanso
                    }
                })) || []
            })) || [],         
        }
        return entrenamiento;
    }
}
