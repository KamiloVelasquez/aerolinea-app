const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, "user")',
    [nombre, email, hash],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'El email ya está registrado' });
        }
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      res.json({ message: 'Usuario registrado exitosamente', id: result.insertId });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  db.query('SELECT * FROM usuarios WHERE email=?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    if (!results || results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = results[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h'
    });

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  });
});

module.exports = router;
