// src/pages/VerCancha.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerCancha = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cancha, setCancha] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/canchas/${id}`)
      .then((res) => setCancha(res.data))
      .catch((err) => console.error("Error al obtener cancha", err));
  }, [id]);

  const reservarCancha = () => {
    navigate(`/reservar-cancha/${cancha.IDCancha}`);
  };

  if (!cancha) return <p>Cargando cancha...</p>;

  return (
    <div>
      <h2>{cancha.NombreCancha}</h2>
      <p><strong>Capacidad:</strong> {cancha.Capacidad}</p>
      <p><strong>Precio:</strong> ${cancha.Precio}</p>
      <p><strong>Horario Disponible:</strong> {cancha.HorarioDisponible}</p>
      <button onClick={reservarCancha}>Reservar esta cancha</button>
    </div>
  );
};

export default VerCancha;
