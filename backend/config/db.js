const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const databaseName = process.env.DB_NAME || 'aerolinea';
if (!/^[A-Za-z0-9_]+$/.test(databaseName)) {
  throw new Error('DB_NAME solo puede contener letras, números y guion bajo.');
}

const connectionOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || ''
};

const pool = mysql.createPool({
  ...connectionOptions,
  database: databaseName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

function query(sql, params, callback) {
  return pool.query(sql, params, callback);
}

function execute(connection, sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error) => error ? reject(error) : resolve());
  });
}

async function initializeDatabase() {
  const connection = mysql.createConnection(connectionOptions);
  try {
    await new Promise((resolve, reject) => {
      connection.connect((error) => error ? reject(error) : resolve());
    });
    await execute(connection, `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } finally {
    await new Promise((resolve) => connection.end(() => resolve()));
  }

  const tables = [
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      rol VARCHAR(20) NOT NULL DEFAULT 'user'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS vuelos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      origen VARCHAR(100),
      destino VARCHAR(100),
      precio DECIMAL(10,2)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS reservas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT,
      vuelo_id INT,
      CONSTRAINT fk_reservas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      CONSTRAINT fk_reservas_vuelo FOREIGN KEY (vuelo_id) REFERENCES vuelos(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  ];

  for (const sql of tables) {
    await new Promise((resolve, reject) => {
      pool.query(sql, (error) => error ? reject(error) : resolve());
    });
  }
  await new Promise((resolve, reject) => {
    pool.query('SELECT 1', (error) => error ? reject(error) : resolve());
  });
}

module.exports = { query, initializeDatabase, pool };
