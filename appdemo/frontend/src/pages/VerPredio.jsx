// src/pages/VerPredio.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VerPredio = () => {
  const { id } = useParams();
  const [predio, setPredio] = useState({});
  const [canchas, setCanchas] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/predios/${id}`)
      .then((res) => setPredio(res.data))
      .catch((err) => console.error("Error al obtener predio", err));

    axios.get(`http://localhost:5000/api/canchas/predios/${id}/canchas`)
      .then((res) => setCanchas(res.data))
      .catch((err) => console.error("Error al obtener canchas", err));
  }, [id]);

  return (
    <div>
      <h2>{predio.NombrePredio}</h2>
      <p><strong>Ubicación:</strong> {predio.Ubicacion}</p>

      <h3>Canchas disponibles</h3>
      <ul>
        {canchas.map((cancha) => (
          <li key={cancha.IDCancha}>
            <Link to={`/cancha/${cancha.IDCancha}`}>
              {cancha.NombreCancha} ({cancha.Disciplina || "Sin Disciplina"} - Capacidad: {cancha.Capacidad})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerPredio;
