const FiltroDistancia = ({ distancia, setDistancia }) => {
    return (
        <div>
            <label>Distancia máxima: {distancia} km</label>
            <input
                type="range"
                min="1"
                max="50"
                value={distancia}
                onChange={(e) => setDistancia(e.target.value)}
            />
        </div>
    );
};

export default FiltroDistancia;
