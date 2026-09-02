interface LoginResponse {
    error: number;
    success: boolean;
    token: string;
    message: string;
    userId: number;
    userName: string;
    email: string;
    rol: string;
}

interface RegisterResponse {
    error: number;
    success: boolean;
    message: string;
    token?: string;
    userId?: number;
    userName?: string;
    email?: string;
    rol?: string;
}

export const login = async (userName: string, password: string) : Promise<LoginResponse> => {        
    const API_URL = `${import.meta.env.VITE_API_URL}/UsuarioAuth/login`;    

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userName, password})
    });

    console.log(response.status);

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en el inicio de sesión:", errorData);
        throw new Error(errorData.message || "Error al iniciar sesión");
    }

    return await response.json();
};

export const registro = async (username: string, email: string, password: string) : Promise<RegisterResponse> => {
    const API_URL_REGISTER = `${import.meta.env.VITE_API_URL}/UsuarioAuth/registro`;

    const response = await fetch(API_URL_REGISTER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    });

    let data: RegisterResponse | null = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok || data?.success === false) {
        console.error("Error en el registro:", data);
        throw new Error(data?.message || "Error al registrarse");
    }

    return data ?? {
        error: 0,
        success: true,
        message: "Registro exitoso"
    };
};

export const register = registro;