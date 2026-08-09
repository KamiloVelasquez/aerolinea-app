const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET todos los vuelos (público)
router.get('/', (req, res) => {
  db.query('SELECT * FROM vuelos ORDER BY id DESC', (err, result) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    res.json(result);
  });
});

// POST crear vuelo (solo admin)
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  const { origen, destino, precio } = req.body;

  if (!origen || !destino || !precio) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  db.query(
    'INSERT INTO vuelos (origen, destino, precio) VALUES (?, ?, ?)',
    [origen, destino, precio],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' });
      res.status(201).json({ message: 'Vuelo creado', id: result.insertId });
    }
  );
});

// DELETE eliminar vuelo (solo admin)
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  db.query('DELETE FROM reservas WHERE vuelo_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error eliminando reservas asociadas' });

    db.query('DELETE FROM vuelos WHERE id = ?', [req.params.id], (err2, result) => {
      if (err2) return res.status(500).json({ error: 'Error eliminando vuelo' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Vuelo no encontrado' });
      res.json({ message: 'Vuelo eliminado' });
    });
  });
});

module.exports = router;
