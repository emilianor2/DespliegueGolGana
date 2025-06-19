import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../style/Dashboard.css"; // Importa el archivo CSS

const Dashboard = () => {
    const [usuario, setUsuario] = useState(null);
    const { token } = useAuth();
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/usuarios/perfil", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsuario(response.data);
            } catch (error) {
                console.error("❌ Error obteniendo datos del usuario", error);
            }
        };
        
        if (token) fetchUserData();
    }, [token]);
    
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="golgana-logo">GOLGANA</div>
                <h2 className="dashboard-title">Dashboard</h2>
            </div>
            
            {usuario ? (
                <div className="user-profile">
                    <h3 className="profile-heading">Perfil de Usuario</h3>
                    <div className="profile-info">
                        <div className="info-item">
                            <span className="info-label">Nombre</span>
                            <div className="info-value">{usuario.Nombre}</div>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Correo</span>
                            <div className="info-value">{usuario.Correo}</div>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Teléfono</span>
                            <div className="info-value">{usuario.Telefono}</div>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Tipo</span>
                            <div className="info-value">{usuario.Tipo}</div>
                        </div>
                    </div>
                    <button className="action-button">Editar Perfil</button>
                </div>
            ) : (
                <p className="loading">Cargando datos...</p>
            )}
        </div>
    );
};

export default Dashboard;