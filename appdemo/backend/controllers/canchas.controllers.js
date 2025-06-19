const db = require("../config/db");

// Crear cancha permitiendo seleccionar predio
exports.crearCancha = (req, res) => {
    const { IDPredio, IDDisciplina, NombreCancha, Capacidad, Precio, HorarioDisponible } = req.body;

    if (!IDPredio || !IDDisciplina || !NombreCancha || !Capacidad || !Precio || !HorarioDisponible) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
        INSERT INTO Canchas 
        (IDPredio, IDDisciplina, NombreCancha, Capacidad, Precio, HorarioDisponible)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [IDPredio, IDDisciplina, NombreCancha, Capacidad, Precio, HorarioDisponible];

    db.query(sql, values, (err) => {
        if (err) {
            console.error("Error al crear cancha:", err);
            return res.status(500).json({ error: "Error al crear cancha" });
        }

        res.json({ message: "Cancha creada correctamente" });
    });
};

// Obtener canchas del predio del empleado (CON NombrePredio incluido)
exports.obtenerCanchasEmpleado = (req, res) => {
    const IDUsuario = req.usuario.id;
    console.log("📩 Token recibido:", req.usuario)

    db.query("SELECT IDPredio FROM Empleados WHERE IDUsuario = ?", [IDUsuario], (err, result) => {
        if (err || result.length === 0) return res.status(400).json({ error: "Empleado sin predio asignado" });

        const IDPredio = result[0].IDPredio;

        const sql = `
            SELECT 
                C.IDCancha,
                C.NombreCancha,
                C.Capacidad,
                C.Precio,
                C.HorarioDisponible,
                D.NombreDisciplina,
                P.NombrePredio
            FROM Canchas C
            JOIN Disciplinas D ON C.IDDisciplina = D.IDDisciplina
            JOIN Predios P ON C.IDPredio = P.IDPredio
            WHERE C.IDPredio = ?
        `;

        db.query(sql, [IDPredio], (err, results) => {
            if (err) return res.status(500).json({ error: "Error al obtener canchas" });
            res.json(results);
        });
    });
};


// Editar cancha
exports.actualizarCancha = (req, res) => {
    const IDCancha = req.params.id;
    const { NombreCancha, Capacidad, Precio, HorarioDisponible, IDDisciplina } = req.body;

    db.query(
        `UPDATE Canchas SET 
            NombreCancha = ?, 
            Capacidad = ?, 
            Precio = ?, 
            HorarioDisponible = ?, 
            IDDisciplina = ?
         WHERE IDCancha = ?`,
        [NombreCancha, Capacidad, Precio, HorarioDisponible, IDDisciplina, IDCancha],
        (err) => {
            if (err) return res.status(500).json({ error: "Error al actualizar cancha" });
            res.json({ message: "Cancha actualizada correctamente" });
        }
    );
};


// Eliminar cancha
exports.eliminarCancha = (req, res) => {
    const IDCancha = req.params.id;
    console.log("ID recibido:", IDCancha);

    db.query("DELETE FROM Canchas WHERE IDCancha = ?", [IDCancha], (err, result) => {
        if (err) {
            console.error("Error al eliminar:", err);
            return res.status(500).json({ error: "Error al eliminar cancha" });
        }

        console.log("Resultado:", result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cancha no encontrada" });
        }

        res.json({ message: "Cancha eliminada correctamente" });
    });
};


// Obtener canchas por predio (con nombre de la disciplina incluido)
exports.getCanchasPorPredio = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            C.IDCancha,
            C.NombreCancha,
            C.Capacidad,
            C.Precio,
            C.HorarioDisponible,
            D.NombreDisciplina AS Disciplina,
            P.NombrePredio AS Predio
        FROM Canchas C
        JOIN Disciplinas D ON C.IDDisciplina = D.IDDisciplina
        JOIN Predios P ON C.IDPredio = P.IDPredio
        WHERE C.IDPredio = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener canchas del predio" });

        res.json(result);
    });
};


exports.getCanchaById = (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT 
            C.IDCancha, 
            C.NombreCancha, 
            C.Capacidad, 
            C.Precio,
            C.HorarioDisponible,
            D.NombreDisciplina AS Disciplina
        FROM Canchas C
        JOIN Disciplinas D ON C.IDDisciplina = D.IDDisciplina
        WHERE C.IDCancha = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener la cancha" });
        if (result.length === 0) return res.status(404).json({ error: "Cancha no encontrada" });
        res.json(result[0]);
    });
};
