const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Obtener usuarios (requiere autenticación)
exports.getUsuarios = (req, res) => {
    db.query('SELECT * FROM Usuarios', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al obtener usuarios' });
        res.json(results);
    });
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
    const { Nombre, Telefono, Correo, Password, Tipo } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        db.query(
            'INSERT INTO Usuarios (Nombre, Telefono, Correo, Password, Tipo) VALUES (?, ?, ?, ?, ?)',
            [Nombre, Telefono, Correo, hashedPassword, Tipo],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Error al crear usuario' });

                const nuevoIDUsuario = result.insertId;

                if (Tipo === 'empleado') {
                    db.query(
                        'INSERT INTO Empleados (IDUsuario) VALUES (?)',
                        [nuevoIDUsuario],
                        (err2) => {
                            if (err2) return res.status(500).json({ message: 'Error al crear entrada en Empleados' });

                            return res.json({ message: 'Empleado creado correctamente' });
                        }
                    );
                } else {
                    res.json({ message: 'Usuario creado correctamente' });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Error al encriptar la contraseña' });
    }
};

// Login de usuario
exports.loginUsuario = (req, res) => {
    const { Correo, Password } = req.body;
    db.query('SELECT * FROM Usuarios WHERE Correo = ?', [Correo], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        
        const usuario = results[0];
        const passwordValido = await bcrypt.compare(Password, usuario.Password);
        if (!passwordValido) return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        
        const token = jwt.sign(
            { id: usuario.IDUsuario, tipo: usuario.Tipo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ 
            message: 'Inicio de sesión exitoso', 
            token, 
            usuario: { 
                IDUsuario: usuario.IDUsuario, 
                Nombre: usuario.Nombre, 
                Correo: usuario.Correo, 
                tipo: usuario.Tipo 
            }
        });
    });
};
