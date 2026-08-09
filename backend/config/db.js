const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'aerolinea'
});

connection.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err.message);
    return;
  }
  console.log('MySQL conectado');
});

connection.on('error', err => {
  console.error('MySQL error:', err && err.code ? `${err.code} - ${err.message}` : err);
});

module.exports = connection;
