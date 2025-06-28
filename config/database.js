const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Verificamos si estamos en un entorno de producción (Render define NODE_ENV como 'production')
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    // --- CONFIGURACIÓN PARA PRODUCCIÓN (RENDER + NEON) ---
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        // Opciones de conexión específicas para producción
        dialectOptions: {
            // Habilitar SSL y configurarlo para que no rechace la conexión por certificados autofirmados
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        // Es una buena práctica desactivar los logs de SQL en producción
        logging: false
    });
} else {
    // --- CONFIGURACIÓN PARA DESARROLLO LOCAL (XAMPP) ---
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mysql'
        }
    );
}

module.exports = sequelize;
