const db = require("../config/db");

// Obtener reservas del usuario autenticado (para clientes)
exports.getReservas = (req, res) => {
    const userId = req.usuario.id; // Obtenemos el ID del usuario desde el token decodificado

    db.query("SELECT * FROM Reservas WHERE IDUsuario = ?", [userId], (err, results) => {
        if (err) {
            console.error("❌ Error al obtener reservas:", err);
            return res.status(500).json({ error: "Error obteniendo reservas" });
        }

        res.json(results);
    });
};

// Obtener reservas confirmadas de una cancha en una semana
exports.getReservasPorCanchaYSemana = (req, res) => {
    const { id } = req.params;
    const { inicio } = req.query;

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaInicio.getDate() + 7); // hasta el domingo

    const sql = `
    SELECT DATE(FechaReserva) AS FechaReserva, HoraReserva 
    FROM Reservas 
    WHERE IDCancha = ? 
      AND FechaReserva BETWEEN ? AND ?
      AND EstadoReserva = 'Confirmada'
    `;


    db.query(
        sql,
        [id, fechaInicio.toISOString().split("T")[0], fechaFin.toISOString().split("T")[0]],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al obtener reservas" });
            }
            res.json(results);
        }
    );
};

// Obtener reservas de un predio (para empleados)
exports.getTodasLasReservas = (req, res) => {
    const tipoUsuario = req.usuario.tipo;
    const userId = req.usuario.id;

    if (tipoUsuario !== "empleado") {
        return res.status(403).json({ error: "Acceso denegado: solo empleados pueden gestionar reservas" });
    }

    // Obtener el IDPredio del empleado
    db.query(
        "SELECT IDPredio FROM Empleados WHERE IDUsuario = ?",
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Error obteniendo el predio del empleado" });

            if (results.length === 0) {
                return res.status(404).json({ error: "Empleado no tiene predio asignado" });
            }

            const idPredio = results[0].IDPredio;

            // Obtener las reservas de las canchas de ese predio
            db.query(
                `SELECT R.* FROM Reservas R 
                JOIN Canchas C ON R.IDCancha = C.IDCancha 
                WHERE C.IDPredio = ?`,
                [idPredio],
                (err, reservas) => {
                    if (err) return res.status(500).json({ error: "Error obteniendo reservas del predio" });

                    res.json(reservas);
                }
            );
        }
    );
};

// Crear una nueva reserva
exports.createReserva = (req, res) => {
    const userId = req.usuario.id;
    const { IDCancha, FechaReserva, HoraReserva, MetodoPago } = req.body;

    if (!IDCancha || !FechaReserva || !HoraReserva || !MetodoPago) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    db.query(
        "INSERT INTO Reservas (IDUsuario, IDCancha, FechaReserva, HoraReserva, MetodoPago, EstadoReserva) VALUES (?, ?, ?, ?, ?, 'Pendiente')",
        [userId, IDCancha, FechaReserva, HoraReserva, MetodoPago],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Error al crear la reserva" });

            res.json({ message: "Reserva creada exitosamente" });
        }
    );
};

// Confirmar reserva (solo empleados)
exports.confirmarReserva = (req, res) => {
    const { IDReserva } = req.params;

    db.query(
        "UPDATE Reservas SET EstadoReserva = 'Confirmada' WHERE IDReserva = ?",
        [IDReserva],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Error al confirmar la reserva" });
            res.json({ message: "Reserva confirmada correctamente" });
        }
    );
};

// Cancelar reserva (solo empleados)
exports.cancelarReserva = (req, res) => {
    const { IDReserva } = req.params;

    db.query(
        "UPDATE Reservas SET EstadoReserva = 'Cancelada' WHERE IDReserva = ?",
        [IDReserva],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Error al cancelar la reserva" });
            res.json({ message: "Reserva cancelada correctamente" });
        }
    );
};

