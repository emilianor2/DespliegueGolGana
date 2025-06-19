// AxiosInterceptor.jsx
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AxiosInterceptor = ({ children }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (
                    error.response?.status === 401 &&
                    (error.response?.data?.message?.includes("Token expirado") ||
                     error.response?.data?.error?.includes("Token expirado"))
                ) {
                    toast.error("⚠️ Tu sesión ha expirado. Iniciá sesión nuevamente.");
                    logout();
                    navigate("/login");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [logout, navigate]);

    return children;
};

export default AxiosInterceptor;
