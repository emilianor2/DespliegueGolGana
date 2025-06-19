import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../style/Predios.css";

const Predios = () => {
    const { token, user } = useAuth();
    const [predios, setPredios] = useState([]); // Asegúrate de que predios sea un arreglo
    const [formData, setFormData] = useState({
        NombrePredio: "",
        Ubicacion: "",
        Latitud: "",
        Longitud: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Función para obtener todos los predios
    const obtenerPredios = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/predios", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Predios recibidos:", response.data); // Verifica que recibes un array de predios
            setPredios(response.data); // Asegúrate de que setPredios esté configurando el estado correctamente
        } catch (error) {
            console.error("Error al obtener predios:", error);
        }
    };

    // Función para obtener el predio del usuario (solo uno)
    const obtenerMiPredio = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/predios", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPredios(response.data); // ✅ corregido: no encierres un array dentro de otro
        } catch (error) {
            if (error.response?.status === 404) {
                setPredios([]);
            } else {
                console.error("❌ Error al cargar tus predios:", error);
            }
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/predios", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Predio creado correctamente");
            obtenerPredios(); // Llamar a obtener todos los predios nuevamente después de crear uno nuevo
        } catch (error) {
            console.error("❌ Error creando predio:", error);
            alert("Error creando predio");
        }
    };

    useEffect(() => {
        if (token && user?.tipo === "empleado") {
            // Si el empleado tiene un predio, mostramos solo ese
            obtenerMiPredio();
        } else {
            // Si no es empleado o no tiene un predio, obtenemos todos los predios
            obtenerPredios();
        }
    }, [token, user]);

    return (
        <div className="predios-container">
            <h2>Predios</h2>

            {/* Mostrar formulario si es un empleado sin predio */}
            {user?.tipo === "empleado" && predios.length === 0 && (
                <form onSubmit={handleSubmit}>
                    <input
                        name="NombrePredio"
                        placeholder="Nombre"
                        value={formData.NombrePredio}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="Ubicacion"
                        placeholder="Ubicación"
                        value={formData.Ubicacion}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="Latitud"
                        placeholder="Latitud"
                        value={formData.Latitud}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="Longitud"
                        placeholder="Longitud"
                        value={formData.Longitud}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Crear Predio</button>
                </form>
            )}

            {/* Mostrar todos los predios */}
            {predios.length > 0 ? (
                <div>
                    {predios.map((predio) => (
                        <ul key={predio.IDPredio}>
                            <li><strong>Nombre:</strong> {predio.NombrePredio}</li>
                            <li><strong>Ubicación:</strong> {predio.Ubicacion}</li>
                            <li><strong>Latitud:</strong> {predio.Latitud}</li>
                            <li><strong>Longitud:</strong> {predio.Longitud}</li>
                        </ul>
                    ))}
                </div>
            ) : (
                <p>No hay predios disponibles.</p>
            )}
        </div>
    );
};

export default Predios;
