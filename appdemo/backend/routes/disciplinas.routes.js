const express = require("express");
const { getDisciplinas } = require("../controllers/disciplinas.controllers");
const router = express.Router();

// Endpoint GET para obtener todas las disciplinas
router.get("/", getDisciplinas);

module.exports = router;
