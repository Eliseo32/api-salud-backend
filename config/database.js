// Importar la clase Sequelize desde la librería
const { Sequelize } = require('sequelize');

// Cargar las variables de entorno para la configuración de la base de datos
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

// Crear una nueva instancia de Sequelize con la configuración
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql' // Indicar que estamos usando MySQL
});

// Exportar la instancia de Sequelize para poder usarla en otras partes de la aplicación
module.exports = sequelize;
