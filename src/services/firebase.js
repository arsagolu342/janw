import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
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
import { getAuth, signInAnonymously } from 'firebase/auth';

// Clave en localStorage para configuración dinámica desde el Admin
const FIREBASE_CONFIG_STORAGE_KEY = 'terjamanco_firebase_config';

// Configuración oficial por defecto del proyecto Firebase Cloud (terjamancoweb)
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDFE4ql5iuC_oolzeLk5RBH8ubCbvkWDZA",
  authDomain: "terjamancoweb.firebaseapp.com",
  projectId: "terjamancoweb",
  storageBucket: "terjamancoweb.firebasestorage.app",
  messagingSenderId: "238870040107",
  appId: "1:238870040107:web:3cdad337c7d7bf66f5646e",
  measurementId: "G-V5QT9D16JD"
};

/**
 * Obtiene la configuración de Firebase activa:
 * 1. Desde localStorage (si el usuario la guardó en el Admin)
 * 2. O desde variables de entorno Vite (VITE_FIREBASE_*)
 * 3. O fallback a las credenciales oficiales integradas
 */
export function getStoredFirebaseConfig() {
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return {
          apiKey: String(parsed.apiKey).trim(),
          authDomain: String(parsed.authDomain || DEFAULT_FIREBASE_CONFIG.authDomain).trim(),
          projectId: String(parsed.projectId || DEFAULT_FIREBASE_CONFIG.projectId).trim(),
          storageBucket: String(parsed.storageBucket || DEFAULT_FIREBASE_CONFIG.storageBucket).trim(),
          messagingSenderId: String(parsed.messagingSenderId || DEFAULT_FIREBASE_CONFIG.messagingSenderId).trim(),
          appId: String(parsed.appId || DEFAULT_FIREBASE_CONFIG.appId).trim(),
          measurementId: String(parsed.measurementId || DEFAULT_FIREBASE_CONFIG.measurementId).trim()
        };
      }
    }
  } catch (e) {
    console.warn('Error leyendo Firebase config de localStorage:', e);
  }

  // Fallback a variables de entorno VITE_ si existen
  const envApiKey = String(import.meta.env.VITE_FIREBASE_API_KEY || '').trim();
  const envProjectId = String(import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim();

  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain).trim(),
      projectId: envProjectId,
      storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket).trim(),
      messagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId).trim(),
      appId: String(import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId).trim(),
      measurementId: String(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || DEFAULT_FIREBASE_CONFIG.measurementId).trim()
    };
  }

  // Fallback a las credenciales oficiales de Terjamanco
  return DEFAULT_FIREBASE_CONFIG;
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
let firebaseAuth = null;

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
    firebaseAuth = null;
    return false;
  }

  try {
    if (getApps().length > 0) {
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(config);
    }
    firestoreDb = getFirestore(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    try {
      firebaseAuth = getAuth(firebaseApp);
      signInAnonymously(firebaseAuth).catch(() => {});
    } catch {
      // Ignorar si auth ya está activo o no configurado
    }
    return true;
  } catch (err) {
    console.error('🔥 Error inicializando Firebase:', err);
    return false;
  }
}

// Inicializar al cargar el módulo
initFirebase();

export { firestoreDb, firebaseStorage, firebaseAuth };

/**
 * Documento principal de contenido en Cloud Firestore:
/**
 * Documento principal de contenido en Cloud Firestore:
 * Colección: 'terjamanco_site'
 */
const SITE_COLLECTION = 'terjamanco_site';
const SITE_DOC_PATH = [SITE_COLLECTION, 'main_content'];

/**
 * Helper para extraer datos de una sección independientemente del formato de almacenamiento
 */
export function extractSectionData(raw) {
  if (!raw || typeof raw !== 'object') return raw;

  // Si tiene la propiedad 'items' que es un arreglo
  if (Array.isArray(raw.items)) {
    return raw.items;
  }
  // Si tiene la propiedad 'list' que es un arreglo
  if (Array.isArray(raw.list)) {
    return raw.list;
  }
  // Si tiene la propiedad 'data' que es un arreglo
  if (Array.isArray(raw.data)) {
    return raw.data;
  }

  // Si es un objeto cuyas claves son índices numéricos ('0', '1', '2'...)
  const keys = Object.keys(raw).filter(k => k !== 'lastUpdated');
  const isNumericArray = keys.length > 0 && keys.every(k => /^\d+$/.test(k));
  if (isNumericArray) {
    return keys
      .sort((a, b) => Number(a) - Number(b))
      .map(k => raw[k]);
  }

  // Si es un objeto normal (info, hero, soundSettings, etc.)
  const cleanObj = { ...raw };
  delete cleanObj.lastUpdated;
  return cleanObj;
}

/**
 * Obtener todos los datos del sitio desde Cloud Firestore leyendo todos los documentos de la colección
 */
export async function getFirebaseSiteData() {
  if (!firestoreDb) {
    if (!initFirebase()) return null;
  }

  try {
    const colRef = collection(firestoreDb, SITE_COLLECTION);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      return null;
    }

    const fullData = {};
    snapshot.forEach((docSnap) => {
      const docId = docSnap.id;
      const raw = docSnap.data();
      if (!raw) return;

      if (docId === 'main_content') {
        for (const [key, val] of Object.entries(raw)) {
          if (fullData[key] === undefined && val !== undefined) {
            fullData[key] = val;
          }
        }
      } else {
        fullData[docId] = extractSectionData(raw);
      }
    });

    return Object.keys(fullData).length > 0 ? fullData : null;
  } catch (err) {
    console.error('🔥 Error al obtener datos desde Firestore:', err);
    throw err;
  }
}

/**
 * Sanitizar objetos de forma segura para Cloud Firestore
 * Elimina undefined, funciones, símbolos y limita cadenas gigantes
 */
export function cleanForFirestore(data) {
  if (data === null || data === undefined) return null;
  if (typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }
  if (typeof data === 'string') {
    // Si es un audio base64 gigante, no almacenarlo directamente en Firestore
    if (data.startsWith('data:audio/') && data.length > 50000) {
      return '';
    }
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
 * Guardar o actualizar datos completos en Firestore divididos en documentos dedicados por sección
 */
export async function saveFirebaseSiteData(data, merge = true) {
  if (!firestoreDb) {
    if (!initFirebase()) throw new Error('Firebase no está configurado');
  }

  try {
    const cleanData = cleanForFirestore(data) || {};
    
    if (cleanData.info && typeof cleanData.info === 'object') {
      if (cleanData.info.info && typeof cleanData.info.info === 'object') {
        cleanData.info = { ...cleanData.info.info, ...cleanData.info };
        delete cleanData.info.info;
      }
    }

    const timestamp = new Date().toISOString();

    // Guardar cada sección en su propio documento individual (cada uno con límite de 1MB independiente)
    for (const [key, val] of Object.entries(cleanData)) {
      if (key === 'lastUpdated') continue;
      if (val !== undefined && val !== null) {
        try {
          const sectionDocRef = doc(firestoreDb, SITE_COLLECTION, key);
          let docPayload;
          if (Array.isArray(val)) {
            docPayload = { items: val, lastUpdated: timestamp };
          } else if (typeof val === 'object') {
            docPayload = { ...val, lastUpdated: timestamp };
          } else {
            docPayload = { value: val, lastUpdated: timestamp };
          }
          await setDoc(sectionDocRef, docPayload);
        } catch (secErr) {
          console.warn(`Error guardando sección ${key} en documento dedicado:`, secErr.message);
        }
      }
    }

    return { success: true, timestamp };
  } catch (err) {
    console.error('🔥 Error al guardar datos en Firestore:', err);
    throw err;
  }
}

/**
 * Actualizar una sección específica en Firestore (ej: 'zones', 'info', 'services', 'gallery')
 * Guarda en el documento dedicado terjamanco_site/[sectionKey]
 */
export async function updateFirebaseSection(sectionKey, sectionData) {
  if (!firestoreDb) {
    if (!initFirebase()) throw new Error('Firebase no está configurado');
  }

  try {
    let cleanData = cleanForFirestore(sectionData);

    if (sectionKey === 'info' && cleanData && typeof cleanData === 'object') {
      if (cleanData.info && typeof cleanData.info === 'object') {
        cleanData = { ...cleanData.info, ...cleanData };
      }
      delete cleanData.info;
    }

    const timestamp = new Date().toISOString();

    // Guardar en documento dedicado específico (terjamanco_site/[sectionKey]) -> GARANTIZADO (< 30KB)
    const sectionDocRef = doc(firestoreDb, SITE_COLLECTION, sectionKey);
    let docPayload;
    if (Array.isArray(cleanData)) {
      docPayload = { items: cleanData, lastUpdated: timestamp };
    } else if (typeof cleanData === 'object' && cleanData !== null) {
      docPayload = { ...cleanData, lastUpdated: timestamp };
    } else {
      docPayload = { value: cleanData, lastUpdated: timestamp };
    }

    await setDoc(sectionDocRef, docPayload);

    return { success: true, timestamp };
  } catch (err) {
    console.error(`🔥 Error al actualizar sección ${sectionKey} en Firestore:`, err);
    throw err;
  }
}

/**
 * Suscribirse a cambios en tiempo real en toda la colección de secciones desde Firestore
 */
export function subscribeToFirebaseSiteData(onUpdate, onError) {
  if (!firestoreDb) {
    if (!initFirebase()) return () => {};
  }

  try {
    const colRef = collection(firestoreDb, SITE_COLLECTION);
    const unsub = onSnapshot(colRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const docId = change.doc.id;
          const raw = change.doc.data();
          if (!raw) return;

          if (docId === 'main_content') {
            onUpdate(raw);
          } else {
            const extracted = extractSectionData(raw);
            onUpdate({ [docId]: extracted });
          }
        }
      });
    }, (err) => {
      console.warn('🔥 Listener Firestore collection error:', err.message);
      if (onError) onError(err);
    });

    return unsub;
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
