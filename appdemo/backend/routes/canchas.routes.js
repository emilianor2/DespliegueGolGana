const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/auth");
const {
    crearCancha,
    obtenerCanchasEmpleado,
    actualizarCancha,
    eliminarCancha,
    getCanchasPorPredio,
    getCanchaById
} = require("../controllers/canchas.controllers");

// Crear cancha
router.post("/", verificarToken, crearCancha);

router.get("/:id", getCanchaById);

// Obtener canchas del empleado
router.get("/", verificarToken, obtenerCanchasEmpleado);

// Editar cancha
router.put("/:id", verificarToken, actualizarCancha);

// Eliminar cancha
router.delete("/:id", verificarToken, eliminarCancha);

router.get("/predios/:id/canchas", getCanchasPorPredio);

module.exports = router;
