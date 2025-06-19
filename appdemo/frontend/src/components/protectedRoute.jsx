// components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <p>Cargando...</p>; // 🌀 Podés poner un spinner también

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
