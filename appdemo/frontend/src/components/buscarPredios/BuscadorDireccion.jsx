import { useState } from "react";

const BuscadorDireccion = ({ onBuscar }) => {
    const [direccion, setDireccion] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (direccion.trim() !== "") {
            onBuscar(direccion);
        }
    };

    const handleMiUbicacion = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    onBuscar({ lat: latitude, lng: longitude }, true); // true = uso ubicación directa
                },
                (error) => {
                    alert("No se pudo obtener tu ubicación: " + error.message);
                }
            );
        } else {
            alert("Geolocalización no soportada");
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Ej: Av. Siempre Viva 123"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
            />
            <button type="submit">Buscar predios</button>
            <button type="button" onClick={handleMiUbicacion}>
                Usar mi ubicación
            </button>
        </form>
    );
};

export default BuscadorDireccion;