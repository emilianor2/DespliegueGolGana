import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/ReservasAdmin.css"; // Importa el archivo CSS

const ReservasAdmin = () => {
    const [reservas, setReservas] = useState([]);
    const { token } = useAuth(); // Obtén el token desde el contexto
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchReservas = async () => {
            try {
                // Verifica si el token está disponible
                if (!token) {
                    console.error("⚠️ No hay token. El usuario no está autenticado.");
                    navigate("/login");  // Redirige al login si no hay token
                    return;
                }
                
                // Realiza la solicitud para obtener las reservas del backend
                const response = await axios.get("http://localhost:5000/api/reservas/admin", {
                    headers: { Authorization: `Bearer ${token}` },  // Envia el token en los headers
                });
                
                setReservas(response.data);
            } catch (error) {
                console.error("❌ Error obteniendo reservas", error);
                // Si el error es de autenticación (token inválido o expirado), redirige al login
                if (error.response && error.response.status === 401) {
                    navigate("/login");
                }
            }
        };
        
        fetchReservas();
    }, [token, navigate]); // Ejecuta la función cuando el token cambie
    
    const handleAction = async (IDReserva, action) => {
        try {
            // Verifica si el token sigue siendo válido
            if (!token) {
                console.error("⚠️ No hay token. El usuario no está autenticado.");
                navigate("/login");
                return;
            }
            
            // Realiza la acción de confirmar o cancelar la reserva
            await axios.put(`http://localhost:5000/api/reservas/${action}/${IDReserva}`, {}, {
                headers: { Authorization: `Bearer ${token}` }, // Envía el token en los headers
            });
            
            alert(`Reserva ${action} correctamente.`);
            
            // Actualiza el estado local de las reservas
            setReservas((prevReservas) =>
                prevReservas.map((reserva) =>
                    reserva.IDReserva === IDReserva
                        ? { ...reserva, EstadoReserva: action.charAt(0).toUpperCase() + action.slice(1) } // Cambia el estado
                        : reserva
                )
            );
        } catch (error) {
            console.error("❌ Error al actualizar la reserva", error);
            alert("Error al actualizar la reserva.");
        }
    };
    
    return (
        <div className="reservas-admin-container">
            <h2 className="reservas-admin-title">Gestión de Reservas</h2>
            
            {reservas.length > 0 ? (
                <ul className="reservas-lista">
                    {reservas.map((reserva) => (
                        <li key={reserva.IDReserva} className="reserva-item">
                            <div className="reserva-info">
                                <span className="reserva-fecha">{reserva.FechaReserva}</span>
                                <span className="reserva-hora">{reserva.HoraReserva}</span>
                                <span className={`reserva-estado estado-${reserva.EstadoReserva.toLowerCase()}`}>
                                    {reserva.EstadoReserva}
                                </span>
                                
                                {/* Opcional: Puedes mostrar más detalles */}
                                <div className="reserva-detalles">
                                    <p><strong>ID Cancha:</strong> {reserva.IDCancha}</p>
                                    <p><strong>Método de Pago:</strong> {reserva.MetodoPago}</p>
                                </div>
                            </div>
                            
                            {reserva.EstadoReserva === "Pendiente" && (
                                <div className="reserva-botones">
                                    <button 
                                        className="btn-confirmar"
                                        onClick={() => handleAction(reserva.IDReserva, "confirmar")}
                                    >
                                        Confirmar
                                    </button>
                                    <button 
                                        className="btn-cancelar"
                                        onClick={() => handleAction(reserva.IDReserva, "cancelar")}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="sin-reservas">No hay reservas pendientes.</p>
            )}
        </div>
    );
};

export default ReservasAdmin;