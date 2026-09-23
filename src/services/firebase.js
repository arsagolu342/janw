import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Clave en localStorage para configuración dinámica desde el Admin
const FIREBASE_CONFIG_STORAGE_KEY = 'terjamanco_firebase_config';

/**
 * Obtiene la configuración de Firebase activa:
 * 1. Desde localStorage (si el usuario la guardó en el Admin)
 * 2. O desde variables de entorno Vite (VITE_FIREBASE_*)
 */
export function getStoredFirebaseConfig() {
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return {
          apiKey: String(parsed.apiKey).trim(),
          authDomain: String(parsed.authDomain || '').trim(),
          projectId: String(parsed.projectId || '').trim(),
          storageBucket: String(parsed.storageBucket || '').trim(),
          messagingSenderId: String(parsed.messagingSenderId || '').trim(),
          appId: String(parsed.appId || '').trim(),
          measurementId: String(parsed.measurementId || '').trim()
        };
      }
    }
  } catch (e) {
    console.warn('Error leyendo Firebase config de localStorage:', e);
  }

  // Fallback a variables de entorno VITE_
  const envConfig = {
    apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY || '').trim(),
    authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
    projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim(),
    storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '').trim(),
    messagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
    appId: String(import.meta.env.VITE_FIREBASE_APP_ID || '').trim(),
    measurementId: String(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '').trim()
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  return null;
}

/**
 * Guarda o limpia la configuración de Firebase en localStorage
 */
export function saveFirebaseConfig(config) {
  try {
    if (config) {
      localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
    } else {
      localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error guardando configuración de Firebase:', e);
  }
}

/**
 * Instancia y servicios de Firebase
 */
let firebaseApp = null;
let firestoreDb = null;
let firebaseStorage = null;

export function isFirebaseConfigured() {
  const cfg = getStoredFirebaseConfig();
  return Boolean(cfg && cfg.apiKey && cfg.projectId);
}

/**
 * Inicializa Firebase con la configuración actual
 */
export function initFirebase(customConfig = null) {
  const config = customConfig || getStoredFirebaseConfig();

  if (!config || !config.apiKey || !config.projectId) {
    firebaseApp = null;
    firestoreDb = null;
    firebaseStorage = null;
    return false;
  }

  try {
    if (getApps().length > 0) {
      // Re-inicializar si la config cambió
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(config);
    }
    firestoreDb = getFirestore(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    return true;
  } catch (err) {
    console.error('🔥 Error inicializando Firebase:', err);
    return false;
  }
}

// Inicializar al cargar el módulo
initFirebase();

export { firestoreDb, firebaseStorage };

/**
 * Documento principal de contenido en Cloud Firestore:
 * Colección: 'terjamanco_site' / Documento: 'main_content'
 */
const SITE_DOC_PATH = ['terjamanco_site', 'main_content'];

/**
 * Obtener todos los datos del sitio desde Cloud Firestore
 */
export async function getFirebaseSiteData() {
  if (!firestoreDb) {
    if (!initFirebase()) return null;
  }

  try {
    const docRef = doc(firestoreDb, ...SITE_DOC_PATH);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (err) {
    console.error('🔥 Error al obtener datos desde Firestore:', err);
    throw err;
  }
}

/**
 * Sanitizar objetos de forma segura para Cloud Firestore
 * Elimina undefined, funciones, símbolos y aplana estructuras anidadas erróneas
 */
export function cleanForFirestore(data) {
  if (data === null || data === undefined) return null;
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter(item => item !== undefined)
      .map(item => cleanForFirestore(item));
  }
  if (typeof data === 'object') {
    const clean = {};
    for (const [key, value] of Object.entries(data)) {
      if (!key || typeof key !== 'string') continue;
      if (typeof value === 'function' || typeof value === 'symbol' || value === undefined) {
        continue;
      }
      // Evitar anidamiento recursivo de 'info' dentro de 'info'
      if (key === 'info' && value && typeof value === 'object' && value.name && data.name) {
        continue;
      }
      clean[key.trim()] = cleanForFirestore(value);
    }
    return clean;
  }
  return String(data);
}

/**
 * Guardar o actualizar datos completos o parciales en Firestore
 */
export async function saveFirebaseSiteData(data, merge = true) {
  if (!firestoreDb) {
    if (!initFirebase()) throw new Error('Firebase no está configurado');
  }

  try {
    const docRef = doc(firestoreDb, ...SITE_DOC_PATH);
    const cleanData = cleanForFirestore(data) || {};
    
    // Si info tiene anidamiento duplicado { info: { info: ... } }, aplanarlo
    if (cleanData.info && typeof cleanData.info === 'object') {
      if (cleanData.info.info && typeof cleanData.info.info === 'object') {
        cleanData.info = { ...cleanData.info.info, ...cleanData.info };
        delete cleanData.info.info;
      }
    }

    cleanData.lastUpdated = new Date().toISOString();
    
    await setDoc(docRef, cleanData, { merge });
    return { success: true, timestamp: cleanData.lastUpdated };
  } catch (err) {
    console.error('🔥 Error al guardar datos en Firestore:', err);
    throw err;
  }
}

/**
 * Actualizar una sección específica en Firestore (ej: 'info', 'services', 'gallery')
 */
export async function updateFirebaseSection(sectionKey, sectionData) {
  if (!firestoreDb) {
    if (!initFirebase()) throw new Error('Firebase no está configurado');
  }

  try {
    const docRef = doc(firestoreDb, ...SITE_DOC_PATH);
    let cleanData = cleanForFirestore(sectionData);

    if (sectionKey === 'info' && cleanData && typeof cleanData === 'object') {
      if (cleanData.info && typeof cleanData.info === 'object') {
        cleanData = { ...cleanData.info, ...cleanData };
      }
      delete cleanData.info;
    }

    await setDoc(docRef, {
      [sectionKey]: cleanData,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error(`🔥 Error al actualizar sección ${sectionKey} en Firestore:`, err);
    throw err;
  }
}

/**
 * Suscribirse a cambios en tiempo real desde Firestore
 */
export function subscribeToFirebaseSiteData(onUpdate, onError) {
  if (!firestoreDb) {
    if (!initFirebase()) return () => {};
  }

  try {
    const docRef = doc(firestoreDb, ...SITE_DOC_PATH);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data());
      }
    }, (err) => {
      console.warn('🔥 Error en suscripción a Firestore:', err);
      if (onError) onError(err);
    });

    return unsubscribe;
  } catch (err) {
    console.error('🔥 Error configurando listener de Firestore:', err);
    return () => {};
  }
}

/**
 * Subir un archivo (imagen o audio) a Firebase Cloud Storage
 * @param {File|Blob} file - Archivo a subir
 * @param {string} folder - Carpeta ('images', 'logos', 'sounds')
 * @param {function} onProgress - Callback con porcentaje de 0 a 100
 * @returns {Promise<string>} URL pública de descarga
 */
export async function uploadFileToFirebaseStorage(file, folder = 'images', onProgress = null) {
  if (!firebaseStorage) {
    if (!initFirebase()) throw new Error('Firebase Storage no está configurado');
  }

  try {
    // Sanitizar nombre de archivo
    const safeName = file.name
      ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()
      : 'file_' + Date.now();
    
    const uniqueFileName = `${Date.now()}_${safeName}`;
    const storageRef = ref(firebaseStorage, `uploads/${folder}/${uniqueFileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'application/octet-stream'
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (onProgress && snapshot.totalBytes > 0) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error('🔥 Error al subir archivo a Firebase Storage:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(downloadUrl);
          } catch (urlErr) {
            reject(urlErr);
          }
        }
      );
    });
  } catch (err) {
    console.error('🔥 Error iniciando subida a Firebase Storage:', err);
    throw err;
  }
}

/**
 * Probar conexión con las credenciales dadas
 */
export async function testFirebaseConnection(customConfig) {
  try {
    const tempAppName = 'temp_test_' + Date.now();
    const tempApp = initializeApp(customConfig, tempAppName);
    const tempDb = getFirestore(tempApp);
    const testDoc = doc(tempDb, 'terjamanco_site', 'connection_test');
    await getDoc(testDoc);
    return { success: true, message: '¡Conexión exitosa a Cloud Firestore!' };
  } catch (err) {
    return { success: false, message: err.message || 'Error de conexión con Firebase' };
  }
}
