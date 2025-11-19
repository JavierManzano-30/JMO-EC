/* eslint-env node */
import process from 'node:process';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import conversationsRouter from './routes/conversations.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.SERVER_PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/conversations', conversationsRouter);
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  if (res.headersSent) {
    return next(err);
  }
  return res
    .status(err.status || 500)
    .json({ message: err.message ?? 'Error interno en el servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor de BubblyBot API escuchando en http://localhost:${PORT}`);
});
