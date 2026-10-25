const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const nombre = typeof req.body.nombre === 'string' ? req.body.nombre.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
  }
  if (nombre.length > 100 || email.length > 150 || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Revisa el nombre y el formato del email' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, 'user'],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El email ya está registrado' });
          }
          console.error('Error guardando usuario:', err.message);
          return res.status(500).json({ error: 'No se pudo guardar el usuario en la base de datos' });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente', id: result.insertId });
      }
    );
  } catch (error) {
    console.error('Error preparando registro:', error.message);
    res.status(500).json({ error: 'No se pudo crear la cuenta' });
  }
});

router.post('/login', (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const { password } = req.body;

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
