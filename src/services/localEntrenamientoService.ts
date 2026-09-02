import type { EntrenamientoDTO } from "../types/EntrenamientoDto";

const STORAGE_KEY = "entrenamiento-activo";

export class LocalEntrenamientoService {
    
    static guardar(entrenamiento: EntrenamientoDTO): void {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(entrenamiento)
        );
    }

    static leer(): EntrenamientoDTO | null {

        const json = localStorage.getItem(STORAGE_KEY);

        if (!json) {
            return null;
        }
        try {
            return JSON.parse(json) as EntrenamientoDTO;
        }
        catch {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }        
    }

    static eliminar(): void {
        localStorage.removeItem(STORAGE_KEY);
    }
}

