const axios = require('axios');
require('dotenv').config(); // Cargar las variables de entorno

// Función para obtener la ubicación de un predio usando OpenCage API
const obtenerUbicacionPredio = async (latitud, longitud) => {
  try {
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
      params: {
        key: process.env.OPEN_CAGE_API_KEY, // API Key de OpenCage
        q: `${latitud},${longitud}`, // Latitud y Longitud para buscar
        language: 'es', // Idioma (opcional)
      },
    });

    if (response.data.results.length > 0) {
      return response.data.results[0].formatted; // Devuelve la dirección
    } else {
      return 'Ubicación no encontrada';
    }
  } catch (error) {
    console.error('Error obteniendo la ubicación:', error);
    return 'Error al obtener la ubicación';
  }
};

module.exports = { obtenerUbicacionPredio };
