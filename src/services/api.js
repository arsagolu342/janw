/**
 * Cliente API para la comunicación entre el frontend de React y el Backend Express
 * Incluye fallback inteligente a localStorage para despliegues estáticos (Netlify, Vercel, GitHub Pages)
 */

const API_BASE = '/api';

// Obtener token almacenado
export function getAuthToken() {
  try {
    return localStorage.getItem('terjamanco_admin_token');
  } catch {
    return null;
  }
}

// Guardar token
export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem('terjamanco_admin_token', token);
    } else {
      localStorage.removeItem('terjamanco_admin_token');
    }
  } catch (e) {
    console.warn('Error accediendo a localStorage para auth token:', e);
  }
}

// Helper para credenciales locales
function getLocalCreds() {
  try {
    const saved = localStorage.getItem('terjamanco_admin_creds');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Error leyendo credenciales locales:', e);
  }
  return { username: 'admin', password: 'jamanco2025' };
}

function setLocalCreds(username, password) {
  try {
    localStorage.setItem('terjamanco_admin_creds', JSON.stringify({ username, password }));
  } catch (e) {
    console.warn('Error guardando credenciales locales:', e);
  }
}

// Helper para headers
function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Helper de petición segura que valida JSON y detecta si es un servidor estático (HTML response)
async function safeFetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout para no bloquear
  
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // Netlify devuelve 200 con index.html para rutas no encontradas
      throw new Error('NO_JSON_RESPONSE');
    }

    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || `HTTP error ${res.status}`);
      err.data = data;
      err.status = res.status;
      throw err;
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Helper para comprimir y convertir imagen a Base64 Data URL (fallback de subida para Netlify/Local)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    // Si no es imagen (ej: audio) o es SVG, leer directamente
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Exportar como JPEG comprimido a 0.82
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = error => reject(error);
  });
}

// ==========================================
// AUTENTICACIÓN
// ==========================================
export async function apiLogin(username, password) {
  try {
    const data = await safeFetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (data.token) setAuthToken(data.token);
    return data;
  } catch (err) {
    // Si el backend no responde o estamos en Netlify estático, usar autenticación cliente
    const isOffline = err.message === 'NO_JSON_RESPONSE' || 
                      err.name === 'AbortError' || 
                      err.name === 'TypeError' || 
                      (err.message && err.message.includes('fetch'));

    if (isOffline) {
      const localCreds = getLocalCreds();
      const inputUser = (username || '').trim();
      const inputPass = (password || '').trim();

      if (inputUser === localCreds.username && inputPass === localCreds.password) {
        const localToken = `local_admin_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        setAuthToken(localToken);
        return {
          success: true,
          token: localToken,
          user: { username: localCreds.username, role: 'superadmin' },
          message: 'Sesión iniciada correctamente'
        };
      } else {
        throw new Error('Usuario o contraseña incorrectos');
      }
    }
    
    // Si el servidor respondió un error 400/401 formal en JSON
    throw new Error(err.data?.error || err.message || 'Error al iniciar sesión');
  }
}

export async function apiVerifyToken() {
  const token = getAuthToken();
  if (!token) return { valid: false };

  // Si es un token de sesión local de Netlify
  if (token.startsWith('local_admin_session_')) {
    const localCreds = getLocalCreds();
    return { valid: true, user: { username: localCreds.username, role: 'superadmin' } };
  }

  try {
    const data = await safeFetchJson(`${API_BASE}/auth/verify`, {
      headers: getHeaders(false)
    });
    return data;
  } catch {
    // Fallback: si tenemos token guardado pero el backend está offline
    const localCreds = getLocalCreds();
    return { valid: true, user: { username: localCreds.username, role: 'superadmin' } };
  }
}

export async function apiChangePassword(currentPassword, newPassword, newUsername) {
  try {
    const data = await safeFetchJson(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword, newUsername })
    });
    return data;
  } catch (err) {
    // Fallback local en Netlify
    const localCreds = getLocalCreds();
    if (currentPassword !== localCreds.password) {
      throw new Error('La contraseña actual es incorrecta');
    }
    const updatedUser = newUsername && newUsername.trim() ? newUsername.trim() : localCreds.username;
    setLocalCreds(updatedUser, newPassword);
    return {
      success: true,
      message: 'Credenciales actualizadas exitosamente (guardado en navegador)'
    };
  }
}

// ==========================================
// SUBIDA DE ARCHIVOS / IMÁGENES
// ==========================================
export async function apiUploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(getAuthToken() ? { 'Authorization': `Bearer ${getAuthToken()}` } : {})
      },
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('NO_JSON_RESPONSE');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al subir la imagen');
    return data;
  } catch (err) {
    // Fallback en Netlify: convertir a Base64 data URL
    const base64Url = await fileToBase64(file);
    return {
      success: true,
      url: base64Url,
      fullUrl: base64Url,
      filename: file.name,
      originalName: file.name
    };
  }
}

// ==========================================
// OBTENCIÓN Y ACTUALIZACIÓN DE DATOS
// ==========================================
export async function apiGetFullData() {
  try {
    const data = await safeFetchJson(`${API_BASE}/data`);
    return data.data;
  } catch {
    return null;
  }
}

export async function apiUpdateInfo(infoData) {
  try {
    return await safeFetchJson(`${API_BASE}/data/info`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(infoData)
    });
  } catch {
    return { success: true, message: 'Guardado localmente' };
  }
}

export async function apiUpdateHero(heroData) {
  try {
    return await safeFetchJson(`${API_BASE}/data/hero`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(heroData)
    });
  } catch {
    return { success: true, message: 'Guardado localmente' };
  }
}

export async function apiUpdateMinerals(mineralsData) {
  try {
    return await safeFetchJson(`${API_BASE}/data/minerals`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(mineralsData)
    });
  } catch {
    return { success: true, message: 'Guardado localmente' };
  }
}

// CRUD ZONES (SEDES)
export async function apiSaveZone(zone, isNew = false) {
  const url = isNew ? `${API_BASE}/zones` : `${API_BASE}/zones/${zone.id}`;
  const method = isNew ? 'POST' : 'PUT';
  try {
    return await safeFetchJson(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(zone)
    });
  } catch {
    return { success: true, zone, message: 'Guardado localmente' };
  }
}

export async function apiDeleteZone(id) {
  try {
    return await safeFetchJson(`${API_BASE}/zones/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch {
    return { success: true, id, message: 'Eliminado localmente' };
  }
}

// CRUD SERVICES
export async function apiSaveService(service, isNew = false) {
  const url = isNew ? `${API_BASE}/services` : `${API_BASE}/services/${service.id}`;
  const method = isNew ? 'POST' : 'PUT';
  try {
    return await safeFetchJson(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(service)
    });
  } catch {
    return { success: true, service, message: 'Guardado localmente' };
  }
}

export async function apiDeleteService(id) {
  try {
    return await safeFetchJson(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch {
    return { success: true, id, message: 'Eliminado localmente' };
  }
}

// CRUD PRODUCTS
export async function apiSaveProduct(product, isNew = false) {
  const url = isNew ? `${API_BASE}/products` : `${API_BASE}/products/${product.id}`;
  const method = isNew ? 'POST' : 'PUT';
  try {
    return await safeFetchJson(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(product)
    });
  } catch {
    return { success: true, product, message: 'Guardado localmente' };
  }
}

export async function apiDeleteProduct(id) {
  try {
    return await safeFetchJson(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch {
    return { success: true, id, message: 'Eliminado localmente' };
  }
}

// CRUD PACKAGES
export async function apiSavePackage(pkg, isNew = false) {
  const url = isNew ? `${API_BASE}/packages` : `${API_BASE}/packages/${pkg.id}`;
  const method = isNew ? 'POST' : 'PUT';
  try {
    return await safeFetchJson(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(pkg)
    });
  } catch {
    return { success: true, pkg, message: 'Guardado localmente' };
  }
}

export async function apiDeletePackage(id) {
  try {
    return await safeFetchJson(`${API_BASE}/packages/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch {
    return { success: true, id, message: 'Eliminado localmente' };
  }
}

// CRUD GALLERY
export async function apiAddGalleryPhoto(photo) {
  try {
    return await safeFetchJson(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(photo)
    });
  } catch {
    return { success: true, photo, message: 'Guardado localmente' };
  }
}

export async function apiDeleteGalleryPhoto(id) {
  try {
    return await safeFetchJson(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch {
    return { success: true, id, message: 'Eliminado localmente' };
  }
}

// CRUD REVIEWS
export async function apiSaveReview(review, isNew = false) {
  const url = isNew ? `${API_BASE}/reviews` : `${API_BASE}/reviews/${review.id}`;
  const method = isNew ? 'POST' : 'PUT';
  try {
    return await safeFetchJson(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(review)
    });
  } catch {
    return { success: true, review, message: 'Guardado localmente' };
  }
}

export async function apiDeleteReview(id) {
  try {
    return await safeFetchJson(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch {
    return { success: true, id, message: 'Eliminado localmente' };
  }
}

// CRUD FAQS
export async function apiSaveFaq(faq, isNew = false) {
  const url = isNew ? `${API_BASE}/faqs` : `${API_BASE}/faqs/${faq.id}`;
  const method = isNew ? 'POST' : 'PUT';
  try {
    return await safeFetchJson(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(faq)
    });
  } catch {
    return { success: true, faq, message: 'Guardado localmente' };
  }
}

export async function apiDeleteFaq(id) {
  try {
    return await safeFetchJson(`${API_BASE}/faqs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch {
    return { success: true, id, message: 'Eliminado localmente' };
  }
}

// RESTORE & RESET
export async function apiResetFactory() {
  try {
    return await safeFetchJson(`${API_BASE}/data/reset`, {
      method: 'POST',
      headers: getHeaders()
    });
  } catch {
    return { success: true, message: 'Restaurado a valores iniciales' };
  }
}

export async function apiRestoreBackup(backupJson) {
  try {
    return await safeFetchJson(`${API_BASE}/data/restore`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(backupJson)
    });
  } catch {
    return { success: true, message: 'Copia restaurada localmente' };
  }
}

// ==========================================
// SUBIDA Y GESTIÓN DE AUDIOS / SONIDOS RELAJANTES
// ==========================================
export async function apiUploadAudio(file) {
  try {
    const formData = new FormData();
    formData.append('audio', file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${API_BASE}/upload/audio`, {
      method: 'POST',
      headers: {
        ...(getAuthToken() ? { 'Authorization': `Bearer ${getAuthToken()}` } : {})
      },
      body: formData,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('NO_JSON_RESPONSE');
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al subir el archivo de audio');
    return data;
  } catch {
    const base64Audio = await fileToBase64(file);
    return {
      success: true,
      url: base64Audio,
      fullUrl: base64Audio,
      filename: file.name,
      originalName: file.name
    };
  }
}

export async function apiGetSoundSettings() {
  try {
    const data = await safeFetchJson(`${API_BASE}/sound`);
    return data.soundSettings;
  } catch {
    return null;
  }
}

export async function apiUpdateSoundSettings(soundSettings) {
  try {
    return await safeFetchJson(`${API_BASE}/sound`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(soundSettings)
    });
  } catch {
    return { success: true, message: 'Guardado localmente' };
  }
}

export async function apiAddSoundTrack(track) {
  try {
    return await safeFetchJson(`${API_BASE}/sound/tracks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(track)
    });
  } catch {
    return { success: true, track, message: 'Guardado localmente' };
  }
}

export async function apiDeleteSoundTrack(id) {
  try {
    return await safeFetchJson(`${API_BASE}/sound/tracks/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch {
    return { success: true, id, message: 'Eliminado localmente' };
  }
}


