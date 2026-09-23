import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  TERJAMANCO_INFO as DEFAULT_INFO,
  MINERALS_DATA as DEFAULT_MINERALS,
  COMPLEX_ZONES as DEFAULT_ZONES,
  SERVICES_LIST as DEFAULT_SERVICES,
  PRODUCTS_LIST as DEFAULT_PRODUCTS,
  PACKAGES_PRICING as DEFAULT_PACKAGES,
  REVIEWS as DEFAULT_REVIEWS,
  FAQS as DEFAULT_FAQS,
  DEFAULT_SOUND_SETTINGS
} from '../data/terjamancoData';
import {
  apiGetFullData,
  apiLogin,
  apiVerifyToken,
  apiUpdateInfo,
  apiUpdateHero,
  apiUpdateMinerals,
  apiSaveZone,
  apiDeleteZone,
  apiSaveService,
  apiDeleteService,
  apiSaveProduct,
  apiDeleteProduct,
  apiSavePackage,
  apiDeletePackage,
  apiSaveReview,
  apiDeleteReview,
  apiSaveFaq,
  apiDeleteFaq,
  apiAddGalleryPhoto,
  apiDeleteGalleryPhoto,
  apiUpdateSoundSettings,
  apiAddSoundTrack,
  apiDeleteSoundTrack,
  apiResetFactory,
  apiGetFirebaseStatus,
  apiSyncFirebase,
  setAuthToken,
  getAuthToken
} from '../services/api';
import {
  isFirebaseConfigured,
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  initFirebase,
  saveFirebaseSiteData,
  subscribeToFirebaseSiteData,
  testFirebaseConnection
} from '../services/firebase';

const DEFAULT_GALLERY = [
  {
    id: "gal-1",
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    title: "Piscinas Termales de Papallacta",
    category: "Terjamanco 1"
  },
  {
    id: "gal-2",
    url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
    title: "Pase Nocturno & Pool Party",
    category: "Terjamanco 2"
  },
  {
    id: "gal-3",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    title: "Columpio Extremo con Vista al Valle",
    category: "El Mirador Jamanco"
  },
  {
    id: "gal-4",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "Paseos en Bote & Laguna",
    category: "El Mirador Jamanco"
  },
  {
    id: "gal-5",
    url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80",
    title: "Cabañas de Hospedaje Campestre",
    category: "Alojamiento Jamanco"
  },
  {
    id: "gal-6",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    title: "Plato de Trucha Típica de Papallacta",
    category: "Restaurante Jamanco"
  }
];

const DEFAULT_HERO = {
  badge1: "Aguas Termales Vírgenes 37°C - 44°C",
  badge2: "Papallacta, Ecuador • @Terjamancoo",
  badge3: "A 1h de Quito desde Pifo",
  titlePrefix: "Descubre la Magia de ",
  titleHighlight: "Termales Jamanco",
  titleSuffix: " en Papallacta",
  subtitle: "Sumérgete en nuestras piscinas termales naturales en Terjamanco 1 y 2, vive la adrenalina del Columpio Extremo en El Mirador, disfruta de la mejor trucha andina y hospédate en el corazón del páramo.",
  bgImage: "/images/jamanco_hero_cinematic.jpg"
};

const SiteDataContext = createContext(null);

// Helpers de almacenamiento local para persistencia inmediata y fallback offline
const loadLocal = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(`terjamanco_${key}`);
    if (item) {
      let parsed = JSON.parse(item);
      if (key === 'info' && parsed) {
        if (parsed.info && typeof parsed.info === 'object' && !parsed.name) {
          parsed = parsed.info;
        }
        if (parsed.info) {
          delete parsed.info;
        }
      }
      if (key === 'hero' && parsed && (!parsed.bgImage || parsed.bgImage.includes('unsplash.com'))) {
        parsed.bgImage = "/images/jamanco_hero_cinematic.jpg";
      }
      return parsed;
    }
    return defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveLocal = (key, val) => {
  try {
    localStorage.setItem(`terjamanco_${key}`, JSON.stringify(val));
  } catch (err) {
    console.warn(`Error guardando ${key} en localStorage:`, err);
  }
};

export function SiteDataProvider({ children }) {
  // Estado general de datos
  const [info, setInfo] = useState(() => loadLocal('info', DEFAULT_INFO));
  const [hero, setHero] = useState(() => loadLocal('hero', DEFAULT_HERO));
  const [minerals, setMinerals] = useState(() => loadLocal('minerals', DEFAULT_MINERALS));
  const [zones, setZones] = useState(() => loadLocal('zones', DEFAULT_ZONES));
  const [services, setServices] = useState(() => loadLocal('services', DEFAULT_SERVICES));
  const [products, setProducts] = useState(() => loadLocal('products', DEFAULT_PRODUCTS));
  const [packages, setPackages] = useState(() => loadLocal('packages', DEFAULT_PACKAGES));
  const [gallery, setGallery] = useState(() => loadLocal('gallery', DEFAULT_GALLERY));
  const [reviews, setReviews] = useState(() => loadLocal('reviews', DEFAULT_REVIEWS));
  const [faqs, setFaqs] = useState(() => loadLocal('faqs', DEFAULT_FAQS));
  const [soundSettings, setSoundSettings] = useState(() => loadLocal('soundSettings', DEFAULT_SOUND_SETTINGS));

  // Estados de control y conectividad
  const [isLoading, setIsLoading] = useState(true);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [isFirebaseOnline, setIsFirebaseOnline] = useState(() => isFirebaseConfigured());
  const [lastSync, setLastSync] = useState(null);

  // Estados de autenticación de admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Aplicar datos entrantes de forma atómica
  const applyIncomingData = useCallback((data) => {
    if (!data) return;
    if (data.info) {
      let cleanInfo = data.info;
      if (cleanInfo.info && typeof cleanInfo.info === 'object' && !cleanInfo.name) {
        cleanInfo = cleanInfo.info;
      }
      if (cleanInfo.info) {
        cleanInfo = { ...cleanInfo };
        delete cleanInfo.info;
      }
      setInfo(cleanInfo);
      saveLocal('info', cleanInfo);
    }
    if (data.hero) { setHero(data.hero); saveLocal('hero', data.hero); }
    if (data.minerals) { setMinerals(data.minerals); saveLocal('minerals', data.minerals); }
    if (data.zones) { setZones(data.zones); saveLocal('zones', data.zones); }
    if (data.services) { setServices(data.services); saveLocal('services', data.services); }
    if (data.products) { setProducts(data.products); saveLocal('products', data.products); }
    if (data.packages) { setPackages(data.packages); saveLocal('packages', data.packages); }
    if (data.gallery) { setGallery(data.gallery); saveLocal('gallery', data.gallery); }
    if (data.reviews) { setReviews(data.reviews); saveLocal('reviews', data.reviews); }
    if (data.faqs) { setFaqs(data.faqs); saveLocal('faqs', data.faqs); }
    if (data.soundSettings) { setSoundSettings(data.soundSettings); saveLocal('soundSettings', data.soundSettings); }
    setLastSync(new Date());
  }, []);

  // Cargar datos iniciales
  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiGetFullData();
      if (data) {
        applyIncomingData(data);
        setIsServerOnline(true);
      }
    } catch (error) {
      console.warn('Backend/Firebase no disponible o usando caché local:', error.message);
      setIsServerOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, [applyIncomingData]);

  // Sincronización en Tiempo Real bidireccional (SSE) entre Administrador y Público
  useEffect(() => {
    let eventSource = null;
    let reconnectTimeout = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/events');
        
        eventSource.onopen = () => {
          setIsServerOnline(true);
        };

        eventSource.onmessage = (e) => {
          try {
            const parsed = JSON.parse(e.data);
            if (parsed.data) {
              applyIncomingData(parsed.data);
              setIsServerOnline(true);
              setIsLoading(false);
            }
          } catch (err) {
            console.warn('Error procesando evento en tiempo real:', err);
          }
        };

        eventSource.onerror = () => {
          eventSource?.close();
          reconnectTimeout = setTimeout(connectSSE, 4000);
        };
      } catch (err) {
        console.warn('Error iniciando EventSource SSE:', err);
      }
    };

    connectSSE();

    // Consultar estado de Firebase Cloud (terjamancoweb)
    apiGetFirebaseStatus().then((res) => {
      if (res && res.connected) {
        setIsFirebaseOnline(true);
      }
    }).catch(() => {});

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [applyIncomingData]);

  // Suscripción en Tiempo Real directa a Firebase Firestore (si SDK cliente está configurado)
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return;
    }

    setIsFirebaseOnline(true);
    const unsubscribe = subscribeToFirebaseSiteData(
      (realtimeData) => {
        if (realtimeData) {
          applyIncomingData(realtimeData);
          setIsFirebaseOnline(true);
          setIsLoading(false);
        }
      },
      (err) => {
        console.warn('Firebase snapshot error:', err);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [applyIncomingData]);

  // Verificar autenticación al inicio
  useEffect(() => {
    async function checkAuth() {
      if (getAuthToken()) {
        const res = await apiVerifyToken();
        if (res.valid) {
          setIsAdminLoggedIn(true);
          setAdminUser(res.user);
        } else {
          setAuthToken(null);
          setIsAdminLoggedIn(false);
          setAdminUser(null);
        }
      }
    }
    checkAuth();
    loadData();
  }, [loadData]);

  // Sincronizar todos los datos actuales a Firebase (Seeding / Migración a la Nube)
  const syncAllToFirebase = async () => {
    try {
      const res = await apiSyncFirebase();
      if (res && res.success) {
        setIsFirebaseOnline(true);
        setLastSync(new Date());
        return res;
      }
    } catch (e) {
      console.warn('Error en apiSyncFirebase:', e);
    }

    if (isFirebaseConfigured()) {
      const payload = {
        info,
        hero,
        minerals,
        zones,
        services,
        products,
        packages,
        gallery,
        reviews,
        faqs,
        soundSettings
      };

      const res = await saveFirebaseSiteData(payload, false);
      setIsFirebaseOnline(true);
      setLastSync(new Date());
      return res;
    }

    throw new Error('Error al sincronizar con Firebase.');
  };

  // Configurar Firebase dinámicamente desde el Admin
  const saveAndApplyFirebaseConfig = async (newConfig) => {
    saveFirebaseConfig(newConfig);
    const initialized = initFirebase(newConfig);
    setIsFirebaseOnline(initialized);
    if (initialized) {
      await loadData();
    }
    return initialized;
  };

  // Auth actions
  const loginAdmin = async (username, password) => {
    const res = await apiLogin(username, password);
    if (res.success) {
      setIsAdminLoggedIn(true);
      setAdminUser(res.user);
    }
    return res;
  };

  const logoutAdmin = () => {
    setAuthToken(null);
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  // Mutaciones de datos
  const updateInfo = async (newInfo) => {
    let incoming = (newInfo && newInfo.info && typeof newInfo.info === 'object' && !newInfo.name) ? newInfo.info : newInfo;
    let current = (info && info.info && typeof info.info === 'object' && !info.name) ? info.info : info;
    const merged = { ...current, ...incoming };
    delete merged.info;

    setInfo(merged);
    saveLocal('info', merged);
    try {
      await apiUpdateInfo(merged);
    } catch (err) {
      console.warn('Error sincronizando info:', err.message);
    }
    return true;
  };

  const updateHero = async (newHero) => {
    const merged = { ...hero, ...newHero };
    setHero(merged);
    saveLocal('hero', merged);
    try {
      await apiUpdateHero(newHero);
    } catch (err) {
      console.warn('Error sincronizando hero:', err.message);
    }
    return true;
  };

  const updateMinerals = async (newMinerals) => {
    setMinerals(newMinerals);
    saveLocal('minerals', newMinerals);
    try {
      await apiUpdateMinerals(newMinerals);
    } catch (err) {
      console.warn('Error sincronizando minerals:', err.message);
    }
    return true;
  };

  // ZONES
  const saveZone = async (zoneData, isNew = false) => {
    let savedZone = zoneData;
    if (isNew && !savedZone.id) {
      savedZone = { ...savedZone, id: `zone-${Date.now()}` };
    }
    let updated;
    if (isNew) {
      updated = [...zones, savedZone];
    } else {
      updated = zones.map(z => z.id === savedZone.id ? savedZone : z);
    }
    setZones(updated);
    saveLocal('zones', updated);

    try {
      await apiSaveZone(savedZone, isNew, updated);
    } catch (err) {
      console.warn('Error guardando zona:', err.message);
    }
    return { success: true, zone: savedZone };
  };

  const deleteZone = async (id) => {
    const updated = zones.filter(z => z.id !== id);
    setZones(updated);
    saveLocal('zones', updated);
    try {
      await apiDeleteZone(id, updated);
    } catch (err) {
      console.warn('Error eliminando zona:', err.message);
    }
  };

  // SERVICES
  const saveService = async (serviceData, isNew = false) => {
    let savedService = serviceData;
    if (isNew && !savedService.id) {
      savedService = { ...savedService, id: `svc-${Date.now()}` };
    }
    let updated;
    if (isNew) {
      updated = [...services, savedService];
    } else {
      updated = services.map(s => s.id === savedService.id ? savedService : s);
    }
    setServices(updated);
    saveLocal('services', updated);

    try {
      await apiSaveService(savedService, isNew, updated);
    } catch (err) {
      console.warn('Error guardando servicio:', err.message);
    }
    return { success: true, service: savedService };
  };

  const deleteService = async (id) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    saveLocal('services', updated);
    try {
      await apiDeleteService(id, updated);
    } catch (err) {
      console.warn('Error eliminando servicio:', err.message);
    }
  };

  // PRODUCTS
  const saveProduct = async (productData, isNew = false) => {
    let savedProduct = productData;
    if (isNew && !savedProduct.id) {
      savedProduct = { ...savedProduct, id: `prod-${Date.now()}` };
    }
    let updated;
    if (isNew) {
      updated = [...products, savedProduct];
    } else {
      updated = products.map(p => p.id === savedProduct.id ? savedProduct : p);
    }
    setProducts(updated);
    saveLocal('products', updated);

    try {
      await apiSaveProduct(savedProduct, isNew, updated);
    } catch (err) {
      console.warn('Error guardando producto:', err.message);
    }
    return { success: true, product: savedProduct };
  };

  const deleteProduct = async (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveLocal('products', updated);
    try {
      await apiDeleteProduct(id, updated);
    } catch (err) {
      console.warn('Error eliminando producto:', err.message);
    }
  };

  // PACKAGES
  const savePackage = async (pkgData, isNew = false) => {
    let savedPackage = pkgData;
    if (isNew && !savedPackage.id) {
      savedPackage = { ...savedPackage, id: `pack-${Date.now()}` };
    }
    let updated;
    if (isNew) {
      updated = [...packages, savedPackage];
    } else {
      updated = packages.map(p => p.id === savedPackage.id ? savedPackage : p);
    }
    setPackages(updated);
    saveLocal('packages', updated);

    try {
      await apiSavePackage(savedPackage, isNew, updated);
    } catch (err) {
      console.warn('Error guardando paquete:', err.message);
    }
    return { success: true, package: savedPackage };
  };

  const deletePackage = async (id) => {
    const updated = packages.filter(p => p.id !== id);
    setPackages(updated);
    saveLocal('packages', updated);
    try {
      await apiDeletePackage(id, updated);
    } catch (err) {
      console.warn('Error eliminando paquete:', err.message);
    }
  };

  // GALLERY
  const addGalleryPhoto = async (photoData) => {
    const photo = { ...photoData, id: photoData.id || `gal-${Date.now()}` };
    const updated = [photo, ...gallery];
    setGallery(updated);
    saveLocal('gallery', updated);

    try {
      await apiAddGalleryPhoto(photo, updated);
    } catch (err) {
      console.warn('Error guardando foto:', err.message);
    }
    return { success: true, photo };
  };

  const deleteGalleryPhoto = async (id) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    saveLocal('gallery', updated);
    try {
      await apiDeleteGalleryPhoto(id, updated);
    } catch (err) {
      console.warn('Error eliminando foto:', err.message);
    }
  };

  // REVIEWS
  const saveReview = async (reviewData, isNew = false) => {
    let savedReview = reviewData;
    if (isNew && !savedReview.id) {
      savedReview = { ...savedReview, id: `rev-${Date.now()}` };
    }
    let updated;
    if (isNew) {
      updated = [savedReview, ...reviews];
    } else {
      updated = reviews.map(r => String(r.id) === String(savedReview.id) ? savedReview : r);
    }
    setReviews(updated);
    saveLocal('reviews', updated);

    try {
      await apiSaveReview(savedReview, isNew, updated);
    } catch (err) {
      console.warn('Error guardando reseña:', err.message);
    }
    return { success: true, review: savedReview };
  };

  const deleteReview = async (id) => {
    const updated = reviews.filter(r => String(r.id) !== String(id));
    setReviews(updated);
    saveLocal('reviews', updated);
    try {
      await apiDeleteReview(id, updated);
    } catch (err) {
      console.warn('Error eliminando reseña:', err.message);
    }
  };

  // FAQS
  const saveFaq = async (faqData, isNew = false) => {
    let savedFaq = faqData;
    if (isNew && !savedFaq.id) {
      savedFaq = { ...savedFaq, id: `faq-${Date.now()}` };
    }
    let updated;
    if (isNew) {
      updated = [...faqs, savedFaq];
    } else {
      updated = faqs.map(f => f.id === savedFaq.id ? savedFaq : f);
    }
    setFaqs(updated);
    saveLocal('faqs', updated);

    try {
      await apiSaveFaq(savedFaq, isNew, updated);
    } catch (err) {
      console.warn('Error guardando FAQ:', err.message);
    }
    return { success: true, faq: savedFaq };
  };

  const deleteFaq = async (id) => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    saveLocal('faqs', updated);
    try {
      await apiDeleteFaq(id, updated);
    } catch (err) {
      console.warn('Error eliminando FAQ:', err.message);
    }
  };

  // AMBIENT SOUNDS
  const updateSoundSettings = async (newSettings) => {
    const merged = { ...soundSettings, ...newSettings };
    setSoundSettings(merged);
    saveLocal('soundSettings', merged);
    try {
      await apiUpdateSoundSettings(merged);
      return true;
    } catch (err) {
      console.warn('Error actualizando sonidos:', err.message);
      return true;
    }
  };

  const setActiveSoundTrack = async (trackId) => {
    const merged = { ...soundSettings, activeTrackId: trackId };
    setSoundSettings(merged);
    saveLocal('soundSettings', merged);
    try {
      await apiUpdateSoundSettings(merged);
      return true;
    } catch (err) {
      console.warn('Error actualizando sonido activo:', err.message);
      return true;
    }
  };

  const addSoundTrack = async (trackData) => {
    const track = { ...trackData, id: trackData.id || `sound-${Date.now()}` };
    const merged = { ...soundSettings, tracks: [...(soundSettings.tracks || []), track] };
    setSoundSettings(merged);
    saveLocal('soundSettings', merged);

    try {
      await apiAddSoundTrack(track, merged);
    } catch (err) {
      console.warn('Error añadiendo pista de sonido:', err.message);
    }
    return { success: true, track };
  };

  const deleteSoundTrack = async (id) => {
    const merged = { ...soundSettings, tracks: (soundSettings.tracks || []).filter(t => t.id !== id) };
    setSoundSettings(merged);
    saveLocal('soundSettings', merged);

    try {
      await apiDeleteSoundTrack(id, merged);
    } catch (err) {
      console.warn('Error eliminando pista de sonido:', err.message);
    }
    return { success: true };
  };

  // FACTORY RESET
  const resetToDefaults = async () => {
    try {
      [
        'info', 'hero', 'minerals', 'zones', 'services', 
        'products', 'packages', 'gallery', 'reviews', 'faqs', 'soundSettings'
      ].forEach(k => localStorage.removeItem(`terjamanco_${k}`));

      setInfo(DEFAULT_INFO);
      setHero(DEFAULT_HERO);
      setMinerals(DEFAULT_MINERALS);
      setZones(DEFAULT_ZONES);
      setServices(DEFAULT_SERVICES);
      setProducts(DEFAULT_PRODUCTS);
      setPackages(DEFAULT_PACKAGES);
      setGallery(DEFAULT_GALLERY);
      setReviews(DEFAULT_REVIEWS);
      setFaqs(DEFAULT_FAQS);
      setSoundSettings(DEFAULT_SOUND_SETTINGS);

      if (isFirebaseConfigured()) {
        await saveFirebaseSiteData({
          info: DEFAULT_INFO,
          hero: DEFAULT_HERO,
          minerals: DEFAULT_MINERALS,
          zones: DEFAULT_ZONES,
          services: DEFAULT_SERVICES,
          products: DEFAULT_PRODUCTS,
          packages: DEFAULT_PACKAGES,
          gallery: DEFAULT_GALLERY,
          reviews: DEFAULT_REVIEWS,
          faqs: DEFAULT_FAQS,
          soundSettings: DEFAULT_SOUND_SETTINGS
        }, false);
      }

      await apiResetFactory();
      return { success: true };
    } catch (err) {
      console.warn('Reset completado:', err.message);
      return { success: true };
    }
  };

  const value = {
    info,
    hero,
    minerals,
    zones,
    services,
    products,
    packages,
    gallery,
    reviews,
    faqs,
    soundSettings,
    isLoading,
    isServerOnline,
    isFirebaseOnline,
    isFirebaseActive: isFirebaseConfigured(),
    lastSync,
    isAdminLoggedIn,
    adminUser,
    loginAdmin,
    logoutAdmin,
    updateInfo,
    updateHero,
    updateMinerals,
    saveZone,
    deleteZone,
    saveService,
    deleteService,
    saveProduct,
    deleteProduct,
    savePackage,
    deletePackage,
    addGalleryPhoto,
    deleteGalleryPhoto,
    saveReview,
    deleteReview,
    saveFaq,
    deleteFaq,
    updateSoundSettings,
    setActiveSoundTrack,
    addSoundTrack,
    deleteSoundTrack,
    resetToDefaults,
    refreshData: loadData,
    syncAllToFirebase,
    saveAndApplyFirebaseConfig,
    testFirebaseConnection,
    getStoredFirebaseConfig
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData debe usarse dentro de un SiteDataProvider');
  }
  return context;
}
