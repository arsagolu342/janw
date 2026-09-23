import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import apiRoutes, { broadcastDataUpdate } from './routes/api.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import { readDb, writeDb, INITIAL_DATA } from './utils/db.js';
import { 
  initFirebaseAdmin, 
  getFirestoreSiteData, 
  saveFirestoreSiteData, 
  listenToFirestoreSiteData 
} from './utils/firebaseAdmin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Inicializar DB local
readDb();

// Middlewares
app.use(cors({
  origin: '*', // Permitir peticiones desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos subidos como estáticos
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Termales Jamanco Backend API',
    firebaseProject: 'terjamancoweb'
  });
});

// Servir frontend compilado en producción (dist)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no capturado:', err);
  res.status(500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Inicialización asíncrona de Firebase Admin y Sincronización
async function initializeAndSyncFirebase() {
  console.log('🔄 Conectando con Google Firebase Cloud (terjamancoweb)...');
  const { firestore, isInitialized } = initFirebaseAdmin();

  if (isInitialized && firestore) {
    try {
      // 1. Verificar si Firestore tiene datos
      const cloudData = await getFirestoreSiteData();

      if (!cloudData || Object.keys(cloudData).length === 0) {
        console.log('🌱 Firestore vacío: Sembrando datos iniciales en terjamanco_site/main_content...');
        const localDb = readDb();
        const { adminSettings, ...publicData } = localDb;
        await saveFirestoreSiteData(publicData, false);
        console.log('✅ Datos iniciales sincronizados en Google Cloud Firestore');
      } else {
        console.log('📥 Sincronizando datos de Firestore hacia el backend local...');
        const localDb = readDb();
        const merged = {
          ...localDb,
          ...cloudData,
          adminSettings: localDb.adminSettings || INITIAL_DATA.adminSettings
        };
        writeDb(merged);
        broadcastDataUpdate(cloudData);
        console.log('✅ Base de datos local actualizada desde Firestore');
      }

      // 2. Iniciar listener de cambios en tiempo real desde Firestore
      listenToFirestoreSiteData((updatedCloudData) => {
        if (updatedCloudData) {
          const localDb = readDb();
          const merged = {
            ...localDb,
            ...updatedCloudData,
            adminSettings: localDb.adminSettings || INITIAL_DATA.adminSettings
          };
          writeDb(merged);
          broadcastDataUpdate(updatedCloudData);
          console.log('⚡ [Realtime] Cambio detectado en Firestore y transmitido al público');
        }
      });

    } catch (err) {
      console.warn('⚠️ Advertencia durante sincronización inicial con Firebase:', err.message);
    }
  } else {
    console.warn('⚠️ No se pudo inicializar Firebase Admin. El servidor usará la base de datos local.');
  }
}

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🔥 Termales Jamanco Backend API`);
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📁 Carpeta de uploads: ${uploadsPath}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`☁️ Proyecto Firebase: terjamancoweb`);
  console.log(`=========================================`);

  initializeAndSyncFirebase();
});
