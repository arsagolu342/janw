import express from 'express';
import { readDb, writeDb, resetDb, INITIAL_DATA } from '../utils/db.js';
import { 
  initFirebaseAdmin, 
  getFirestoreSiteData, 
  saveFirestoreSiteData, 
  updateFirestoreSection 
} from '../utils/firebaseAdmin.js';

const router = express.Router();

// Lista de clientes SSE conectados para actualizaciones en tiempo real
const sseClients = new Set();

/**
 * Transmite la actualización de datos a todos los clientes públicos conectados
 */
export function broadcastDataUpdate(data) {
  const payload = JSON.stringify({ type: 'DATA_UPDATE', data, timestamp: new Date().toISOString() });
  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

/**
 * Helper para persistir en disco y en Cloud Firestore, y notificar a los clientes
 */
async function syncAndBroadcast(updatedDb, sectionKey = null, sectionData = null) {
  writeDb(updatedDb);
  const { adminSettings, ...publicData } = updatedDb;

  // Notificar a todos los usuarios públicos en tiempo real
  broadcastDataUpdate(publicData);

  // Sincronizar en segundo plano a Cloud Firestore
  try {
    if (sectionKey && sectionData !== null) {
      await updateFirestoreSection(sectionKey, sectionData);
    } else {
      await saveFirestoreSiteData(publicData, true);
    }
  } catch (err) {
    console.warn('⚠️ Error sincronizando a Firestore:', err.message);
  }
}

/**
 * GET /api/events
 * Endpoint Server-Sent Events (SSE) para sincronización en tiempo real con el público
 */
router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Enviar mensaje de bienvenida con el estado inicial
  const db = readDb();
  const { adminSettings, ...publicData } = db;
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', data: publicData, timestamp: new Date().toISOString() })}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

/**
 * GET /api/firebase/status
 * Devuelve el estado de la conexión a Firebase Firestore
 */
router.get('/firebase/status', async (req, res) => {
  try {
    const { firestore, isInitialized } = initFirebaseAdmin();
    if (!isInitialized || !firestore) {
      return res.json({
        connected: false,
        projectId: 'terjamancoweb',
        message: 'Firebase Admin no inicializado'
      });
    }

    // Probar lectura de Firestore
    const siteData = await getFirestoreSiteData();

    return res.json({
      connected: true,
      projectId: 'terjamancoweb',
      clientEmail: 'firebase-adminsdk-fbsvc@terjamancoweb.iam.gserviceaccount.com',
      firestoreCollection: 'terjamanco_site',
      firestoreDoc: 'main_content',
      hasCloudData: !!siteData,
      connectedClientsCount: sseClients.size,
      message: 'Conexión activa y sincronizada con Google Cloud Firestore'
    });
  } catch (err) {
    return res.json({
      connected: false,
      projectId: 'terjamancoweb',
      error: err.message
    });
  }
});

/**
 * POST /api/firebase/sync
 * Fuerza la sincronización de todos los datos locales hacia Firestore
 */
router.post('/firebase/sync', async (req, res) => {
  try {
    const db = readDb();
    const { adminSettings, ...publicData } = db;
    const result = await saveFirestoreSiteData(publicData, false);
    broadcastDataUpdate(publicData);
    return res.json({
      success: true,
      message: 'Datos sincronizados exitosamente con Google Cloud Firestore',
      result
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error sincronizando con Firebase' });
  }
});

/**
 * GET /api/data
 * Retorna todos los datos para inicializar el sitio o el panel
 */
router.get('/data', async (req, res) => {
  try {
    const db = readDb();
    const { adminSettings, ...publicData } = db;
    return res.json({
      success: true,
      data: publicData,
      firebaseProject: 'terjamancoweb'
    });
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    return res.status(500).json({ error: 'Error al obtener datos' });
  }
});

/**
 * PUT /api/data/info
 * Actualizar información general de Jamanco
 */
router.put('/data/info', async (req, res) => {
  try {
    const db = readDb();
    db.info = { ...db.info, ...req.body };
    await syncAndBroadcast(db, 'info', db.info);
    return res.json({ success: true, message: 'Información general actualizada', info: db.info });
  } catch (error) {
    console.error('Error actualizando info:', error);
    return res.status(500).json({ error: 'Error al actualizar información' });
  }
});

/**
 * PUT /api/data/hero
 * Actualizar textos e imágenes del Hero
 */
router.put('/data/hero', async (req, res) => {
  try {
    const db = readDb();
    db.hero = { ...db.hero, ...req.body };
    await syncAndBroadcast(db, 'hero', db.hero);
    return res.json({ success: true, message: 'Sección Hero actualizada', hero: db.hero });
  } catch (error) {
    console.error('Error actualizando hero:', error);
    return res.status(500).json({ error: 'Error al actualizar Hero' });
  }
});

/**
 * PUT /api/data/minerals
 * Actualizar datos de minerales
 */
router.put('/data/minerals', async (req, res) => {
  try {
    const db = readDb();
    if (Array.isArray(req.body)) {
      db.minerals = req.body;
      await syncAndBroadcast(db, 'minerals', db.minerals);
      return res.json({ success: true, message: 'Minerales actualizados', minerals: db.minerals });
    }
    return res.status(400).json({ error: 'Se esperaba un array de minerales' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar minerales' });
  }
});

// ==========================================
// CRUD: SEDES / CIRCUITOS (ZONES)
// ==========================================
router.get('/zones', (req, res) => {
  const db = readDb();
  res.json({ success: true, zones: db.zones });
});

router.post('/zones', async (req, res) => {
  try {
    const db = readDb();
    const newZone = {
      id: req.body.id || `zone-${Date.now()}`,
      name: req.body.name || 'Nueva Sede',
      temp: req.body.temp || '38°C - 42°C',
      schedule: req.body.schedule || '06:00 AM - 19:30 PM',
      badge: req.body.badge || 'Termal',
      description: req.body.description || '',
      image: req.body.image || '',
      features: Array.isArray(req.body.features) ? req.body.features : []
    };
    db.zones.push(newZone);
    await syncAndBroadcast(db, 'zones', db.zones);
    res.json({ success: true, zone: newZone });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear sede' });
  }
});

router.put('/zones/:id', async (req, res) => {
  try {
    const db = readDb();
    const index = db.zones.findIndex(z => z.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Sede no encontrada' });

    db.zones[index] = { ...db.zones[index], ...req.body };
    await syncAndBroadcast(db, 'zones', db.zones);
    res.json({ success: true, zone: db.zones[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar sede' });
  }
});

router.delete('/zones/:id', async (req, res) => {
  try {
    const db = readDb();
    db.zones = db.zones.filter(z => z.id !== req.params.id);
    await syncAndBroadcast(db, 'zones', db.zones);
    res.json({ success: true, message: 'Sede eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar sede' });
  }
});

// ==========================================
// CRUD: SERVICIOS Y EXPERIENCIAS
// ==========================================
router.get('/services', (req, res) => {
  const db = readDb();
  res.json({ success: true, services: db.services });
});

router.post('/services', async (req, res) => {
  try {
    const db = readDb();
    const newService = {
      id: req.body.id || `srv-${Date.now()}`,
      category: req.body.category || 'Piscinas Termales',
      title: req.body.title || 'Nuevo Servicio',
      shortDesc: req.body.shortDesc || '',
      price: Number(req.body.price) || 0,
      unit: req.body.unit || 'por persona',
      duration: req.body.duration || 'Pase de Día',
      badge: req.body.badge || '',
      image: req.body.image || '',
      included: Array.isArray(req.body.included) ? req.body.included : []
    };
    db.services.push(newService);
    await syncAndBroadcast(db, 'services', db.services);
    res.json({ success: true, service: newService });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear servicio' });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const db = readDb();
    const index = db.services.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Servicio no encontrado' });

    db.services[index] = { 
      ...db.services[index], 
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : db.services[index].price 
    };
    await syncAndBroadcast(db, 'services', db.services);
    res.json({ success: true, service: db.services[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const db = readDb();
    db.services = db.services.filter(s => s.id !== req.params.id);
    await syncAndBroadcast(db, 'services', db.services);
    res.json({ success: true, message: 'Servicio eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
});

// ==========================================
// CRUD: PRODUCTOS / TIENDA
// ==========================================
router.get('/products', (req, res) => {
  const db = readDb();
  res.json({ success: true, products: db.products });
});

router.post('/products', async (req, res) => {
  try {
    const db = readDb();
    const newProduct = {
      id: req.body.id || `prod-${Date.now()}`,
      name: req.body.name || 'Nuevo Producto Termal',
      category: req.body.category || 'Tratamiento Facial & Corporal',
      tagline: req.body.tagline || '',
      price: Number(req.body.price) || 0,
      oldPrice: Number(req.body.oldPrice) || null,
      rating: Number(req.body.rating) || 5.0,
      reviews: Number(req.body.reviews) || 0,
      badge: req.body.badge || '',
      image: req.body.image || '',
      benefits: Array.isArray(req.body.benefits) ? req.body.benefits : []
    };
    db.products.push(newProduct);
    await syncAndBroadcast(db, 'products', db.products);
    res.json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const db = readDb();
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    db.products[index] = { 
      ...db.products[index], 
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : db.products[index].price,
      oldPrice: req.body.oldPrice !== undefined ? (req.body.oldPrice ? Number(req.body.oldPrice) : null) : db.products[index].oldPrice
    };
    await syncAndBroadcast(db, 'products', db.products);
    res.json({ success: true, product: db.products[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const db = readDb();
    db.products = db.products.filter(p => p.id !== req.params.id);
    await syncAndBroadcast(db, 'products', db.products);
    res.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// ==========================================
// CRUD: PAQUETES Y TARIFAS
// ==========================================
router.get('/packages', (req, res) => {
  const db = readDb();
  res.json({ success: true, packages: db.packages });
});

router.post('/packages', async (req, res) => {
  try {
    const db = readDb();
    const newPkg = {
      id: req.body.id || `pack-${Date.now()}`,
      name: req.body.name || 'Nuevo Paquete',
      category: req.body.category || 'Entradas',
      priceAdult: Number(req.body.priceAdult) || 0,
      priceChild: Number(req.body.priceChild) || 0,
      popular: !!req.body.popular,
      fixedForTwo: !!req.body.fixedForTwo,
      description: req.body.description || '',
      features: Array.isArray(req.body.features) ? req.body.features : []
    };
    db.packages.push(newPkg);
    await syncAndBroadcast(db, 'packages', db.packages);
    res.json({ success: true, package: newPkg });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear paquete' });
  }
});

router.put('/packages/:id', async (req, res) => {
  try {
    const db = readDb();
    const index = db.packages.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Paquete no encontrado' });

    db.packages[index] = { 
      ...db.packages[index], 
      ...req.body,
      priceAdult: req.body.priceAdult !== undefined ? Number(req.body.priceAdult) : db.packages[index].priceAdult,
      priceChild: req.body.priceChild !== undefined ? Number(req.body.priceChild) : db.packages[index].priceChild
    };
    await syncAndBroadcast(db, 'packages', db.packages);
    res.json({ success: true, package: db.packages[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar paquete' });
  }
});

router.delete('/packages/:id', async (req, res) => {
  try {
    const db = readDb();
    db.packages = db.packages.filter(p => p.id !== req.params.id);
    await syncAndBroadcast(db, 'packages', db.packages);
    res.json({ success: true, message: 'Paquete eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar paquete' });
  }
});

// ==========================================
// CRUD: GALERÍA DE FOTOS
// ==========================================
router.get('/gallery', (req, res) => {
  const db = readDb();
  res.json({ success: true, gallery: db.gallery });
});

router.post('/gallery', async (req, res) => {
  try {
    const db = readDb();
    const newPhoto = {
      id: req.body.id || `gal-${Date.now()}`,
      url: req.body.url,
      title: req.body.title || 'Foto de Jamanco',
      category: req.body.category || 'General'
    };
    db.gallery.unshift(newPhoto);
    await syncAndBroadcast(db, 'gallery', db.gallery);
    res.json({ success: true, photo: newPhoto });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar foto a la galería' });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    const db = readDb();
    db.gallery = db.gallery.filter(g => g.id !== req.params.id);
    await syncAndBroadcast(db, 'gallery', db.gallery);
    res.json({ success: true, message: 'Foto eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar foto' });
  }
});

// ==========================================
// CRUD: RESEÑAS Y TESTIMONIOS
// ==========================================
router.get('/reviews', (req, res) => {
  const db = readDb();
  res.json({ success: true, reviews: db.reviews });
});

router.post('/reviews', async (req, res) => {
  try {
    const db = readDb();
    const newRev = {
      id: req.body.id || `rev-${Date.now()}`,
      name: req.body.name || 'Visitante',
      role: req.body.role || 'Turista',
      rating: Number(req.body.rating) || 5,
      comment: req.body.comment || '',
      date: req.body.date || 'Reciente',
      avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };
    db.reviews.unshift(newRev);
    await syncAndBroadcast(db, 'reviews', db.reviews);
    res.json({ success: true, review: newRev });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar reseña' });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const db = readDb();
    const index = db.reviews.findIndex(r => String(r.id) === String(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Reseña no encontrada' });

    db.reviews[index] = { ...db.reviews[index], ...req.body };
    await syncAndBroadcast(db, 'reviews', db.reviews);
    res.json({ success: true, review: db.reviews[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar reseña' });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    const db = readDb();
    db.reviews = db.reviews.filter(r => String(r.id) !== String(req.params.id));
    await syncAndBroadcast(db, 'reviews', db.reviews);
    res.json({ success: true, message: 'Reseña eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar reseña' });
  }
});

// ==========================================
// CRUD: PREGUNTAS FRECUENTES (FAQS)
// ==========================================
router.get('/faqs', (req, res) => {
  const db = readDb();
  res.json({ success: true, faqs: db.faqs });
});

router.post('/faqs', async (req, res) => {
  try {
    const db = readDb();
    const newFaq = {
      id: req.body.id || `faq-${Date.now()}`,
      question: req.body.question || 'Pregunta',
      answer: req.body.answer || 'Respuesta'
    };
    db.faqs.push(newFaq);
    await syncAndBroadcast(db, 'faqs', db.faqs);
    res.json({ success: true, faq: newFaq });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear FAQ' });
  }
});

router.put('/faqs/:id', async (req, res) => {
  try {
    const db = readDb();
    const index = db.faqs.findIndex(f => f.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'FAQ no encontrada' });

    db.faqs[index] = { ...db.faqs[index], ...req.body };
    await syncAndBroadcast(db, 'faqs', db.faqs);
    res.json({ success: true, faq: db.faqs[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar FAQ' });
  }
});

router.delete('/faqs/:id', async (req, res) => {
  try {
    const db = readDb();
    db.faqs = db.faqs.filter(f => f.id !== req.params.id);
    await syncAndBroadcast(db, 'faqs', db.faqs);
    res.json({ success: true, message: 'FAQ eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar FAQ' });
  }
});

// ==========================================
// CRUD: CONFIGURACIÓN Y PISTAS DE SONIDO RELAJANTE
// ==========================================
router.get('/sound', (req, res) => {
  try {
    const db = readDb();
    res.json({ success: true, soundSettings: db.soundSettings });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener configuración de sonido' });
  }
});

router.put('/sound', async (req, res) => {
  try {
    const db = readDb();
    db.soundSettings = {
      ...db.soundSettings,
      ...req.body
    };
    await syncAndBroadcast(db, 'soundSettings', db.soundSettings);
    res.json({ success: true, message: 'Configuración de sonido actualizada', soundSettings: db.soundSettings });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar configuración de sonido' });
  }
});

router.post('/sound/tracks', async (req, res) => {
  try {
    const db = readDb();
    const newTrack = {
      id: req.body.id || `sound-${Date.now()}`,
      title: req.body.title || 'Pista Relajante',
      category: req.body.category || 'Agua Termal',
      url: req.body.url,
      description: req.body.description || '',
      isPreset: false
    };

    if (!newTrack.url) {
      return res.status(400).json({ error: 'La URL o archivo del audio es obligatorio' });
    }

    if (!db.soundSettings) {
      db.soundSettings = { enabled: true, autoplayOnInteract: true, defaultVolume: 0.4, activeTrackId: newTrack.id, tracks: [] };
    }
    if (!Array.isArray(db.soundSettings.tracks)) {
      db.soundSettings.tracks = [];
    }

    db.soundSettings.tracks.push(newTrack);
    await syncAndBroadcast(db, 'soundSettings', db.soundSettings);
    res.json({ success: true, message: 'Pista de sonido agregada', track: newTrack, soundSettings: db.soundSettings });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar pista de sonido' });
  }
});

router.delete('/sound/tracks/:id', async (req, res) => {
  try {
    const db = readDb();
    if (!db.soundSettings || !Array.isArray(db.soundSettings.tracks)) {
      return res.status(404).json({ error: 'Pistas no encontradas' });
    }

    db.soundSettings.tracks = db.soundSettings.tracks.filter(t => t.id !== req.params.id);
    
    // Si se eliminó la pista activa, asignar la primera disponible
    if (db.soundSettings.activeTrackId === req.params.id && db.soundSettings.tracks.length > 0) {
      db.soundSettings.activeTrackId = db.soundSettings.tracks[0].id;
    }

    await syncAndBroadcast(db, 'soundSettings', db.soundSettings);
    res.json({ success: true, message: 'Pista eliminada', soundSettings: db.soundSettings });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar pista de sonido' });
  }
});

// ==========================================
// ADMINISTRACIÓN: RESTAURAR Y RESPALDOS
// ==========================================
router.post('/data/reset', async (req, res) => {
  try {
    const resetData = resetDb();
    const { adminSettings, ...publicData } = resetData;
    await syncAndBroadcast(resetData);
    res.json({ success: true, message: 'Base de datos restaurada a valores de fábrica', data: resetData });
  } catch (error) {
    res.status(500).json({ error: 'Error al restaurar base de datos' });
  }
});

router.get('/data/backup', (req, res) => {
  try {
    const db = readDb();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=jamanco-backup-${Date.now()}.json`);
    res.send(JSON.stringify(db, null, 2));
  } catch (error) {
    res.status(500).json({ error: 'Error generando respaldo' });
  }
});

router.post('/data/restore', async (req, res) => {
  try {
    const importedData = req.body;
    if (!importedData || typeof importedData !== 'object' || !importedData.info) {
      return res.status(400).json({ error: 'Formato de respaldo inválido' });
    }
    await syncAndBroadcast(importedData);
    res.json({ success: true, message: 'Copia de seguridad restaurada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error restaurando respaldo' });
  }
});

export default router;
