import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // 🔄 Nuevo estado

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            // Verificar si el token ha expirado
            const decodedToken = JSON.parse(atob(storedToken.split('.')[1])); // Decodificar el token JWT
            if (decodedToken.exp * 1000 < Date.now()) { // Verificar si está expirado
                logout(); // Si está expirado, cerrar sesión
            } else {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        }

        setLoading(false); // ✅ Marcar que terminó de cargar
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
