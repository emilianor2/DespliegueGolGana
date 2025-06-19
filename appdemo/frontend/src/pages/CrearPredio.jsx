import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/CrearPredio.css";

const CrearPredio = () => {
    const [formData, setFormData] = useState({
        NombrePredio: "",
        Ubicacion: "",
        Latitud: "",
        Longitud: "",
    });
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/predios", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Predio creado correctamente");
            navigate("/"); // redirige después de crear
        } catch (error) {
            console.error("Error al crear predio:", error);
            alert("Error al crear el predio");
        }
    };

    return (
        <div className="crear-predio-container"> 
            <h2>Crear Predio</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="NombrePredio"
                    placeholder="Nombre del predio"
                    value={formData.NombrePredio}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="Ubicacion"
                    placeholder="Dirección o ubicación textual"
                    value={formData.Ubicacion}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="Latitud"
                    placeholder="Latitud"
                    value={formData.Latitud}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="Longitud"
                    placeholder="Longitud"
                    value={formData.Longitud}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Crear Predio</button>
            </form>
        </div>
    );
};

export default CrearPredio;
