import { useApi } from "./useApi";
import type { RutinaDto } from "../types/RutinaDto";

type ApiResponse ={
    items: RutinaDto[]
}

export const useRutinas = () => {
    const { callApi } = useApi();

    const GetRutinas = async (): Promise<RutinaDto[]> => {
        try {               
            const data: ApiResponse = await callApi("/rutinas", { method: "GET"});
            return data.items;
        } catch (error) {
            console.error("Error fetching rutinas:", error);
            throw error;
        }
    }
    return { GetRutinas };
}