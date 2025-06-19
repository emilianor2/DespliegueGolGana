import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../style/MisCanchas.css";

const MisCanchas = () => {
    const { token } = useAuth();
    const [canchas, setCanchas] = useState([]);
    const [formData, setFormData] = useState({
        NombreCancha: "",
        Capacidad: "",
        Precio: "",
        HorarioDisponible: "",
        IDDisciplina: "",
        IDPredio: "", // Campo para predio
    });
    const [disciplinas, setDisciplinas] = useState([]);
    const [predios, setPredios] = useState([]); // Estado para predios
    const [editando, setEditando] = useState(null); // null o ID de la cancha
    const [error, setError] = useState("");

    useEffect(() => {
        obtenerCanchas();
        obtenerDisciplinas();
        obtenerPredios(); // Obtener predios
    }, []);

    const obtenerCanchas = async () => {
    const token = localStorage.getItem("token"); // o desde contexto si corresponde

    if (!token) {
        console.error("⚠️ Token no disponible. No se realiza la solicitud.");
        setError("No se pudo autenticar la solicitud. Iniciá sesión nuevamente.");
        return;
    }

    try {
        console.log("🛂 Token enviado al backend:", token);
        const res = await axios.get("http://localhost:5000/api/canchas", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setCanchas(res.data);
    } catch (error) {
            if (error.response) {
        // Si hay una respuesta del servidor, mostramos el mensaje de error
        console.error("Error del servidor:", error.response.data);
        setError(`Error: ${error.response.data.message || 'Algo salió mal.'}`);
    } else if (error.request) {
        // Si no hubo respuesta del servidor, mostramos otro tipo de error
        console.error("No se recibió respuesta del servidor:", error.request);
        setError("No se pudo contactar al servidor. Intenta nuevamente.");
    } else {
        // Si hubo un problema en la configuración de la solicitud
        console.error("Error en la solicitud:", error.message);
        setError("Hubo un problema al realizar la solicitud.");
    }
    }
};


    const obtenerDisciplinas = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/disciplinas");
            setDisciplinas(res.data);
        } catch (error) {
            console.error("Error al obtener disciplinas:", error);
            setError("Hubo un problema al obtener las disciplinas.");
        }
    };

    const obtenerPredios = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/predios"); // API para obtener predios
            setPredios(res.data);
        } catch (error) {
            console.error("Error al obtener predios:", error);
            setError("Hubo un problema al obtener los predios.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.NombreCancha || !formData.Capacidad || !formData.Precio || !formData.HorarioDisponible || !formData.IDDisciplina || !formData.IDPredio) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        try {
            if (editando) {
                await axios.put(`http://localhost:5000/api/canchas/${editando}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post("http://localhost:5000/api/canchas", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            setFormData({
                NombreCancha: "",
                Capacidad: "",
                Precio: "",
                HorarioDisponible: "",
                IDDisciplina: "",
                IDPredio: "", // Limpiar campo predio
            });
            setEditando(null);
            setError(""); // Limpiar el mensaje de error
            obtenerCanchas();
        } catch (error) {
            console.error("Error al guardar cancha:", error);
            setError("Hubo un error al guardar la cancha.");
        }
    };

    const handleEditar = (cancha) => {
        setFormData(cancha);
        setEditando(cancha.IDCancha);
    };

    const handleEliminar = async (id) => {
        if (confirm("¿Eliminar esta cancha?")) {
            try {
                await axios.delete(`http://localhost:5000/api/canchas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                obtenerCanchas();
            } catch (error) {
                console.error("Error al eliminar cancha:", error);
                setError("Hubo un problema al eliminar la cancha.");
            }
        }
    };

    return (
        <div className="mis-canchas-container">
            <h3>Mis Canchas</h3>
            {error && <div className="error-message">{error}</div>}
            <ul>
                {canchas.map((cancha) => (
                    <li key={cancha.IDCancha}>
                        <strong>{cancha.NombreCancha} - ${cancha.Precio}</strong>{cancha.NombreDisciplina}
                        <br />
                        Capacidad: {cancha.Capacidad} <br />
                        Horario: {cancha.HorarioDisponible} <br />
                        Predio: {cancha.NombrePredio}
                        <br />
                        <button onClick={() => handleEditar(cancha)}>Editar</button>
                        <button onClick={() => handleEliminar(cancha.IDCancha)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <h2>{editando ? "Editar Cancha" : "Crear Nueva Cancha"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="NombreCancha"
                    placeholder="Nombre de la cancha"
                    value={formData.NombreCancha}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="Capacidad"
                    placeholder="Capacidad"
                    value={formData.Capacidad}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="Precio"
                    placeholder="Precio"
                    value={formData.Precio}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="HorarioDisponible"
                    placeholder="Ej: 08:00-20:00"
                    value={formData.HorarioDisponible}
                    onChange={handleChange}
                    required
                />
                <select name="IDDisciplina" value={formData.IDDisciplina} onChange={handleChange} required>
                    <option value="">Seleccionar disciplina</option>
                    {disciplinas.map((d) => (
                        <option key={d.IDDisciplina} value={d.IDDisciplina}>
                            {d.NombreDisciplina}
                        </option>
                    ))}
                </select>
                <select name="IDPredio" value={formData.IDPredio} onChange={handleChange} required>
                    <option value="">Seleccionar predio</option>
                    {predios.map((predio) => (
                        <option key={predio.IDPredio} value={predio.IDPredio}>
                            {predio.NombrePredio}
                        </option>
                    ))}
                </select>
                <button type="submit">{editando ? "Actualizar" : "Crear"}</button>
            </form>
            <hr />
        </div>
    );
};

export default MisCanchas;
