// src/utils/leaflet-fix.js
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importa las imágenes desde la carpeta node_modules
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Elimina la función que intenta cargar desde rutas bloqueadas por Vite
delete L.Icon.Default.prototype._getIconUrl;

// Define nuevas rutas válidas
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});
