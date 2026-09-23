import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_ACCOUNT_PATH = path.join(__dirname, '..', 'config', 'serviceAccountKey.json');

let firestore = null;
let storageBucket = null;
let isInitialized = false;

export function initFirebaseAdmin() {
  if (isInitialized && firestore) {
    return { firestore, storageBucket, isInitialized: true };
  }

  try {
    let serviceAccount = null;

    if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
      const raw = fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8');
      serviceAccount = JSON.parse(raw);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }

    if (!serviceAccount || !serviceAccount.project_id) {
      console.warn('⚠️ [Firebase Admin] No se encontraron credenciales válidas de Service Account.');
      return { firestore: null, storageBucket: null, isInitialized: false };
    }

    let app;
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
        storageBucket: `${serviceAccount.project_id}.firebasestorage.app`
      });
    } else {
      app = apps[0];
    }

    firestore = getFirestore(app);
    try {
      storageBucket = getStorage(app).bucket();
    } catch (e) {
      console.warn('⚠️ [Firebase Storage] Bucket no inicializado:', e.message);
    }

    isInitialized = true;
    console.log(`🔥 [Firebase Admin] Conectado exitosamente a Google Cloud Firestore (Proyecto: ${serviceAccount.project_id})`);
    return { firestore, storageBucket, isInitialized: true };
  } catch (err) {
    console.error('❌ [Firebase Admin] Error al inicializar Firebase Admin:', err.message);
    isInitialized = false;
    return { firestore: null, storageBucket: null, isInitialized: false };
  }
}

const SITE_COLLECTION = 'terjamanco_site';
const SITE_DOC = 'main_content';

/**
 * Obtener todos los datos del sitio desde Firestore
 */
export async function getFirestoreSiteData() {
  const { firestore: db } = initFirebaseAdmin();
  if (!db) return null;

  try {
    const docRef = db.collection(SITE_COLLECTION).doc(SITE_DOC);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error('🔥 [Firestore] Error al leer datos del sitio:', err.message);
    return null;
  }
}

/**
 * Guardar o sincronizar todos los datos del sitio a Firestore
 */
export async function saveFirestoreSiteData(data, merge = true) {
  const { firestore: db } = initFirebaseAdmin();
  if (!db) {
    throw new Error('Firebase Admin no está inicializado');
  }

  try {
    const docRef = db.collection(SITE_COLLECTION).doc(SITE_DOC);
    const cleanData = JSON.parse(JSON.stringify(data));
    cleanData.lastUpdated = new Date().toISOString();

    await docRef.set(cleanData, { merge });
    console.log('✅ [Firestore] Datos del sitio actualizados exitosamente en la nube');
    return { success: true, timestamp: cleanData.lastUpdated };
  } catch (err) {
    console.error('🔥 [Firestore] Error al guardar datos del sitio:', err.message);
    throw err;
  }
}

/**
 * Actualizar una sección específica en Firestore (ej: 'info', 'zones', 'services')
 */
export async function updateFirestoreSection(sectionKey, sectionData) {
  const { firestore: db } = initFirebaseAdmin();
  if (!db) {
    console.warn('⚠️ [Firestore] No inicializado al intentar actualizar sección:', sectionKey);
    return null;
  }

  try {
    const docRef = db.collection(SITE_COLLECTION).doc(SITE_DOC);
    const cleanData = JSON.parse(JSON.stringify(sectionData));
    
    await docRef.set({
      [sectionKey]: cleanData,
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    console.log(`✅ [Firestore] Sección '${sectionKey}' actualizada en la nube`);
    return { success: true, section: sectionKey };
  } catch (err) {
    console.error(`🔥 [Firestore] Error al actualizar sección '${sectionKey}':`, err.message);
    throw err;
  }
}

/**
 * Escuchar cambios en tiempo real en Firestore
 */
export function listenToFirestoreSiteData(onUpdate, onError) {
  const { firestore: db } = initFirebaseAdmin();
  if (!db) return () => {};

  try {
    const docRef = db.collection(SITE_COLLECTION).doc(SITE_DOC);
    const unsubscribe = docRef.onSnapshot((docSnap) => {
      if (docSnap.exists) {
        onUpdate(docSnap.data());
      }
    }, (err) => {
      console.warn('🔥 [Firestore Listener] Error en snapshot listener:', err.message);
      if (onError) onError(err);
    });

    return unsubscribe;
  } catch (err) {
    console.error('🔥 [Firestore Listener] Error configurando listener:', err.message);
    return () => {};
  }
}

export { firestore, storageBucket, isInitialized };
