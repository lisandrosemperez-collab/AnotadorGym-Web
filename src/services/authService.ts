const API_URL = `${import.meta.env.VITE_API_URL}/Auth/login`;

export const login = async (userName: string, password: string) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userName, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");        
    }

    return response.json();
};