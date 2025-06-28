// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

// Importaciones de librerías y módulos
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Importación de TODOS los Modelos (para que Sequelize los sincronice)
const CentroDeSalud = require('./models/centro.model');
const Paciente = require('./models/paciente.model');
const Profesional = require('./models/profesional.model');
const Turno = require('./models/turno.model');
const Disponibilidad = require('./models/disponibilidad.model');

// --- DEFINIR RELACIONES ENTRE MODELOS ---
// Un Centro de Salud tiene muchos Profesionales
CentroDeSalud.hasMany(Profesional, { foreignKey: 'centroId' });
Profesional.belongsTo(CentroDeSalud, { foreignKey: 'centroId' });

// Un Paciente puede tener muchos Turnos
Paciente.hasMany(Turno, { foreignKey: 'pacienteId' });
Turno.belongsTo(Paciente, { foreignKey: 'pacienteId' });

// Un Profesional puede tener muchos Turnos
Profesional.hasMany(Turno, { foreignKey: 'profesionalId' });
Turno.belongsTo(Profesional, { foreignKey: 'profesionalId' });

// Un Profesional puede tener muchos horarios de Disponibilidad
Profesional.hasMany(Disponibilidad, { foreignKey: 'profesionalId' });
Disponibilidad.belongsTo(Profesional, { foreignKey: 'profesionalId' });


// Importación de Rutas
const centrosRoutes = require('./routes/centros.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const pacientesRoutes = require('./routes/pacientes.routes.js');
const turnosRoutes = require('./routes/turnos.routes.js');
const profesionalesRoutes = require('./routes/profesionales.routes.js');
const adminRoutes = require('./routes/admin.routes.js');
const disponibilidadRoutes = require('./routes/disponibilidad.routes.js');

// Creación de la aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde otros orígenes (nuestro frontend)
app.use(express.json()); // Para poder entender JSON en el cuerpo de las peticiones

// Configuración de Rutas
app.use('/api/v1/centros', centrosRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pacientes', pacientesRoutes);
app.use('/api/v1/turnos', turnosRoutes);
app.use('/api/v1/profesionales', profesionalesRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/disponibilidad', disponibilidadRoutes);

// Ruta Raíz
app.get('/', (req, res) => {
    res.send('API de Salud Comunitaria de Santa María - v1');
});

// Puerto del Servidor
const PORT = process.env.PORT || 3000;

// Función de Arranque del Servidor
async function startServer() {
    try {
        // Sincroniza los modelos con la base de datos.
        // Crea las tablas si no existen.
        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados con la base de datos.');

        // Verifica la conexión a la base de datos.
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Inicia el servidor para escuchar peticiones.
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
}

// Ejecutar la función de arranque
startServer();
