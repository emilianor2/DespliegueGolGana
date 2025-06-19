import axios from "axios";

export const getCoordinatesFromAddress = async (address) => {
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

    const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&language=es`
    );

    const result = response.data.results[0];

    if (!result) {
        throw new Error("No se encontraron coordenadas para esta dirección.");
    }

    return {
        lat: result.geometry.lat,
        lng: result.geometry.lng,
    };
};
