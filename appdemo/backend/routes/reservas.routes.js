const express = require("express");
const verificarToken = require("../middlewares/auth");
const {
    getReservas,
    getTodasLasReservas,
    createReserva,
    confirmarReserva,
    cancelarReserva, 
    getReservasPorCanchaYSemana
} = require("../controllers/reservas.controllers");

const router = express.Router();
const reservaController = require("../controllers/reservas.controllers");

// Rutas para clientes (requieren autenticación)
router.get("/", verificarToken, getReservas);
router.post("/", verificarToken, createReserva);
router.get('/canchas/:id/semana', getReservasPorCanchaYSemana);



// Rutas para empleados (requieren autenticación y tipo de usuario 'empleado')
router.get("/admin", verificarToken, getTodasLasReservas);
router.put("/confirmar/:IDReserva", verificarToken, confirmarReserva);
router.put("/cancelar/:IDReserva", verificarToken, cancelarReserva);

module.exports = router;
