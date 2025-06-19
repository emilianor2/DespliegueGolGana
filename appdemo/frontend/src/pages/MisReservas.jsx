import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/authService";
import "../style/MisReservas.css";

const MisReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [nuevaReserva, setNuevaReserva] = useState({
        IDCancha: "",
        FechaReserva: "",
        HoraReserva: "",
        MetodoPago: "Transferencia",
    });

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/reservas", {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                setReservas(response.data);
            } catch (error) {
                console.error("Error obteniendo reservas", error);
            }
        };

        fetchReservas();
    }, []);

    const handleChange = (e) => {
        setNuevaReserva({ ...nuevaReserva, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/reservas", nuevaReserva, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            alert("Reserva creada correctamente.");

            setReservas((prev) => [
                ...prev,
                { ...nuevaReserva, EstadoReserva: "Pendiente" },
            ]);
        } catch {
            alert("Error al crear la reserva.");
        }
    };

    return (
        <div className="reservas-container">
            <h2>Mis Reservas</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="IDCancha" placeholder="ID de la Cancha" onChange={handleChange} required />
                <input type="date" name="FechaReserva" onChange={handleChange} required />
                <input type="time" name="HoraReserva" onChange={handleChange} required />
                <select name="MetodoPago" onChange={handleChange}>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Efectivo">Efectivo</option>
                </select>
                <button type="submit">Reservar</button>
            </form>

            <h3>Listado</h3>
            <ul>
                {reservas.map((reserva) => (
                    <li key={reserva.IDReserva}>
                        {reserva.FechaReserva} - {reserva.HoraReserva} - {reserva.EstadoReserva}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MisReservas;
