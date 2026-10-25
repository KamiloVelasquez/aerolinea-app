const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const vuelosRoutes = require('./routes/vuelos');
const reservasRoutes = require('./routes/reservas');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vuelos', vuelosRoutes);
app.use('/api/reservas', reservasRoutes);

const PORT = process.env.PORT || 5000;

db.initializeDatabase()
  .then(() => {
    console.log(`Base de datos "${process.env.DB_NAME || 'aerolinea'}" lista`);
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No fue posible inicializar MySQL:', error.message);
    process.exit(1);
  });
