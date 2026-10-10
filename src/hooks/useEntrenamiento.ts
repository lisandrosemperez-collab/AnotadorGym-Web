import { useState,useRef,useEffect } from "react";
import { useApi } from "./useApi";
import type { EntrenamientoDTO, EjercicioEntrenadoDTO, SerieEntrenadaDTO } from "../types/EntrenamientoDto";
import { LocalEntrenamientoService } from "../services/localEntrenamientoService";
import type { RutinaDiaDto } from "../types/RutinaDto";

export const useEntrenamiento = () => {
    const [entrenamiento, setEntrenamiento] = useState<EntrenamientoDTO | null>(null);    
    const entrenamientoRef = useRef<EntrenamientoDTO | null>(null);
    const { callApi } = useApi();

    useEffect(() => {
        entrenamientoRef.current = entrenamiento;
    }, [entrenamiento]);


    // ==========================================
    // Guardado local cada 1 minuto
    // ==========================================

    useEffect(() => {
        const intervaloLocal = setInterval(() => {
            const entrenamientoActual =
                entrenamientoRef.current;

            if (
                !entrenamientoActual ||
                entrenamientoActual.completado
            ) {
                return;
            }

            console.log(
                "💾 GUARDANDO ENTRENAMIENTO EN LOCAL:",
                new Date().toLocaleTimeString(),
                JSON.stringify(entrenamientoActual, null, 2)
            );

            try {
                guardarEntrenamientoLocal(
                    entrenamientoActual
                );

                 console.log(
                    "✅ ENTRENAMIENTO GUARDADO EN LOCAL"
                );  
            } catch (error) {
                console.error(
                    "❌ ERROR GUARDANDO ENTRENAMIENTO LOCAL:",
                    error
                );
            }

        }, 1 * 60 * 1000);

        return () => {
            clearInterval(intervaloLocal);
        };
    }, []);


    // ==========================================
    // Sincronización con servidor cada 3 minutos
    // ==========================================

    useEffect(() => {
        const intervaloServidor = setInterval(async () => {
            const entrenamientoActual =
                entrenamientoRef.current;

            if (
                !entrenamientoActual ||
                entrenamientoActual.completado
            ) {
                return;
            }

            console.log(
                "🌐 SINCRONIZANDO ENTRENAMIENTO CON SERVIDOR:",
                new Date().toLocaleTimeString(),
                JSON.stringify(entrenamientoActual, null, 2)
            );

            try {
                await sincronizarEntrenamiento(
                    entrenamientoActual
                );

                console.log(
                    "✅ ENTRENAMIENTO SINCRONIZADO CON SERVIDOR"
                );

            } catch (error) {
                console.error(
                    "❌ ERROR SINCRONIZANDO ENTRENAMIENTO CON SERVIDOR:",
                    error
                );
            }

        }, 3 * 60 * 1000);

        return () => {
            clearInterval(intervaloServidor);
        };
    }, []);


    // ==========================================================
    // CARGAR ENTRENAMIENTO ACTIVO DESDE SERVIDOR
    // ==========================================================

    const cargarEntrenamientoActivoServidor = async (): Promise<EntrenamientoDTO | null> => {
        try {
            const dto: EntrenamientoDTO | null = await callApi(`/Entrenamiento/entrenamiento-activo`, { method: "GET" });
            
            console.log(
                "🌐 ENTRENAMIENTO OBTENIDO DESDE SERVIDOR:",
                JSON.stringify(dto, null, 2)
            );

            if (dto) {
                setEntrenamiento(dto);
                entrenamientoRef.current = dto;
                LocalEntrenamientoService.guardar(dto);
                console.log(
                    "💾 ENTRENAMIENTO GUARDADO EN LOCAL DESDE SERVIDOR"
                );
                return dto;
            }
             console.log(
                "ℹ️ NO HAY ENTRENAMIENTO ACTIVO EN SERVIDOR"
            );
            return null;

        } catch (error: any) {
        
            if (error.status === 404) {
                console.log(
                    "ℹ️ SERVIDOR: NO HAY ENTRENAMIENTO ACTIVO"
                );

                return null;
            }

            console.error(
                "❌ ERROR OBTENIENDO ENTRENAMIENTO:",
                error
            );

            throw error;
        }
    };
    
    // ==========================================================
    // CARGAR ENTRENAMIENTO ACTIVO DESDE LOCAL
    // ==========================================================

    const cargarEntrenamientoActivoLocal = (): EntrenamientoDTO | null => {
        const entrenamientoLocal : EntrenamientoDTO | null = LocalEntrenamientoService.leer();

        if (!entrenamientoLocal) {
            console.log(
                "ℹ️ NO HAY ENTRENAMIENTO ACTIVO EN LOCAL"
            );
            return null;
        }

        console.log(
            "💾 ENTRENAMIENTO OBTENIDO DESDE LOCAL:",
            JSON.stringify(
                entrenamientoLocal,
                null,
                2
            )
        );

        setEntrenamiento(entrenamientoLocal);

        entrenamientoRef.current =
            entrenamientoLocal;

        return entrenamientoLocal;
    }

    // ==========================================================
    // VALIDAR ENTRENAMIENTO ACTIVO POR ID
    // ==========================================================

    const validarEntrenamientoActivoPorId = async (entrenamientoId: number): Promise<boolean> => {
        try {
            console.log(
                "🔎 VALIDANDO ENTRENAMIENTO EN SERVIDOR:",
                entrenamientoId
            );

            await callApi(
                `/Entrenamiento/activo/${entrenamientoId}`,
                {
                    method: "GET"
                }
            );

            console.log(
                "✅ ENTRENAMIENTO ACTIVO EXISTE EN SERVIDOR:",
                entrenamientoId
            );

            return true;
        } catch (error: any) {
            if (error.status === 404) {

                console.log(
                    "❌ ENTRENAMIENTO ACTIVO NO EXISTE EN SERVIDOR:",
                    entrenamientoId
                );

                return false;
            }

            console.error(
                "❌ ERROR VALIDANDO ENTRENAMIENTO:",
                error
            );

            throw error;
        }
    };

    // ==========================================================
    // SINCRONIZAR ENTRENAMIENTO CON SERVIDOR
    // ==========================================================

    const sincronizarEntrenamiento = async (entrenamiento: EntrenamientoDTO) => {
        if (!entrenamiento){
            console.log(
                "⚠️ SINCRONIZACIÓN CANCELADA: NO HAY ENTRENAMIENTO"
            );
            return;
        }

        console.log(
            "🌐 SINCRONIZANDO ENTRENAMIENTO CON SERVIDOR:",
            new Date().toLocaleTimeString(),
            JSON.stringify(
                entrenamiento,
                null,
                2
            )
        );
        
        try {
            
            await callApi(`/Entrenamiento/${entrenamiento.entrenamientoId}`, { method: "PUT" , body: JSON.stringify(entrenamiento) });                        
            
            console.log(
                "✅ ENTRENAMIENTO SINCRONIZADO CON SERVIDOR:",
                entrenamiento.entrenamientoId
            );
            
        } catch (error) {
            console.error(
                "❌ ERROR SINCRONIZANDO ENTRENAMIENTO:",
                error
            );
            throw error;
        }
    };

    // ==========================================================
    // CREAR ENTRENAMIENTO
    // ==========================================================

    const crearEntrenamiento = async (dia: RutinaDiaDto) : Promise<EntrenamientoDTO | null> => {              
        try {
            const nuevoEntrenamiento = {
                rutinaDiaId: dia.rutinaDiaId,
                notas: null
            };

            console.log(
                "🏋️ CREANDO ENTRENAMIENTO:",
                nuevoEntrenamiento
            );

            const entrenamientoCreado = 
                await callApi("/Entrenamiento", { 
                    method: "POST", 
                    body: JSON.stringify(nuevoEntrenamiento) });
                    
            setEntrenamiento(entrenamientoCreado);
            
            entrenamientoRef.current = entrenamientoCreado;
            
            LocalEntrenamientoService.guardar(
                entrenamientoCreado
            );

            console.log(
                "✅ ENTRENAMIENTO CREADO:",
                JSON.stringify(
                    entrenamientoCreado,
                    null,
                    2
                )
            );

            console.log(
                "💾 ENTRENAMIENTO INICIAL GUARDADO EN LOCAL"
            );

            return entrenamientoCreado; 
        } catch (error) {
            console.error(
                "❌ ERROR CREANDO ENTRENAMIENTO:",
                error
            );

            throw error;
        }
    }

    // ==========================================================
    // GUARDAR ENTRENAMIENTO LOCAL
    // ==========================================================

    const guardarEntrenamientoLocal = (entrenamiento:EntrenamientoDTO) => {

        if (!entrenamiento){
            console.log(
                "⚠️ GUARDADO LOCAL CANCELADO: NO HAY ENTRENAMIENTO"
            );
            return;
        }
        
        console.log(
            "💾 GUARDANDO ENTRENAMIENTO EN LOCAL:",
            new Date().toLocaleTimeString(),
            JSON.stringify(
                entrenamiento,
                null,
                2
            )
        );

        LocalEntrenamientoService.guardar(entrenamiento);

         console.log(
            "✅ ENTRENAMIENTO GUARDADO EN LOCAL"
        );
    };

    // ==========================================================
    // FINALIZAR ENTRENAMIENTO
    // ==========================================================

    const finalizarEntrenamiento = async () => {

        const entrenamientoActual = entrenamientoRef.current;
       
        if (!entrenamientoActual) {
            console.log(
                "⚠️ NO HAY ENTRENAMIENTO PARA FINALIZAR"
            );
            return;
        }

        try {
            const entrenamientoFinalizado: EntrenamientoDTO = {
                ...entrenamientoActual,
                completado: true,                
            };

            console.log(
                "🏁 FINALIZANDO ENTRENAMIENTO:",
                JSON.stringify(
                    entrenamientoFinalizado,
                    null,
                    2
                )
            );

            // --------------------------------------------------
            // Sincronizamos con API.
            // Backend persiste Completado = true.
            // --------------------------------------------------
            
            await sincronizarEntrenamiento( entrenamientoFinalizado );
            
            console.log(
                "✅ ENTRENAMIENTO FINALIZADO EN SERVIDOR"
            );

            // --------------------------------------------------
            // La API confirmó el guardado.
            // Ya podemos eliminar la copia local.
            // --------------------------------------------------
            
            LocalEntrenamientoService.eliminar();            
          
            setEntrenamiento(null); 
          
            entrenamientoRef.current = null;
          
            console.log(
                "🧹 ENTRENAMIENTO LIMPIADO DE REACT Y REF"
            );

        } catch (error) {
            console.error(
                "❌ ERROR FINALIZANDO ENTRENAMIENTO:",
                error
            );

            // IMPORTANTE:
            // No eliminamos localStorage si la API falló.

            throw error;
        }
    };
    // ==========================================================
    // ELIMINAR ENTRENAMIENTO LOCAL
    // ==========================================================

    const eliminarEntrenamientoLocal = () => {
        console.log(
            "🗑️ ELIMINANDO ENTRENAMIENTO LOCAL"
        );
        
        LocalEntrenamientoService.eliminar();
        
        setEntrenamiento(null);

        entrenamientoRef.current = null;

        console.log(
            "🧹 ENTRENAMIENTO ELIMINADO DE LOCAL, REACT Y REF"
        );
    };

    //region Funciones para manejar el ejercicio activo

    // ============================================================
    // AGREGAR EJERCICIOS
    // ============================================================
    const agregarEjercicios = (ejerciciosNuevos: EjercicioEntrenadoDTO[]) => {
    
        console.log(
            "➕ AGREGANDO EJERCICIOS:",
            ejerciciosNuevos.map(e => ({
                ejercicioId: e.ejercicioId,
                nombre: e.Ejercicio.nombre
            }))
        );

        setEntrenamiento(prev => {
            if (!prev) {
                console.warn(
                    "⚠️ No se pueden agregar ejercicios: no hay entrenamiento activo."
                );
                return prev;
            }

            const ejerciciosExistentes = new Set(
                prev.ejercicios.map(
                    ejercicio => ejercicio.ejercicioId
                )
            );

            const idsAgregados = new Set(ejerciciosExistentes);

            const nuevosEjercicios = ejerciciosNuevos
                .filter(ejercicio => {

                    if (idsAgregados.has(ejercicio.ejercicioId)) {
                        return false;
                    }

                    idsAgregados.add(ejercicio.ejercicioId);
                    return true;
                })
                .map((ejercicio, index) => ({
                    ...ejercicio,
                    orden: prev.ejercicios.length + index + 1,
                    series: []
                }));

            if (nuevosEjercicios.length === 0) {
                return prev;
            }

            const entrenamientoActualizado = {
                ...prev,

                ejercicios: [
                    ...prev.ejercicios,
                    ...nuevosEjercicios
                ]
            };

            console.log(
                "✅ EJERCICIOS AGREGADOS:",
                nuevosEjercicios.map(e => ({
                    ejercicioId: e.ejercicioId,
                    orden: e.orden
                }))
            );

            return {
                ...entrenamientoActualizado
            };
        });
    };

    const modificarEjercicio = (
        indiceEjercicio: number,
        actualizar: (ejercicio: EjercicioEntrenadoDTO) => EjercicioEntrenadoDTO
    ) => {
        setEntrenamiento(prev => {
            if (!prev || !prev.ejercicios[indiceEjercicio]){
                console.warn(
                    "⚠️ NO SE PUDO MODIFICAR EJERCICIO:",
                    {
                        indiceEjercicio,
                        entrenamientoId: prev?.entrenamientoId
                    }
                );
                
                return prev;
            }

            const ejercicioAnterior =
                prev.ejercicios[indiceEjercicio];

            console.log(
                "🔍 EJERCICIO ANTES DE MODIFICAR:",
                ejercicioAnterior
            );
  
            const ejercicioActualizado =
                actualizar(ejercicioAnterior);

            console.log(
                "✏️ EJERCICIO MODIFICADO:",
                {
                    entrenamientoId: prev.entrenamientoId,
                    indiceEjercicio,
                    ejercicioId: ejercicioAnterior.ejercicioId,
                    nombre: ejercicioAnterior.Ejercicio?.nombre ?? "(sin nombre)",

                    cambios: {
                        seriesAntes: ejercicioAnterior.series,
                        seriesDespues: ejercicioActualizado.series
                    }
                }
            );

            return {
                ...prev,
                ejercicios: prev.ejercicios.map((ejercicio, index) =>
                    index === indiceEjercicio ? actualizar(ejercicio) : ejercicio
                )
            };
        });
    };

    const completarSerie = (indiceEjercicio: number, numeroSerie: number) => {
        modificarEjercicio(indiceEjercicio, ejercicio => ({
            ...ejercicio,
            series: ejercicio.series.map(serie =>
                serie.numeroSerie === numeroSerie
                    ? { ...serie, completada: !serie.completada }
                    : serie
            )
        }));
    };

    const finalizarSerie = (indiceEjercicio: number, numeroSerie: number) => {
        modificarEjercicio(indiceEjercicio, ejercicio => ({
            ...ejercicio,
            series: ejercicio.series.map(serie =>
                serie.numeroSerie === numeroSerie
                    ? { ...serie, completada: true }
                    : serie
            )
        }));
    };

    const eliminarSerie = (indiceEjercicio: number, numeroSerie: number) => {
        modificarEjercicio(indiceEjercicio, ejercicio => ({
            ...ejercicio,
            series: ejercicio.series
                .filter(serie => serie.numeroSerie !== numeroSerie)
                .map((serie, index) => ({ ...serie, numeroSerie: index + 1 }))
        }));
    };

    const agregarSerie = (indiceEjercicio: number) => {
        modificarEjercicio(indiceEjercicio, ejercicio => {
            const nuevaSerie: SerieEntrenadaDTO = {
                serieEntrenadaId: 0,
                numeroSerie: ejercicio.series.length + 1,
                peso: 0,
                repeticiones: 0,
                completada: false,
                fuePR: false,
                rpe: null,
                descansoSegundos: 0
            };

            return {
                ...ejercicio,
                series: [...ejercicio.series, nuevaSerie]
            };
        });
    };

    const cambiarPeso = (
        indiceEjercicio: number,
        numeroSerie: number,
        peso: number
    ) => {
        modificarEjercicio(indiceEjercicio, ejercicio => ({
            ...ejercicio,
            series: ejercicio.series.map(serie =>
                serie.numeroSerie === numeroSerie ? { ...serie, peso } : serie
            )
        }));
    };

    const cambiarRepeticiones = (
        indiceEjercicio: number,
        numeroSerie: number,
        repeticiones: number
    ) => {
        modificarEjercicio(indiceEjercicio, ejercicio => ({
            ...ejercicio,
            series: ejercicio.series.map(serie =>
                serie.numeroSerie === numeroSerie
                    ? { ...serie, repeticiones }
                    : serie
            )
        }));
    };

    return {
     entrenamiento,
    

    entrenamientoActions: {
        setEntrenamiento,        
        eliminarEntrenamientoLocal,
        cargarEntrenamientoActivoServidor,
        cargarEntrenamientoActivoLocal,        
        crearEntrenamiento,
        agregarEjercicios,
        validarEntrenamientoActivoPorId,
        finalizarEntrenamiento
    },

    ejercicioActions: {
        completarSerie,
        finalizarSerie,
        eliminarSerie,
        agregarSerie,
        cambiarPeso,
        cambiarRepeticiones
    }
};
}

export default useEntrenamiento;