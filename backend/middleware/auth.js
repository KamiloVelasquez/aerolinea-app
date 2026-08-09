const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token requerido' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token mal formado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol admin' });
  }
}

module.exports = { authMiddleware, adminMiddleware };
