const express = require('express');
const db = require('../config/db'); // ✅ Este faltaba
const { getUsuarios, createUsuario, loginUsuario } = require('../controllers/usuarios.controllers');
const verificarToken = require('../middlewares/auth');

const router = express.Router();

router.post('/', createUsuario);
router.post('/login', loginUsuario);

// ✅ Ruta protegida corregida
router.get("/perfil", verificarToken, (req, res) => {
    const userId = req.usuario.id;

    db.query(
        "SELECT IDUsuario, Nombre, Telefono, Correo, Tipo FROM Usuarios WHERE IDUsuario = ?", 
        [userId], 
        (err, results) => {
            if (err) return res.status(500).json({ message: "Error obteniendo el perfil del usuario" });
            if (results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

            res.json(results[0]);
        }
    );
});


module.exports = router;
