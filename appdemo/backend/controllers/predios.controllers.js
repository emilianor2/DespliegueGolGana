const db = require("../config/db");

// Crear un nuevo predio y asignarlo al empleado autenticado
exports.createPredio = (req, res) => {
    const { NombrePredio, Ubicacion, Latitud, Longitud } = req.body;
    const IDUsuario = req.usuario.id;
    const tipoUsuario = req.usuario.tipo;

    // Verificar si el usuario es un empleado o administrador
    if (tipoUsuario !== "empleado" && tipoUsuario !== "admin") {
        return res.status(403).json({ error: "Solo los empleados y administradores pueden crear predios." });
    }

    // Insertar nuevo predio
    db.query(
        "INSERT INTO Predios (NombrePredio, Ubicacion, Latitud, Longitud) VALUES (?, ?, ?, ?)",
        [NombrePredio, Ubicacion, Latitud, Longitud],
        (err, result) => {
            if (err) {
                console.error("❌ Error al insertar predio:", err);
                return res.status(500).json({ error: "Error al crear el predio." });
            }

            const nuevoIDPredio = result.insertId;

            // Si el usuario es un empleado, asociar el predio a su cuenta
            if (tipoUsuario === "empleado") {
                db.query(
                    "UPDATE Empleados SET IDPredio = ? WHERE IDUsuario = ?",
                    [nuevoIDPredio, IDUsuario],
                    (err) => {
                        if (err) return res.status(500).json({ error: "Error al asociar predio al empleado." });

                        res.json({ message: "✅ Predio creado y asociado correctamente." });
                    }
                );
            } else {
                res.json({ message: "✅ Predio creado correctamente." });
            }
        }
    );
};

// Obtener todos los predios
exports.getPredios = (req, res) => {
    db.query("SELECT * FROM Predios", (err, results) => {
        if (err) return res.status(500).json({ error: "Error obteniendo predios." });
        console.log("Resultados:", results); // Asegúrate de que se están devolviendo todos los predios
        res.json(results); // Devuelve todos los predios
    });
};

// Obtener predio por ID
exports.getPredioById = (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM Predios WHERE IDPredio = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Error obteniendo predio." });

        if (results.length === 0) {
            return res.status(404).json({ error: "Predio no encontrado." });
        }

        res.json(results[0]);
    });
};

// Actualizar predio (solo dueño)
exports.updatePredio = (req, res) => {
    const { id } = req.params;
    const { NombrePredio, Ubicacion, Latitud, Longitud } = req.body;
    const userId = req.usuario.id;

    db.query("SELECT * FROM Predios WHERE IDPredio = ? AND IDUsuario = ?", [id, userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Error verificando permiso." });

        if (results.length === 0) {
            return res.status(403).json({ error: "No tienes permiso para editar este predio." });
        }

        db.query(
            "UPDATE Predios SET NombrePredio = ?, Ubicacion = ?, Latitud = ?, Longitud = ? WHERE IDPredio = ?",
            [NombrePredio, Ubicacion, Latitud, Longitud, id],
            (err) => {
                if (err) return res.status(500).json({ error: "Error actualizando el predio." });

                res.json({ message: "Predio actualizado correctamente." });
            }
        );
    });
};

// Eliminar predio (solo dueño)
exports.deletePredio = (req, res) => {
    const { id } = req.params;
    const userId = req.usuario.id;

    db.query("SELECT * FROM Predios WHERE IDPredio = ? AND IDUsuario = ?", [id, userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Error verificando el predio." });

        if (results.length === 0) {
            return res.status(403).json({ error: "No tienes permiso para eliminar este predio." });
        }

        db.query("DELETE FROM Predios WHERE IDPredio = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: "Error eliminando predio." });

            res.json({ message: "Predio eliminado correctamente." });
        });
    });
};

exports.getPrediosCercanos = (req, res) => {
    const { lat, lng, distancia } = req.query;

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const distanciaMaxima = parseFloat(distancia) || 10;

    if (!latNum || !lngNum) {
        return res.status(400).json({ error: "Coordenadas inválidas" });
    }

    const query = `
        SELECT *, (
            6371 * acos(
                cos(radians(?)) * cos(radians(Latitud)) *
                cos(radians(Longitud) - radians(?)) +
                sin(radians(?)) * sin(radians(Latitud))
            )
        ) AS distancia
        FROM Predios
        HAVING distancia < ?
        ORDER BY distancia ASC
    `;

    db.query(query, [latNum, lngNum, latNum, distanciaMaxima], (err, results) => {
        if (err) return res.status(500).json({ error: "Error buscando predios cercanos" });
        res.json(results);
    });
};

exports.getMiPredio = (req, res) => {
    const IDUsuario = req.usuario.id;

    db.query(
        `SELECT P.* 
         FROM Predios P 
         JOIN Empleados E ON P.IDPredio = E.IDPredio 
         WHERE E.IDUsuario = ?`,
        [IDUsuario],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Error obteniendo tu predio." });
            if (result.length === 0) return res.status(404).json({ error: "No tienes un predio asignado." });
            res.json(result[0]);
        }
    );
};

exports.getPrediosConCanchas = (req, res) => {
    const query = `
        SELECT P.*, C.IDCancha, C.NombreCancha, D.NombreDisciplina
        FROM Predios P
        LEFT JOIN Canchas C ON P.IDPredio = C.IDPredio
        LEFT JOIN Disciplinas D ON C.IDDisciplina = D.IDDisciplina
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Error al obtener predios con canchas." });

        const prediosMap = {};

        results.forEach(row => {
            const predioId = row.IDPredio;

            if (!prediosMap[predioId]) {
                prediosMap[predioId] = {
                    IDPredio: predioId,
                    NombrePredio: row.NombrePredio,
                    Ubicacion: row.Ubicacion,
                    Latitud: row.Latitud,
                    Longitud: row.Longitud,
                    Canchas: [],
                };
            }

            if (row.IDCancha) {
                prediosMap[predioId].Canchas.push({
                    IDCancha: row.IDCancha,
                    Nombre: row.NombreCancha,
                    Disciplina: row.NombreDisciplina,
                });
            }
        });

        res.json(Object.values(prediosMap));
    });
};
