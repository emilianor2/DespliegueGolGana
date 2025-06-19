import { Link } from "react-router-dom";
import "../../style/ListaPredios.css"; // Importa el archivo CSS

const ListaPredios = ({ predios }) => {
    if (!predios || predios.length === 0) {
        return <p className="sin-predios">No se encontraron predios disponibles</p>;
    }

    return (
        <ul className="lista-predios">
            {predios.map((predio) => (
                <li key={predio.IDPredio} className="predio-item">
                    <span className="predio-nombre">{predio.NombrePredio}</span>
                    <span className="predio-ubicacion">{predio.Ubicacion}</span>
                    <span className="predio-distancia">Distancia: {predio.distancia?.toFixed(2)} km</span>
                    <Link to={`/predios/${predio.IDPredio}`} className="predio-link">
                        Ver más
                    </Link>
                    
                    {/* Mostrar canchas si existen */}
                    {predio.Canchas && predio.Canchas.length > 0 && (
                        <ul className="canchas-lista">
                            {predio.Canchas.map((cancha) => (
                                <li key={cancha.IDCancha} className="cancha-item">
                                    <Link to={`/reservar/${cancha.IDCancha}`} className="cancha-link">
                                        Reservar {cancha.Nombre || 'Cancha sin nombre'} ({cancha.Tipo || 'Tipo desconocido'})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default ListaPredios;
