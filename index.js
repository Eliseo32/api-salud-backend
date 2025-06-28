require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Importar todos los modelos para que Sequelize los conozca
require('./models/centro.model');
require('./models/paciente.model');
require('./models/profesional.model');
require('./models/turno.model');
require('./models/disponibilidad.model');

// Importar las relaciones para que se establezcan
require('./models/relations'); // Crearemos este archivo ahora

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Rutas
app.use('/api/v1/centros', require('./routes/centros.routes'));
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/pacientes', require('./routes/pacientes.routes'));
app.use('/api/v1/turnos', require('./routes/turnos.routes'));
app.use('/api/v1/profesionales', require('./routes/profesionales.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api/v1/disponibilidad', require('./routes/disponibilidad.routes'));

app.get('/', (req, res) => {
    res.send('API de Salud Comunitaria de Santa María - v1');
});

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // 1. Autenticar la conexión a la base de datos PRIMERO.
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // 2. Sincronizar modelos DESPUÉS de una conexión exitosa.
        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados con la base de datos.');

        // 3. Iniciar el servidor Express SOLO si todo lo anterior tuvo éxito.
        app.listen(PORT, () => {
            console.log(`Servidor iniciado y escuchando en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('*** ERROR FATAL AL INICIAR EL SERVIDOR ***');
        console.error(error);
        process.exit(1); // Detiene el proceso si no se puede conectar a la DB
    }
}

startServer();
