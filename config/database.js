const { Sequelize } = require('sequelize');

let sequelize;

// Si la variable de entorno DATABASE_URL existe (en producción), la usamos.
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
} else {
    // Si no, usamos la configuración local de .env para 
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
