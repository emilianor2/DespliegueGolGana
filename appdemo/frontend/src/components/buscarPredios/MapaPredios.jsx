import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapaPredios = ({ lat, lng, predios }) => {
  if (!lat || !lng) return <p>Ubicación no disponible</p>;

  const centroInicial = [parseFloat(lat), parseFloat(lng)];

  return (
    <MapContainer center={centroInicial} zoom={13} style={{ height: "400px", marginTop: "1rem" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {predios
        .filter(p => p.Latitud && p.Longitud)
        .map(predio => (
          <Marker
            key={predio.IDPredio}
            position={[parseFloat(predio.Latitud), parseFloat(predio.Longitud)]}
          >
            <Popup>
              <strong>{predio.NombrePredio}</strong><br />
              {predio.Ubicacion}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default MapaPredios;