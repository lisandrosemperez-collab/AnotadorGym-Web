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

const API_URL = `${import.meta.env.VITE_API_URL}/UsuarioAuth/login`;

export const login = async (userName: string, password: string) : Promise<LoginResponse> => {
    
    console.log({
    userName,
    password,
    API_URL
    });

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
        throw new Error(errorData.message || "Error al iniciar sesión");
    }

    return await response.json();
};