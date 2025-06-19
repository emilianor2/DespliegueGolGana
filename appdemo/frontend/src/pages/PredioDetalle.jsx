import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/PredioDetalle.css"; // Importa el archivo CSS

const PredioDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [predio, setPredio] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const predioRes = await axios.get(`http://localhost:5000/api/predios/${id}`);
        setPredio(predioRes.data);
        
        const canchasRes = await axios.get(`http://localhost:5000/api/predios/${id}/canchas`);
        setCanchas(canchasRes.data);
      } catch (error) {
        console.error("Error al obtener datos del predio:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleReservar = (cancha) => {
    navigate(`/reservar/${cancha.IDCancha}`, {
      state: { cancha }
    });
  };
  
  if (loading) {
    return <div className="predio-detalle-container cargando">Cargando información del predio...</div>;
  }
  
  return (
    <div className="predio-detalle-container">
      {predio && (
        <>
          <h2 className="predio-titulo">{predio.NombrePredio}</h2>
          <p className="predio-ubicacion">Ubicación: {predio.Ubicacion}</p>
          
          <div className="predio-info">
            {/* Puedes agregar más información del predio aquí si lo deseas */}
            <p><strong>Teléfono:</strong> {predio.Telefono || 'No disponible'}</p>
            <p><strong>Horario:</strong> {predio.Horario || 'No disponible'}</p>
          </div>
          
          <h3 className="canchas-titulo">Canchas disponibles</h3>
          {canchas.length > 0 ? (
            <ul className="canchas-lista">
              {canchas.map((cancha) => (
                <li key={cancha.IDCancha} className="cancha-item">
                  <p><strong>Nombre:</strong> {cancha.NombreCancha}</p>
                  <p><strong>Capacidad:</strong> {cancha.Capacidad} personas</p>
                  <p><strong>Disciplina:</strong> {cancha.Disciplina}</p>
                  <button
                    className="btn-reservar"
                    onClick={() => handleReservar(cancha)}
                  >
                    Reservar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="sin-canchas">No hay canchas disponibles para este predio.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PredioDetalle;
