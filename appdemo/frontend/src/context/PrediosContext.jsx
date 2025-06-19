import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PrediosContext = createContext();

export const usePredios = () => useContext(PrediosContext);

export const PrediosProvider = ({ children }) => {
    const [predios, setPredios] = useState([]);

    const fetchPredios = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/predios");
            setPredios(res.data);
        } catch (error) {
            console.error("Error cargando predios:", error);
        }
    };

    useEffect(() => {
        fetchPredios();
    }, []);

    return (
        <PrediosContext.Provider value={{ predios, fetchPredios }}>
            {children}
        </PrediosContext.Provider>
    );
};
