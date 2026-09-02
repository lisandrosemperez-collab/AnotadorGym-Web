import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRutinas } from "../hooks/useRutina";
import { useEntrenamiento } from "../hooks/useEntrenamiento";
import EjercicioActualCard from "../components/EntrenamientoPage/EjercicioActualCard";
import ListaEjercicios from "../components/EntrenamientoPage/ListaEjercicios";
import EntrenamientoHeader from "../components/EntrenamientoPage/EntrenamientoHeader";
import type { RutinaDto } from "../types/RutinaDto";
import SelectorSemanaDia from "../components/EntrenamientoPage/SelectorSemanaDia";


const EntrenamientoPage = () => {   
    const entrenamientoHook  = useEntrenamiento();
    const rutinasHook = useRutinas();
    const navigation = useNavigate();

    const [searchParams] = useSearchParams();    

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
        setLoading(true);
        setError(null);
    
    try {         

      // ==========================================
      // 1. Buscar parámetros opcionales
      // ==========================================

      const rutinaIdParam = searchParams.get("rutinaId");
      const diaIdParam = searchParams.get("diaId");

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
      
      // ==========================================
      // 3. Si no está en memoria → buscar local
      // ==========================================

      if (!entrenamientoActivo) {
          entrenamientoActivo =
              await entrenamientoHook.entrenamientoActions
                  .cargarEntrenamientoActivoLocal();
      }

      // ==========================================
      // 4. Si no está local → buscar servidor
      // ==========================================

      if (!entrenamientoActivo) {
          entrenamientoActivo =
              await entrenamientoHook.entrenamientoActions
                  .cargarEntrenamientoActivoServidor();
      }
            
      // ==========================================
      // 5. Tenemos entrenamiento activo
      // ==========================================

      if (entrenamientoActivo) {

        // --------------------------------------
        // Cargar su rutina correspondiente
        // --------------------------------------

        // Si tenemos rutinaId desde RutinaPage,
        // usamos esa rutina.
        //
        // Si NO tenemos rutinaId, necesitamos
        // obtener la rutina correspondiente al
        // entrenamiento activo.

        let rutinaActual: RutinaDto | null = null;

        if (rutinaId) {
            // Venimos desde RutinaPage
          rutinaActual =
              await rutinasHook.obtenerRutinaPorId(rutinaId);
        }else if (entrenamientoHook.entrenamiento) {
          // Entramos directamente a EntrenamientoPage
          // Necesitamos obtener la rutina a partir del día
          rutinaActual =
              await rutinasHook.obtenerRutinaPorDia(
                  entrenamientoHook.entrenamiento.rutinaDiaId
              );
        }


        if (!rutinaActual) {
            setError(
                "No se pudo obtener la rutina correspondiente al entrenamiento."
            );

            navigation("/rutinas");
            return;
        }

        const rutinaActivaId = await rutinasHook.cargarRutinaActiva();

        if (!rutinaActivaId) {
            setError(
                "No tenés una rutina activa. Seleccioná una rutina para comenzar."
            );

            navigation("/rutinas");
            return;
        }

        const rutina = await rutinasHook.obtenerRutinaPorId(rutinaActivaId.rutinaId);

        if (!rutina) {
            setError("No se pudo obtener la rutina activa.");
            return;
        }        
          
      }

      // ==========================================
      // 6. Si no hay entrenamiento activo, cargamos la rutina activa
      // ==========================================

      if(!rutinasHook.rutinaActual){
        
      }

    } catch (error) {
      setError("Error al cargar la rutina.");      
    } finally {
      setLoading(false);      
    }
  }  

  const handleSeleccionarDia = (diaId: number) => {
    console.log("Día seleccionado:", diaId);
    navigation(
        `/entrenamiento?rutinaId=${rutinasHook.rutinaActual}&diaId=${diaId}`
    );
  };

  return (
    <div className="w-full max-w-6xl space-y-6">
      {loading && <p className="training-card-muted">Cargando rutina...</p>}
      
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !entrenamientoHook.entrenamiento && !error && (
        <p className="training-card-muted">No hay ejercicios disponibles para este entrenamiento.</p>
      )}

      {rutinasHook.rutinaActual && entrenamientoHook.entrenamiento && (
        <>
          <SelectorSemanaDia
              rutina={rutinasHook.rutinaActual}
              onSeleccionarDia={handleSeleccionarDia}
          />
          <EntrenamientoHeader
              rutina={rutinasHook.rutinaActual}
              entrenamiento={entrenamientoHook.entrenamiento}/>

          <EjercicioActualCard ejercicio={entrenamientoHook.ejercicioActivo}
            acciones={{
            completarSerie: entrenamientoHook.ejercicioActions.completarSerie,
            eliminarSerie: entrenamientoHook.ejercicioActions.eliminarSerie,
            agregarSerie: entrenamientoHook.ejercicioActions.agregarSerie,
            cambiarPeso: entrenamientoHook.ejercicioActions.cambiarPeso,
            cambiarRepeticiones: entrenamientoHook.ejercicioActions.cambiarRepeticiones}}/>

          <ListaEjercicios
              ejercicios={entrenamientoHook.entrenamiento.ejercicios}
              onSeleccionarEjercicio={entrenamientoHook.ejercicioActions.selecionarEjercicioActivo}/>
        </>
      )}

    </div>
  );
};

export default EntrenamientoPage;
