import { useApi } from "./useApi";
import type { EjercicioDTO } from "../types/EjercicioDto";

export const useEjercicios = () => {
    const { callApi } = useApi();

    const getEjercicios = async (): Promise<EjercicioDTO[]> => {
        // Usamos callApi para que también use el token y maneje el 401
        return await callApi("/ejercicios/all");
    };

    const deleteEjercicio = async (ejercicioId: number): Promise<void> => {
        return await callApi(`/ejercicios/${ejercicioId}`, { method: "DELETE" });
    };

    const updateEjercicio = async (ejercicioId: number, updatedData: Partial<EjercicioDTO>): Promise<void> => {
        return await callApi(`/ejercicios/${ejercicioId}`, {
            method: "PATCH",
            body: JSON.stringify(updatedData),
        });
    };

    return { getEjercicios, deleteEjercicio, updateEjercicio };
};

export default useEjercicios;
