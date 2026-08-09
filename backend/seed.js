require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: 'mysql',
  multipleStatements: true
});

function query(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function createDatabase() {
  return new Promise((resolve, reject) => {
    const dbName = process.env.DB_NAME || 'aerolinea';
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (err) => {
      if (err) return reject(err);
      connection.query(`USE \`${dbName}\``, (useErr) => {
        if (useErr) return reject(useErr);
        resolve();
      });
    });
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    const sql = [
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        email VARCHAR(150) UNIQUE,
        password VARCHAR(255),
        rol VARCHAR(20)
      )`,
      `CREATE TABLE IF NOT EXISTS vuelos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        origen VARCHAR(100),
        destino VARCHAR(100),
        precio DECIMAL(10,2)
      )`,
      `CREATE TABLE IF NOT EXISTS reservas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        vuelo_id INT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (vuelo_id) REFERENCES vuelos(id)
      )`
    ];

    connection.query(sql.join('; '), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function run() {
  await new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  await createDatabase();
  await createTables();

  const email = process.env.SEED_USER_EMAIL || 'user@example.com';
  const password = process.env.SEED_USER_PASS || 'password123';
  const nombre = 'Usuario de Prueba';
  const hashed = await bcrypt.hash(password, 10);

  // Seed usuario normal
  const rows = await query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (rows && rows.length > 0) {
    console.log('Usuario seed ya existe:', email);
  } else {
    const r = await query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, "user")',
      [nombre, email, hashed]
    );
    console.log('Usuario seed creado con id', r.insertId);
  }

  // Seed usuario admin
  const adminEmail = 'admin@aerolinea.com';
  const adminPass = await bcrypt.hash('admin123', 10);
  const adminRows = await query('SELECT id FROM usuarios WHERE email = ?', [adminEmail]);
  if (adminRows && adminRows.length > 0) {
    console.log('Usuario admin ya existe:', adminEmail);
  } else {
    const ra = await query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, "admin")',
      ['Administrador', adminEmail, adminPass]
    );
    console.log('Usuario admin creado con id', ra.insertId);
  }

  // Seed vuelo
  const filas = await query('SELECT id FROM vuelos LIMIT 1');
  if (filas && filas.length > 0) {
    console.log('Ya existe al menos un vuelo de prueba');
  } else {
    const r2 = await query(
      'INSERT INTO vuelos (origen, destino, precio) VALUES (?, ?, ?)',
      ['Bogotá', 'Medellín', 120.50]
    );
    console.log('Vuelo seed creado con id', r2.insertId);
  }

  connection.end();
  console.log('Seed completado exitosamente.');
}

run().catch(err => {
  console.error(err);
  connection.end();
  process.exit(1);
});
