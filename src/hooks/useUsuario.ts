import { useCallback } from "react";
import { useApi } from "./useApi";

interface ResultUsuario {
    success: boolean;
    message: string;
    rutinaActivaId: number;
}

export const useUsuario = () => {

    const { callApi } = useApi();

    const obtenerRutinaActiva = useCallback(async (): Promise<ResultUsuario | null> => {
        try {
            const data = await callApi("/Usuario/rutina-activa", {
                method: "GET"
            });

            return data;

        } catch (error) {
            console.error("Error obteniendo rutina activa:", error);
            throw error;
        }
    }, [callApi]);


    const establecerRutinaActiva = useCallback(async (rutinaId: number) => {
        try {
            return await callApi(`/usuario/rutina-activa/${rutinaId}`, {
                method: "PUT"
            });

        } catch(error) {
            console.error("Error guardando rutina activa:", error);
            throw error;
        }
    }, [callApi]);


    return {
        obtenerRutinaActiva,
        establecerRutinaActiva
    };
}