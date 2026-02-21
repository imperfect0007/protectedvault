import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import vaultRoutes from './routes/vault';
import quickpadRoutes from './routes/quickpad';
import filesRoutes from './routes/files';

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const corsOrigin = process.env.CORS_ORIGIN;

app.use(
  cors({
    origin: corsOrigin
      ? corsOrigin.split(',').map((o) => o.trim())
      : isProduction
        ? false
        : true,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

app.use('/api/vault', vaultRoutes);
app.use('/api/quickpad', quickpadRoutes);
app.use('/api/files', filesRoutes);

const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (_, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Student Vault running on http://localhost:${PORT}`);
});
