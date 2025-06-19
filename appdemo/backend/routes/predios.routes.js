const express = require("express");
const { createPredio, 
    getPredios, 
    getPredioById, 
    updatePredio, 
    deletePredio, 
    getPrediosCercanos, 
    getMiPredio, 
    getPrediosConCanchas} = require("../controllers/predios.controllers");
const verificarToken = require("../middlewares/auth");
const {getCanchasPorPredio} = require("../controllers/canchas.controllers");
const router = express.Router();

router.get("/", getPredios);
router.get("/cercanos", getPrediosCercanos);
router.get("/mio", verificarToken, getMiPredio);
router.get('/con-canchas', getPrediosConCanchas);
router.get("/:id/canchas", getCanchasPorPredio);
router.get("/:id", getPredioById);
router.post("/", verificarToken, createPredio);
router.put("/:id", verificarToken, updatePredio);
router.delete("/:id", verificarToken, deletePredio);

module.exports = router;

