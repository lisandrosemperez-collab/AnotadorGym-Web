import { useState } from "react";
import { useApi } from "./useApi";
import type { EjercicioEntrenadoDTO, EntrenamientoDTO, SerieEntrenadaDTO } from "../types/EntrenamientoDto";
import { LocalEntrenamientoService } from "../services/localEntrenamientoService";
import type { RutinaDiaDto, RutinaDto } from "../types/RutinaDto";

export const useEntrenamiento = () => {
    const [entrenamiento, setEntrenamiento] = useState<EntrenamientoDTO | null>(null);
    const [rutinaActivaId, setRutinaActiva] = useState<number | null>(null);
    const [ejercicioActivoId, setEjercicioActivoId] = useState<number | null>(null);
    const { callApi } = useApi();

    const ejercicioActivo = entrenamiento?.ejercicios.find(e => e.ejercicioEntrenadoId === ejercicioActivoId) ?? null;
    
    const selecionarEjercicioActivo = (ejercicioId: number) => {
        setEjercicioActivoId(ejercicioId);
    }

    //Obtiene el entrenamiento activo del usuario desde el servidor
    const cargarEntrenamientoActivoServidor = async (): Promise<EntrenamientoDTO | null> => {
        try {
            const dto: EntrenamientoDTO | null = await callApi(`/Entrenamiento/entrenamiento-del-dia`, { method: "GET" });

            if (dto) {
                setEntrenamiento(dto);
                LocalEntrenamientoService.guardar(dto);
                return dto;
            }
            return null;

        } catch (error) {
            console.error("Error obteniendo entrenamiento:", error);            
            throw error;
        }
    };
    
    const cargarEntrenamientoActivoLocal = (): EntrenamientoDTO | null => {        
        const entrenamientoLocal : EntrenamientoDTO | null = LocalEntrenamientoService.leer();
        if (entrenamientoLocal) {
            setEntrenamiento(entrenamientoLocal);
            return entrenamientoLocal;
        }
        return null;
    }

    const sincronizarEntrenamiento = async () => {
        if (!entrenamiento)
            return;
        
        try {
            await callApi(`/Entrenamiento/${entrenamiento.entrenamientoId}`, { method: "PUT" , body: JSON.stringify(entrenamiento) });                        
        } catch (error) {
            console.error("Error completando serie:", error);
            throw error;
        }
    };

    const crearEntrenamiento = async () => {
        if (!entrenamiento)
            return;
        
        try {
            const dto = await callApi("/Entrenamiento", { method: "POST", body: JSON.stringify(entrenamiento) });
            setEntrenamiento(dto);                        
        } catch (error) {
            console.error("Error creando entrenamiento:", error);
            throw error;
        }
    }

    const guardarEntrenamientoLocal = () => {

        if (!entrenamiento)
            return;

        LocalEntrenamientoService.guardar(entrenamiento);
    };

    const eliminarEntrenamientoLocal = () => {
        LocalEntrenamientoService.eliminar();
        setEntrenamiento(null);
    };

    //#region Funciones para manejar el ejercicio activo
    const agregarEjerciciosDelDia = (dia: RutinaDiaDto) => {
    setEntrenamiento(prev => {
        if (!prev) return prev;

        const ejerciciosExistentes = new Set(
            prev.ejercicios.map(
                ejercicio => ejercicio.ejercicioId
            )
        );

        const nuevosEjercicios = dia.ejercicios
            .filter(ejercicioRutina => {
                const ejercicioId = ejercicioRutina.ejercicioId;

                if (ejercicioId === null) {
                    return false;
                }

                return !ejerciciosExistentes.has(ejercicioId);
            })
            .map((ejercicioRutina, index) => ({
                ejercicioEntrenadoId: null,

                ejercicioId:
                    ejercicioRutina.ejercicioId!,

                Ejercicio:
                    ejercicioRutina.ejercicio,

                orden:
                    prev.ejercicios.length + index + 1,

                notas: null,

                completado: false,

                series:
                    ejercicioRutina.series.map(serie => ({
                        serieEntrenadaId: null,

                        numeroSerie:
                            serie.numeroSerie,

                        // Datos que ingresa el usuario
                        peso: 0,

                        repeticiones: 0,

                        completada: false,

                        fuePR: false,

                        rpe: null,

                        descansoSegundos: 0,

                        // Datos de referencia de la rutina
                        serieReferencia: {
                            porcentaje1RM:
                                serie.porcentaje1RM,

                            repeticiones:
                                serie.repeticiones,

                            descansoSegundos:
                                serie.descanso
                        }
                    }))
            }));

        if (nuevosEjercicios.length === 0) {
            return prev;
        }

        return {
            ...prev,

            ejercicios: [
                ...prev.ejercicios,
                ...nuevosEjercicios
            ]
        };
    });
};

    const completarSerie = (numeroSerie: number) => {
    setEntrenamiento(prev => {
        if (!prev) return prev;

        return {
            ...prev,
            ejercicios: prev.ejercicios.map(ejercicio => {

                if (
                    ejercicio.ejercicioEntrenadoId !==
                    ejercicioActivoId
                ) {
                    return ejercicio;
                }

                return {
                    ...ejercicio,
                    series: ejercicio.series.map(serie =>
                        serie.numeroSerie === numeroSerie
                            ? {
                                ...serie,
                                completada: !serie.completada
                            }
                            : serie
                    )
                };
            })
        };
    });
    };

    const eliminarSerie = (numeroSerie: number) => {
    setEntrenamiento(prev => {
        if (!prev) return prev;

        return {
            ...prev,
            ejercicios: prev.ejercicios.map(ejercicio => {

                if (
                    ejercicio.ejercicioEntrenadoId !==
                    ejercicioActivoId
                ) {
                    return ejercicio;
                }

                return {
                    ...ejercicio,
                    series: ejercicio.series.filter(
                        serie =>
                            serie.numeroSerie !== numeroSerie
                    )
                };
            })
        };
    });
    };

    const agregarSerie = () => {
    setEntrenamiento(prev => {
        if (!prev) return prev;

        return {
            ...prev,
            ejercicios: prev.ejercicios.map(ejercicio => {

                if (
                    ejercicio.ejercicioEntrenadoId !==
                    ejercicioActivoId
                ) {
                    return ejercicio;
                }

                const cantidadSeries =
                    ejercicio.series.length;

                const nuevaSerie: SerieEntrenadaDTO = {
                    serieEntrenadaId: 0,
                    descansoSegundos: 0,                    
                    numeroSerie: cantidadSeries + 1,
                    peso: 0,
                    repeticiones: 0,
                    completada: false,
                    fuePR: false,
                    rpe: null,                    
                };

                return {
                    ...ejercicio,
                    series: [
                        ...ejercicio.series,
                        nuevaSerie
                    ]
                };
            })
        };
    });
    };

    const cambiarPeso = (
    numeroSerie: number,
    peso: number
) => {
    setEntrenamiento(prev => {
        if (!prev) return prev;

        return {
            ...prev,
            ejercicios: prev.ejercicios.map(ejercicio => {

                if (
                    ejercicio.ejercicioEntrenadoId !==
                    ejercicioActivoId
                ) {
                    return ejercicio;
                }

                return {
                    ...ejercicio,
                    series: ejercicio.series.map(serie =>
                        serie.numeroSerie === numeroSerie
                            ? {
                                ...serie,
                                peso
                            }
                            : serie
                    )
                };
            })
        };
    });
    };

    const cambiarRepeticiones = (
    numeroSerie: number,
    repeticiones: number
) => {
    setEntrenamiento(prev => {
        if (!prev) return prev;

        return {
            ...prev,
            ejercicios: prev.ejercicios.map(ejercicio => {

                if (
                    ejercicio.ejercicioEntrenadoId !==
                    ejercicioActivoId
                ) {
                    return ejercicio;
                }

                return {
                    ...ejercicio,
                    series: ejercicio.series.map(serie =>
                        serie.numeroSerie === numeroSerie
                            ? {
                                ...serie,
                                repeticiones
                            }
                            : serie
                    )
                };
            })
        };
    });
    };

    return {
     entrenamiento,
     ejercicioActivo,
     ejercicioActivoId,
     rutinaActivaId,

    entrenamientoActions: {
        setEntrenamiento,
        guardarEntrenamientoLocal,
        eliminarEntrenamientoLocal,
        cargarEntrenamientoActivoServidor,
        cargarEntrenamientoActivoLocal,
        sincronizarEntrenamiento,
        crearEntrenamiento
    },

    ejercicioActions: {
        selecionarEjercicioActivo,
        completarSerie,
        eliminarSerie,
        agregarSerie,
        cambiarPeso,
        cambiarRepeticiones
    }
};
}

export default useEntrenamiento;