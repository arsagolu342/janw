import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configuración de almacenamiento Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de tipos de archivo permitidos (Imágenes y Audios)
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp|gif|svg\+xml|svg/;
  const allowedAudioTypes = /mp3|wav|ogg|mpeg|m4a|aac|webm|flac|audio\/mpeg|audio\/ogg|audio\/wav|audio\/mp4|audio\/x-m4a|audio\/webm|audio\/flac/;
  
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype.toLowerCase();

  const isImage = allowedImageTypes.test(mime) || allowedImageTypes.test(ext);
  const isAudio = allowedAudioTypes.test(mime) || allowedAudioTypes.test(ext) || mime.startsWith('audio/');

  if (isImage || isAudio) {
    return cb(null, true);
  }
  cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, WEBP, GIF, SVG) y audios (MP3, WAV, OGG, M4A, AAC, WEBM)'));
};

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB límite para audios e imágenes
  fileFilter
});

const router = express.Router();

/**
 * POST /api/upload
 * Subir una sola imagen o archivo
 */
router.post('/', (req, res, next) => {
  // Acepta campo 'image', 'file' o 'audio'
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Error en la subida de archivo' });
    }
    try {
      const file = req.files?.image?.[0] || req.files?.audio?.[0] || req.files?.file?.[0];
      if (!file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
      }

      const host = req.get('host');
      const protocol = req.protocol;
      const fileUrl = `/uploads/${file.filename}`;
      const fullUrl = `${protocol}://${host}${fileUrl}`;

      return res.status(200).json({
        success: true,
        message: 'Archivo subido exitosamente',
        url: fileUrl,
        fullUrl: fullUrl,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
    } catch (error) {
      console.error('Error procesando archivo:', error);
      return res.status(500).json({ error: 'Error al procesar el archivo' });
    }
  });
});

/**
 * POST /api/upload/audio
 * Subir audio específicamente
 */
router.post('/audio', (req, res) => {
  upload.single('audio')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Error al subir el archivo de audio' });
    }
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo de audio' });
      }

      const host = req.get('host');
      const protocol = req.protocol;
      const fileUrl = `/uploads/${req.file.filename}`;
      const fullUrl = `${protocol}://${host}${fileUrl}`;

      return res.status(200).json({
        success: true,
        message: 'Audio subido exitosamente',
        url: fileUrl,
        fullUrl: fullUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    } catch (error) {
      console.error('Error subiendo audio:', error);
      return res.status(500).json({ error: 'Error al procesar el audio' });
    }
  });
});

/**
 * POST /api/upload/multiple
 * Subir múltiples imágenes a la vez
 */
router.post('/multiple', upload.array('images', 12), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se subieron imágenes' });
    }

    const filesData = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));

    return res.status(200).json({
      success: true,
      count: filesData.length,
      files: filesData
    });
  } catch (error) {
    console.error('Error subiendo imágenes:', error);
    return res.status(500).json({ error: 'Error al procesar las imágenes' });
  }
});

export default router;
