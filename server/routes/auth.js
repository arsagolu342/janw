import express from 'express';
import jwt from 'jsonwebtoken';
import { readDb, writeDb } from '../utils/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'terjamanco-secret-key-geotermal-2025-secure';

/**
 * POST /api/auth/login
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const db = readDb();
    const adminSettings = db.adminSettings || { username: 'admin', passwordHash: 'jamanco2025' };

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    if (username !== adminSettings.username || password !== adminSettings.passwordHash) {
      return res.status(401).json({ error: 'Credenciales inválidas. Por favor verifique.' });
    }

    // Actualizar último login
    db.adminSettings.lastLogin = new Date().toISOString();
    writeDb(db);

    const token = jwt.sign(
      { username: adminSettings.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        username: adminSettings.username,
        role: 'admin',
        lastLogin: db.adminSettings.lastLogin
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error en el servidor durante la autenticación' });
  }
});

/**
 * GET /api/auth/verify
 */
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ valid: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ valid: false, error: 'Token inválido o expirado' });
  }
});

/**
 * POST /api/auth/change-password
 */
router.post('/change-password', (req, res) => {
  try {
    const { currentPassword, newPassword, newUsername } = req.body;
    const db = readDb();
    const adminSettings = db.adminSettings || { username: 'admin', passwordHash: 'jamanco2025' };

    if (currentPassword !== adminSettings.passwordHash) {
      return res.status(400).json({ error: 'La contraseña actual no es correcta' });
    }

    if (newPassword && newPassword.length < 4) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 4 caracteres' });
    }

    if (newPassword) {
      db.adminSettings.passwordHash = newPassword;
    }
    if (newUsername && newUsername.trim()) {
      db.adminSettings.username = newUsername.trim();
    }

    writeDb(db);
    return res.json({ success: true, message: 'Credenciales actualizadas exitosamente' });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    return res.status(500).json({ error: 'Error al cambiar credenciales' });
  }
});

export default router;
