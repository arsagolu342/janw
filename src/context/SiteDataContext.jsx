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
  setAuthToken,
  getAuthToken
} from '../services/api';

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

// Helpers de almacenamiento local para persistencia inmediata y soporte offline
const loadLocal = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(`terjamanco_${key}`);
    if (item) {
      const parsed = JSON.parse(item);
      // Auto-actualizar si tiene la imagen antigua o rota de unsplash
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
  // Estado general de datos (inicializado desde localStorage o defaults)
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

  // Estados de control
  const [isLoading, setIsLoading] = useState(true);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Estados de autenticación de admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  // Cargar datos desde el Backend API
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiGetFullData();
      if (data) {
        if (data.info) { setInfo(data.info); saveLocal('info', data.info); }
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

        setIsServerOnline(true);
        setLastSync(new Date());
      }
    } catch (error) {
      console.warn('Backend no disponible o usando caché local:', error.message);
      setIsServerOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    setInfo(prev => {
      const merged = { ...prev, ...newInfo };
      saveLocal('info', merged);
      return merged;
    });
    try {
      await apiUpdateInfo(newInfo);
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
    }
    return true;
  };

  const updateHero = async (newHero) => {
    setHero(prev => {
      const merged = { ...prev, ...newHero };
      saveLocal('hero', merged);
      return merged;
    });
    try {
      await apiUpdateHero(newHero);
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
    }
    return true;
  };

  const updateMinerals = async (newMinerals) => {
    setMinerals(newMinerals);
    saveLocal('minerals', newMinerals);
    try {
      await apiUpdateMinerals(newMinerals);
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
    }
    return true;
  };

  // ZONES
  const saveZone = async (zoneData, isNew = false) => {
    let savedZone = zoneData;
    if (isNew && !savedZone.id) {
      savedZone = { ...savedZone, id: `zone-${Date.now()}` };
    }
    setZones(prev => {
      let updated;
      if (isNew) {
        updated = [...prev, savedZone];
      } else {
        updated = prev.map(z => z.id === savedZone.id ? savedZone : z);
      }
      saveLocal('zones', updated);
      return updated;
    });
    try {
      const res = await apiSaveZone(zoneData, isNew);
      if (res?.success && res.zone) {
        setZones(prev => {
          const updated = prev.map(z => z.id === res.zone.id ? res.zone : z);
          saveLocal('zones', updated);
          return updated;
        });
        return res;
      }
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
    }
    return { success: true, zone: savedZone };
  };

  const deleteZone = async (id) => {
    setZones(prev => {
      const updated = prev.filter(z => z.id !== id);
      saveLocal('zones', updated);
      return updated;
    });
    try {
      await apiDeleteZone(id);
    } catch (err) {
      console.warn('Servidor offline, eliminado localmente:', err.message);
    }
  };

  // SERVICES
  const saveService = async (serviceData, isNew = false) => {
    let savedService = serviceData;
    if (isNew && !savedService.id) {
      savedService = { ...savedService, id: `svc-${Date.now()}` };
    }
    setServices(prev => {
      let updated;
      if (isNew) {
        updated = [...prev, savedService];
      } else {
        updated = prev.map(s => s.id === savedService.id ? savedService : s);
      }
      saveLocal('services', updated);
      return updated;
    });
    try {
      const res = await apiSaveService(serviceData, isNew);
      if (res?.success && res.service) {
        setServices(prev => {
          const updated = prev.map(s => s.id === res.service.id ? res.service : s);
          saveLocal('services', updated);
          return updated;
        });
        return res;
      }
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
    }
    return { success: true, service: savedService };
  };

  const deleteService = async (id) => {
    setServices(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveLocal('services', updated);
      return updated;
    });
    try {
      await apiDeleteService(id);
    } catch (err) {
      console.warn('Servidor offline, eliminado localmente:', err.message);
    }
  };

  // PRODUCTS
  const saveProduct = async (productData, isNew = false) => {
    let savedProduct = productData;
    if (isNew && !savedProduct.id) {
      savedProduct = { ...savedProduct, id: `prod-${Date.now()}` };
    }
    setProducts(prev => {
      let updated;
      if (isNew) {
        updated = [...prev, savedProduct];
      } else {
        updated = prev.map(p => p.id === savedProduct.id ? savedProduct : p);
      }
      saveLocal('products', updated);
      return updated;
    });
    try {
      const res = await apiSaveProduct(productData, isNew);
      if (res?.success && res.product) {
        setProducts(prev => {
          const updated = prev.map(p => p.id === res.product.id ? res.product : p);
          saveLocal('products', updated);
          return updated;
        });
        return res;
      }
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
    }
    return { success: true, product: savedProduct };
  };

  const deleteProduct = async (id) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveLocal('products', updated);
      return updated;
    });
    try {
      await apiDeleteProduct(id);
    } catch (err) {
      console.warn('Servidor offline, eliminado localmente:', err.message);
    }
  };

  // PACKAGES
  const savePackage = async (pkgData, isNew = false) => {
    let savedPackage = pkgData;
    if (isNew && !savedPackage.id) {
      savedPackage = { ...savedPackage, id: `pack-${Date.now()}` };
    }
    setPackages(prev => {
      let updated;
      if (isNew) {
        updated = [...prev, savedPackage];
      } else {
        updated = prev.map(p => p.id === savedPackage.id ? savedPackage : p);
      }
      saveLocal('packages', updated);
      return updated;
    });
    try {
      const res = await apiSavePackage(pkgData, isNew);
      if (res?.success && res.package) {
        setPackages(prev => {
          const updated = prev.map(p => p.id === res.package.id ? res.package : p);
          saveLocal('packages', updated);
          return updated;
        });
        return res;
      }
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
    }
    return { success: true, package: savedPackage };
  };

  const deletePackage = async (id) => {
    setPackages(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveLocal('packages', updated);
      return updated;
    });
    try {
      await apiDeletePackage(id);
    } catch (err) {
      console.warn('Servidor offline, eliminado localmente:', err.message);
    }
  };

  // GALLERY
  const addGalleryPhoto = async (photoData) => {
    const photo = { ...photoData, id: photoData.id || `gal-${Date.now()}` };
    setGallery(prev => {
      const updated = [photo, ...prev];
      saveLocal('gallery', updated);
      return updated;
    });
    try {
      const res = await apiAddGalleryPhoto(photoData);
      if (res?.success && res.photo) {
        setGallery(prev => {
          const updated = [res.photo, ...prev.filter(g => g.id !== photo.id)];
          saveLocal('gallery', updated);
          return updated;
        });
        return res;
      }
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
    }
    return { success: true, photo };
  };

  const deleteGalleryPhoto = async (id) => {
    setGallery(prev => {
      const updated = prev.filter(g => g.id !== id);
      saveLocal('gallery', updated);
      return updated;
    });
    try {
      await apiDeleteGalleryPhoto(id);
    } catch (err) {
      console.warn('Servidor offline, eliminado localmente:', err.message);
    }
  };

  // REVIEWS
  const saveReview = async (reviewData, isNew = false) => {
    let savedReview = reviewData;
    if (isNew && !savedReview.id) {
      savedReview = { ...savedReview, id: `rev-${Date.now()}` };
    }
    setReviews(prev => {
      let updated;
      if (isNew) {
        updated = [savedReview, ...prev];
      } else {
        updated = prev.map(r => String(r.id) === String(savedReview.id) ? savedReview : r);
      }
      saveLocal('reviews', updated);
      return updated;
    });
    try {
      const res = await apiSaveReview(reviewData, isNew);
      if (res?.success && res.review) {
        setReviews(prev => {
          const updated = prev.map(r => String(r.id) === String(res.review.id) ? res.review : r);
          saveLocal('reviews', updated);
          return updated;
        });
        return res;
      }
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
    }
    return { success: true, review: savedReview };
  };

  const deleteReview = async (id) => {
    setReviews(prev => {
      const updated = prev.filter(r => String(r.id) !== String(id));
      saveLocal('reviews', updated);
      return updated;
    });
    try {
      await apiDeleteReview(id);
    } catch (err) {
      console.warn('Servidor offline, eliminado localmente:', err.message);
    }
  };

  // FAQS
  const saveFaq = async (faqData, isNew = false) => {
    let savedFaq = faqData;
    if (isNew && !savedFaq.id) {
      savedFaq = { ...savedFaq, id: `faq-${Date.now()}` };
    }
    setFaqs(prev => {
      let updated;
      if (isNew) {
        updated = [...prev, savedFaq];
      } else {
        updated = prev.map(f => f.id === savedFaq.id ? savedFaq : f);
      }
      saveLocal('faqs', updated);
      return updated;
    });
    try {
      const res = await apiSaveFaq(faqData, isNew);
      if (res?.success && res.faq) {
        setFaqs(prev => {
          const updated = prev.map(f => f.id === res.faq.id ? res.faq : f);
          saveLocal('faqs', updated);
          return updated;
        });
        return res;
      }
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
    }
    return { success: true, faq: savedFaq };
  };

  const deleteFaq = async (id) => {
    setFaqs(prev => {
      const updated = prev.filter(f => f.id !== id);
      saveLocal('faqs', updated);
      return updated;
    });
    try {
      await apiDeleteFaq(id);
    } catch (err) {
      console.warn('Servidor offline, eliminado localmente:', err.message);
    }
  };

  // AMBIENT SOUNDS
  const updateSoundSettings = async (newSettings) => {
    setSoundSettings(prev => {
      const merged = { ...prev, ...newSettings };
      saveLocal('soundSettings', merged);
      return merged;
    });
    try {
      await apiUpdateSoundSettings(newSettings);
      return true;
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
      return true;
    }
  };

  const setActiveSoundTrack = async (trackId) => {
    setSoundSettings(prev => {
      const merged = { ...prev, activeTrackId: trackId };
      saveLocal('soundSettings', merged);
      return merged;
    });
    try {
      await apiUpdateSoundSettings({ activeTrackId: trackId });
      return true;
    } catch (err) {
      console.warn('Servidor offline, guardado localmente:', err.message);
      return true;
    }
  };

  const addSoundTrack = async (trackData) => {
    try {
      const res = await apiAddSoundTrack(trackData);
      if (res?.success && res.soundSettings) {
        setSoundSettings(res.soundSettings);
        saveLocal('soundSettings', res.soundSettings);
      } else if (res?.success && res.track) {
        setSoundSettings(prev => {
          const merged = { ...prev, tracks: [...(prev.tracks || []), res.track] };
          saveLocal('soundSettings', merged);
          return merged;
        });
      }
      return res;
    } catch (err) {
      const track = { ...trackData, id: trackData.id || `sound-${Date.now()}` };
      setSoundSettings(prev => {
        const merged = { ...prev, tracks: [...(prev.tracks || []), track] };
        saveLocal('soundSettings', merged);
        return merged;
      });
      return { success: true, track };
    }
  };

  const deleteSoundTrack = async (id) => {
    setSoundSettings(prev => {
      const merged = { ...prev, tracks: (prev.tracks || []).filter(t => t.id !== id) };
      saveLocal('soundSettings', merged);
      return merged;
    });
    try {
      const res = await apiDeleteSoundTrack(id);
      if (res?.success && res.soundSettings) {
        setSoundSettings(res.soundSettings);
        saveLocal('soundSettings', res.soundSettings);
      }
      return res;
    } catch (err) {
      console.warn('Servidor offline, eliminado localmente:', err.message);
      return { success: true };
    }
  };

  // FACTORY RESET
  const resetToDefaults = async () => {
    try {
      // Limpiar localStorage de Jamanco
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

      const res = await apiResetFactory();
      if (res?.success) {
        await loadData();
      }
      return res;
    } catch (err) {
      console.warn('Reset local completado:', err.message);
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
    refreshData: loadData
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
