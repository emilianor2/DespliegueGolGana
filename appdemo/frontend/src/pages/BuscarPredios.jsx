import { useState } from "react";
import { getCoordinatesFromAddress } from "../services/geoService";
import axios from "axios";
import "../style/BuscarPredios.css"; // Importar el CSS

// Componentes
import BuscadorDireccion from "../components/buscarPredios/BuscadorDireccion";
import FiltroDistancia from "../components/buscarPredios/FiltroDistancia";
import ListaPredios from "../components/buscarPredios/ListaPredios";
import Mapa from "../components/buscarPredios/MapaPredios";

const BuscarPredios = () => {
    const [predios, setPredios] = useState([]);
    const [coordenadas, setCoordenadas] = useState(null);
    const [distancia, setDistancia] = useState(10);
    
    const buscar = async (input, desdeCoordenadas = false) => {
        try {
            let lat, lng;
            
            if (desdeCoordenadas) {
                lat = input.lat;
                lng = input.lng;
            } else {
                const coords = await getCoordinatesFromAddress(input);
                lat = coords.lat;
                lng = coords.lng;
            }
            
            setCoordenadas({ lat, lng });
            
            const response = await axios.get(`http://localhost:5000/api/predios/cercanos?lat=${lat}&lng=${lng}&distancia=${distancia}`);
            setPredios(response.data);
        } catch (error) {
            console.error("Error buscando predios:", error);
        }
    };
    
    return (
        <div className="buscar-predios-container">
            <h2>Buscar Predios</h2>
            <div className="buscador-seccion">
                <BuscadorDireccion onBuscar={buscar} />
            </div>
            <div className="filtro-distancia">
                <FiltroDistancia distancia={distancia} setDistancia={setDistancia} />
            </div>
            
            {coordenadas && (
                <div className="mapa-container">
                    <Mapa lat={coordenadas.lat} lng={coordenadas.lng} predios={predios} />
                </div>
            )}
            
            <ListaPredios predios={predios} />
        </div>
    );
};

export default BuscarPredios;