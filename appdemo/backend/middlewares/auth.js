const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
    // Verificar el encabezado de autorización
    const authHeader = req.header('Authorization');
    console.log("📩 Token recibido:", authHeader); // Verificar si el token llega correctamente

    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token del encabezado

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado correctamente' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decodificado:", decoded);

        // Consultar el tipo de usuario en la base de datos usando el ID del usuario decodificado
        db.query("SELECT Tipo FROM Usuarios WHERE IDUsuario = ?", [decoded.id], (err, results) => {
            if (err) {
                console.error("❌ Error al consultar la base de datos:", err);
                return res.status(500).json({ error: "Error obteniendo el rol del usuario" });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            // Almacenar la información del usuario decodificado en la solicitud
            req.usuario = { id: decoded.id, tipo: results[0].Tipo };
            next(); // Continuar al siguiente middleware o ruta
        });

    } catch (err) {
        // Manejar error de token expirado
        if (err.name === 'TokenExpiredError') {
            console.error("❌ Token expirado:", err);
            return res.status(401).json({ error: 'Token expirado. Por favor, vuelve a iniciar sesión.' });
        }

        // Manejar otros errores de token
        console.error("❌ Error al verificar el token:", err);
        return res.status(400).json({ error: 'Token inválido' });
    }
};

module.exports = verificarToken;
