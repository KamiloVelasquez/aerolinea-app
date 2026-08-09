const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET todas las reservas (admin)
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
  const sql = `
    SELECT r.id, r.usuario_id, r.vuelo_id,
           u.nombre AS usuario_nombre, u.email AS usuario_email,
           v.origen, v.destino, v.precio
    FROM reservas r
    JOIN usuarios u ON r.usuario_id = u.id
    JOIN vuelos v ON r.vuelo_id = v.id
    ORDER BY r.id DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    res.json(result);
  });
});

// GET reservas del usuario autenticado
router.get('/mis-reservas', authMiddleware, (req, res) => {
  const sql = `
    SELECT r.id, r.vuelo_id,
           v.origen, v.destino, v.precio
    FROM reservas r
    JOIN vuelos v ON r.vuelo_id = v.id
    WHERE r.usuario_id = ?
    ORDER BY r.id DESC
  `;
  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    res.json(result);
  });
});

// POST crear reserva (usuario autenticado)
router.post('/', authMiddleware, (req, res) => {
  const usuario_id = req.user.id;
  const { vuelo_id } = req.body;

  if (!vuelo_id) {
    return res.status(400).json({ error: 'Falta vuelo_id' });
  }

  db.query('SELECT id FROM vuelos WHERE id = ?', [vuelo_id], (err, vuelos) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    if (!vuelos || vuelos.length === 0) return res.status(404).json({ error: 'Vuelo no encontrado' });

    db.query(
      'INSERT INTO reservas (usuario_id, vuelo_id) VALUES (?, ?)',
      [usuario_id, vuelo_id],
      (err2, result) => {
        if (err2) return res.status(500).json({ error: 'No se pudo crear la reserva' });
        res.status(201).json({ message: 'Reserva creada exitosamente', reservaId: result.insertId });
      }
    );
  });
});

// DELETE cancelar reserva (usuario autenticado o admin)
router.delete('/:id', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.rol;

  if (userRole === 'admin') {
    db.query('DELETE FROM reservas WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Reserva no encontrada' });
      res.json({ message: 'Reserva cancelada' });
    });
  } else {
    db.query('DELETE FROM reservas WHERE id = ? AND usuario_id = ?', [req.params.id, userId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Reserva no encontrada o no autorizada' });
      res.json({ message: 'Reserva cancelada exitosamente' });
    });
  }
});

module.exports = router;
