const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1908',
    database: process.env.DB_NAME || 'golgana'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar la base de datos:', err);
        return;
    }
    console.log('🔥 Conectado a la base de datos MySQL');
});


module.exports = db;
