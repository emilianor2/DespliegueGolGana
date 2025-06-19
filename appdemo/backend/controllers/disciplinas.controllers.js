const db = require("../config/db"); // Suponiendo que tienes un archivo de conexión a la base de datos.

exports.getDisciplinas = (req, res) => {
    db.query("SELECT * FROM Disciplinas", (err, results) => {
        if (err) {
            console.error("Error al obtener disciplinas", err);
            return res.status(500).json({ error: "Error al obtener disciplinas" });
        }
        res.json(results); // Devuelve las disciplinas en formato JSON
    });
};
