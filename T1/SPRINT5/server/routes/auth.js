/* eslint-env node */
import bcrypt from 'bcryptjs';
import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

const mapUser = (row) => ({
  id: row.id,
  username: row.username,
  email: row.email,
  displayName: row.display_name,
  avatarUrl: row.avatar_url,
  role: row.role,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const verifyPassword = async (plainPassword, storedHash) => {
  if (!storedHash) {
    return false;
  }

  if (storedHash.startsWith('$2')) {
    try {
      return await bcrypt.compare(plainPassword, storedHash);
    } catch (error) {
      console.warn('No se pudo verificar el hash con bcrypt:', error);
      return false;
    }
  }

  return plainPassword === storedHash;
};

router.post('/login', async (req, res, next) => {
  try {
    const { username = '', password = '' } = req.body ?? {};
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return res
        .status(400)
        .json({ message: 'Debes indicar un nombre de usuario y contraseña válidos.' });
    }

    const [rows] = await pool.query(
      `SELECT id, username, email, display_name, avatar_url, role, status, created_at, updated_at, password_hash
       FROM users WHERE username = ? LIMIT 1`,
      [trimmedUsername],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    const row = rows[0];
    const isValidPassword = await verifyPassword(trimmedPassword, row.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    const user = mapUser(row);

    if (user.status !== 'active') {
      return res
        .status(403)
        .json({ message: 'El usuario no tiene permiso para iniciar sesión en este momento.' });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

export default router;
