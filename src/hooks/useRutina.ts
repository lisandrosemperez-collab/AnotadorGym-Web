import { useCallback, useState } from "react";
import { useApi } from "./useApi";
import type { RutinaDto } from "../types/RutinaDto";
import { useUsuario } from "./useUsuario";

type ApiResponse ={
    items: RutinaDto[]
}

export const useRutinas = () => {
    const { callApi } = useApi();    
    const { obtenerRutinaActiva, establecerRutinaActiva } = useUsuario();
    const [rutinaActual, setRutina] = useState<RutinaDto | null>(null);

    const obtenerRutinas = useCallback(async (): Promise<RutinaDto[]> => {
        try {
            const data: ApiResponse = await callApi("/rutina/exportar", { method: "GET"});
            return data.items;
        } catch (error) {
            console.error("Error fetching rutinas:", error);
            throw error;
        }
    }, [callApi]);

    const obtenerRutinaPorId = useCallback(async (rutinaId: number ): Promise<RutinaDto | null> => {
        try {
            const data: RutinaDto = await callApi(`/rutina/id/${rutinaId}`, { method: "GET"});
            return data;
        } catch (error) {
            console.error(`Error fetching rutina con el ID ${rutinaId}:`, error);
            throw error;
        }
    }, [callApi]);

    const cargarRutinaActiva = useCallback(async () => {
        const rutinaActivaId = await obtenerRutinaActiva();

        if (!rutinaActivaId?.rutinaActivaId) {
            setRutina(null);
            return null;
        }

        const rutina = await obtenerRutinaPorId(rutinaActivaId.rutinaActivaId);

        setRutina(rutina);

        return rutina;
    }, [obtenerRutinaPorId, obtenerRutinaActiva]);

    const establecerRutinaActivaPorId = useCallback(async (rutinaId: number) => {
        try {
            await establecerRutinaActiva(rutinaId);
        } catch (error) {
            console.error("Error estableciendo rutina activa:", error);
            throw error;
        }
    }, [establecerRutinaActiva]);

    return { obtenerRutinas, obtenerRutinaPorId, cargarRutinaActiva, rutinaActual,setRutina, establecerRutinaActivaPorId };
}

export default useRutinas;