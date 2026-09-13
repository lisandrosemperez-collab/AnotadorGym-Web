import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRutinas } from "../hooks/useRutina";
import { useEntrenamiento } from "../hooks/useEntrenamiento";
import EjercicioActualCard from "../components/EntrenamientoPage/EjercicioActualCard";
import ListaEjercicios from "../components/EntrenamientoPage/ListaEjercicios";
import EntrenamientoHeader from "../components/EntrenamientoPage/EntrenamientoHeader";
import SelectorSemanaDia from "../components/EntrenamientoPage/SelectorSemanaDia";
import type { RutinaDto } from "../types/RutinaDto";


const EntrenamientoPage = () => {   
    const entrenamientoHook  = useEntrenamiento();
    const rutinasHook = useRutinas();
    const navigation = useNavigate();

    const [searchParams] = useSearchParams();    
    const rutinaIdParam = searchParams.get("rutinaId");
    const diaIdParam = searchParams.get("diaId");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const cargar = async () => {
          setLoading(true);
          setError(null);
      
      try {         
  
        // ==========================================
        // 1. Buscar parámetros opcionales
        // ==========================================
  
        const rutinaId = rutinaIdParam
            ? Number(rutinaIdParam)
            : null;
  
        const diaId = diaIdParam
            ? Number(diaIdParam)
            : null;
  
        // ==========================================
        // 2. Buscar entrenamiento activo
        // ==========================================
  
        let entrenamientoActivo =
            entrenamientoHook.entrenamiento;

        console.log("ENTRENAMIENTO INICIAL:", entrenamientoActivo);

        
        // ==========================================
        // 2.1 Si no está en memoria → buscar local
        // ==========================================
  
        if (!entrenamientoActivo) {
            entrenamientoActivo =
                await entrenamientoHook.entrenamientoActions
                    .cargarEntrenamientoActivoLocal();
                        console.log("ENTRENAMIENTO LOCAL:", entrenamientoActivo);

        }

        // ==========================================
        // 2.3 Si existe localmente, comprobar que siga
        //    existiendo en el servidor
        // ==========================================
        
        if (entrenamientoActivo) {

            const existeEnServidor =
                await entrenamientoHook.entrenamientoActions
                    .validarEntrenamientoActivoPorId(
                        entrenamientoActivo.entrenamientoId!
                    );

            if (!existeEnServidor) {
                entrenamientoHook.entrenamientoActions
                    .eliminarEntrenamientoLocal();
                entrenamientoActivo = null;
            }
        }

        // ==========================================
        // 2.3 Si no está local → buscar servidor
        // ==========================================
  
        if (!entrenamientoActivo) {
            entrenamientoActivo =
                await entrenamientoHook.entrenamientoActions
                    .cargarEntrenamientoActivoServidor();
                        console.log("ENTRENAMIENTO SERVIDOR:", entrenamientoActivo);
        }

        console.log("ENTRENAMIENTO FINAL:", entrenamientoActivo);
              
        // ==========================================
        // 3. Tenemos entrenamiento activo
        // ==========================================
  
        if (entrenamientoActivo) {
  
          /*
          * IMPORTANTE:
          *
          * No nos importa si vino de memoria, local o servidor.
          * A partir de acá trabajamos con el mismo entrenamiento.
          *
          * Buscamos la rutina solamente UNA VEZ.
          */
  
          const rutinaIdEntrenamiento =
              entrenamientoActivo.rutinaId;
  
          if (rutinaIdEntrenamiento) {
  
                  const rutina =
                      await rutinasHook.obtenerRutinaPorId(
                          rutinaIdEntrenamiento
                      );
  
                  if (rutina) {
                      rutinasHook.setRutina(rutina);
                  }
              }
  
              /*
               * El entrenamiento ya existe.
               *
               * No usamos rutinaId/diaId de la URL para crear otro.
               * El usuario continúa el entrenamiento existente.
               */
  
              return;
        }
  
        // ==========================================
        // 4. NO HAY ENTRENAMIENTO ACTIVO
        // ==========================================
        // Esta será la rutina que finalmente
        // vamos a utilizar.
        let rutinaActiva: RutinaDto | null = null;
        
        // ==========================================
        // 4.1 Viene rutina desde la URL
        // ==========================================

        if (rutinaId) {

            const rutinaUrl =
                await rutinasHook.obtenerRutinaPorId(rutinaId);

            if (!rutinaUrl) {
                setError(
                    "No se encontró la rutina seleccionada."
                );

                navigation("/rutinas");
                return;
            }


            // Buscar rutina activa actual
            rutinaActiva =
                await rutinasHook.cargarRutinaActiva();
                console.log("RUTINA ACTIVA:", rutinaActiva);


            // --------------------------------------
            // No hay rutina activa
            // → usamos la de la URL
            // --------------------------------------

            if (!rutinaActiva) {

                rutinaActiva = rutinaUrl;

            }

            // --------------------------------------
            // Hay una rutina activa diferente
            // --------------------------------------

            else if (
                rutinaActiva.rutinaId !== rutinaUrl.rutinaId
            ) {

                const cambiarRutina = window.confirm(
                    `Ya tenés activa la rutina "${rutinaActiva.nombre}".\n\n` +
                    `¿Querés cambiar a "${rutinaUrl.nombre}"?`
                );

                if (cambiarRutina) {

                    await rutinasHook
                        .establecerRutinaActivaPorId(
                            rutinaUrl.rutinaId
                        );

                    rutinaActiva = rutinaUrl;
                }
            }

            // --------------------------------------
            // Si era la misma rutina
            // rutinaActiva ya es correcta.
            // --------------------------------------

        }


        // ==========================================
        // 4.2 NO viene rutina desde la URL
        // ==========================================

        else {

            rutinaActiva =
                await rutinasHook.cargarRutinaActiva();

            if (!rutinaActiva) {

                navigation("/rutinas");
                return;
            }
        }


        // ==========================================
        // 5. Establecer rutina finalmente elegida
        // ==========================================
        // Si llegamos acá, rutinaActiva ya representa
        // la rutina que finalmente eligió el usuario.

        rutinasHook.setRutina(rutinaActiva);

        // ============================================================
        // 6. NO HAY DÍA SELECCIONADO
        // ============================================================
  
        if (!diaId) {
  
            /*
              * No creamos entrenamiento todavía.
              *
              * La UI mostrará SelectorSemanaDia.
              */
  
            return;
        }
        
        // ============================================================
        // 7. BUSCAR DÍA DENTRO DE LA RUTINA
        // ============================================================
  
        const diaSeleccionado =
            rutinaActiva?.semanas
                .flatMap(semana => semana.dias)
                .find(dia => dia.rutinaDiaId === diaId);
  
  
        if (!diaSeleccionado) {
  
            setError(
                "El día seleccionado no pertenece a la rutina."
            );
  
            return;
        }
  
        // ============================================================
        // 8. CREAR ENTRENAMIENTO
        // ============================================================
  
        const nuevoEntrenamiento =
            await entrenamientoHook.entrenamientoActions
                .crearEntrenamiento(                  
                    diaSeleccionado
                );
  
  
        if (!nuevoEntrenamiento) {
  
            setError(
                "No se pudo crear el entrenamiento."
            );
  
            return;
        }
  
      } catch (error) {
        console.error(
              "Error al cargar el entrenamiento:",
              error
          );
        setError("Error al cargar la rutina.");      
      } finally {
        setLoading(false);      
      }
    }  

  useEffect(() => {
    cargar();
  }, [rutinaIdParam, diaIdParam]);


  const handleSeleccionarDia = (diaId: number) => {
    console.log("Día seleccionado:", diaId);
    navigation(
        `/entrenamiento?rutinaId=${rutinasHook.rutinaActual}&diaId=${diaId}`
    );
  };

  return (
    <div className="w-full max-w-6xl space-y-6">
      
      {loading && (
        <p className="training-card-muted">
            Cargando entrenamiento...
        </p>
      )}
      
      {error && (
        <p className="text-red-500">
            {error}
        </p>
      )}
      
      {/* Selector: solamente cuando todavía no hay día seleccionado */}
      {!loading &&
          !error &&
          rutinasHook.rutinaActual &&
          !diaIdParam && (
              <SelectorSemanaDia
                  rutina={rutinasHook.rutinaActual}
                  onSeleccionarDia={handleSeleccionarDia}
              />
          )
      }

      {/* Header: se muestra si tenemos rutina + entrenamiento */}
      {!loading &&
          !error &&
          rutinasHook.rutinaActual &&
          entrenamientoHook.entrenamiento && (
              <EntrenamientoHeader
                  rutina={rutinasHook.rutinaActual}
                  entrenamiento={entrenamientoHook.entrenamiento}
              />
          )
      }

      {/* Ejercicio actual */}
      {!loading &&
          !error &&
          entrenamientoHook.entrenamiento &&
          entrenamientoHook.ejercicioActivo && (
              <EjercicioActualCard
                  ejercicio={entrenamientoHook.ejercicioActivo}
                  acciones={{
                      completarSerie:
                          entrenamientoHook.ejercicioActions.completarSerie,

                      eliminarSerie:
                          entrenamientoHook.ejercicioActions.eliminarSerie,

                      agregarSerie:
                          entrenamientoHook.ejercicioActions.agregarSerie,

                      cambiarPeso:
                          entrenamientoHook.ejercicioActions.cambiarPeso,

                      cambiarRepeticiones:
                          entrenamientoHook.ejercicioActions.cambiarRepeticiones
                  }}
              />
          )
      }

      {/* Lista de ejercicios */}
      {!loading &&
          !error &&
          entrenamientoHook.entrenamiento && (
              <ListaEjercicios
                  ejercicios={
                      entrenamientoHook.entrenamiento.ejercicios
                  }
                  onSeleccionarEjercicio={
                      entrenamientoHook.ejercicioActions
                          .selecionarEjercicioActivo
                  }
              />
          )
      }

      {/* No hay entrenamiento y tampoco se puede seleccionar un día */}
      {!loading &&
        !error &&
        !entrenamientoHook.entrenamiento &&
        !rutinasHook.rutinaActual && (
            <p className="training-card-muted">
                No hay un entrenamiento disponible.
            </p>
        )
      }

    </div>
  );
};

export default EntrenamientoPage;
