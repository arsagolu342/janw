import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Check, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Star, 
  Flame, 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  Trash2, 
  Building2, 
  RefreshCw, 
  Eye, 
  Layers,
  FileImage,
  Globe
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { apiUploadImage } from '../../services/api';
import Logo from '../../components/Logo';

// Helper de compresión y lectura de imágenes de logotipo optimizado para Web y Cloud Firestore (< 35KB)
export function compressAndReadLogoImage(fileOrBase64, maxWidth = 256, maxHeight = 256, quality = 0.88) {
  return new Promise((resolve) => {
    if (!fileOrBase64) return resolve('');

    if (typeof fileOrBase64 === 'string') {
      if (!fileOrBase64.startsWith('data:image/')) return resolve(fileOrBase64);
      if (fileOrBase64.length < 50000) return resolve(fileOrBase64); // ya es liviano
      
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = fileOrBase64.startsWith('data:image/png');
        resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality));
      };
      img.onerror = () => resolve(fileOrBase64);
      img.src = fileOrBase64;
      return;
    }

    const file = fileOrBase64;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const isPng = file.type === 'image/png';
        const compressedDataUrl = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export default function InfoTab() {
  const { info, updateInfo } = useSiteData();
  
  const getInitialFormData = (data) => ({
    name: data?.name || 'Termales Jamanco',
    alias: data?.alias || 'Terjamanco Papallacta',
    logoType: data?.logoType || (data?.logoUrl ? 'image' : 'emblem'),
    logoUrl: data?.logoUrl || '',
    logoSubtext: data?.logoSubtext || 'Papallacta • Ecuador',
    tagline: data?.tagline || '',
    origin: data?.origin || '',
    phone: data?.phone || '',
    whatsapp: data?.whatsapp || '',
    email: data?.email || '',
    facebookHandle: data?.facebookHandle || '',
    facebookUrl: data?.facebookUrl || '',
    address: data?.address || '',
    hours1: data?.hours1 || '',
    hours2: data?.hours2 || '',
    hoursMirador: data?.hoursMirador || '',
    waterTempRange: data?.waterTempRange || '37°C - 44°C',
    poolsCount: data?.poolsCount || 10,
    rating: data?.rating || 4.9,
    reviewsCount: data?.reviewsCount || 2840
  });

  const [formData, setFormData] = useState(() => getInitialFormData(info));
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  // Sincronizar automáticamente el formulario cuando los datos en contexto o servidor se actualizan
  useEffect(() => {
    if (info) {
      setFormData(prev => ({
        ...prev,
        ...getInitialFormData(info)
      }));
    }
  }, [info]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Subir archivo de imagen para el Logotipo con compresión y carga dual (inmediata + backend)
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de imagen
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', text: 'Por favor selecciona un archivo de imagen válido (PNG, SVG, JPG, WEBP).' });
      return;
    }

    try {
      setUploadingLogo(true);
      setFeedback(null);

      // 1. Comprimir imagen y generar DataURL optimizado de forma instantánea
      const optimizedDataUrl = await compressAndReadLogoImage(file);
      setFormData(prev => ({
        ...prev,
        logoUrl: optimizedDataUrl,
        logoType: 'image'
      }));

      // 2. Subir al backend o Cloud Storage si está conectado
      try {
        const res = await apiUploadImage(file);
        if (res && res.url) {
          setFormData(prev => ({
            ...prev,
            logoUrl: res.url,
            logoType: 'image'
          }));
        }
      } catch (uploadErr) {
        console.warn('Backend upload offline, usando imagen optimizada localmente:', uploadErr.message);
      }

      setFeedback({ type: 'success', text: '¡Imagen de logotipo cargada exitosamente! Haz clic en "Guardar Todo" para aplicarla.' });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', text: err.message || 'Error al procesar la imagen del logotipo' });
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Restablecer al emblema oficial
  const handleResetToEmblem = () => {
    setFormData(prev => ({
      ...prev,
      logoType: 'emblem',
      logoUrl: ''
    }));
    setFeedback({ type: 'success', text: 'Se ha restablecido al emblema vectorial predeterminado.' });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      let cleanLogoUrl = formData.logoUrl || '';
      if (formData.logoType === 'image' && cleanLogoUrl && cleanLogoUrl.startsWith('data:image/')) {
        cleanLogoUrl = await compressAndReadLogoImage(cleanLogoUrl);
      }

      const payload = {
        ...formData,
        logoUrl: cleanLogoUrl,
        rating: Number(formData.rating) || 4.9,
        reviewsCount: Number(formData.reviewsCount) || 2840,
        poolsCount: Number(formData.poolsCount) || 10
      };
      await updateInfo(payload);
      setFeedback({ type: 'success', text: '¡Información de la empresa y logotipo guardados y sincronizados en la nube exitosamente!' });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al guardar la información' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Encabezado Superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', color: 'var(--text-primary)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={24} color="var(--accent-teal)" />
            Empresa, Logotipo & Contacto
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Personaliza el nombre de la empresa, el logotipo oficial (vectorial o imagen personalizada) y la información global del complejo.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving || uploadingLogo}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)' }}
        >
          <Save size={18} />
          {saving ? 'Guardando Cambios...' : 'Guardar Todo'}
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '0.9rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: feedback.type === 'success' ? '#34d399' : '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '600',
          fontSize: '0.92rem'
        }}>
          {feedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {feedback.text}
        </div>
      )}

      {/* ========================================================================= */}
      {/* BLOQUE DESTACADO: LOGOTIPO & IDENTIDAD VISUAL DE LA EMPRESA               */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(45, 212, 191, 0.35)', background: 'linear-gradient(180deg, rgba(6, 24, 30, 0.75) 0%, rgba(6, 17, 24, 0.85) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
              <Sparkles size={20} color="var(--accent-teal)" />
              Configuración de Marca & Logotipo
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: '0.35rem 0 0 0' }}>
              Elige cómo se presentará la marca en la barra de navegación, pie de página, panel de administración y tickets.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, logoType: 'emblem' }))}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: formData.logoType === 'emblem' ? 'var(--accent-teal)' : 'transparent',
                color: formData.logoType === 'emblem' ? '#041017' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={14} /> Emblema Vectorial
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, logoType: 'image' }))}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: formData.logoType === 'image' ? 'var(--accent-teal)' : 'transparent',
                color: formData.logoType === 'image' ? '#041017' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <ImageIcon size={14} /> Imagen / Archivo
            </button>
          </div>
        </div>

        {/* Grid de 2 Columnas: Controles a la izquierda y Live Previews a la derecha */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Columna Izquierda: Opciones de Carga y Textos del Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Nombre y Subtexto del Logo */}
            <div>
              <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                Nombre de la Empresa / Marca Principal *
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Ej. Termales Jamanco"
                required
                style={{ fontSize: '1rem', fontWeight: '600' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Aparece destacado en la cabecera principal, títulos y logotipo.
              </span>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                Subtítulo o Ubicación en el Logotipo
              </label>
              <input
                type="text"
                name="logoSubtext"
                className="form-control"
                value={formData.logoSubtext || ''}
                onChange={handleChange}
                placeholder="Ej. Papallacta • Ecuador"
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Texto secundario en mayúsculas bajo el nombre principal del logotipo.
              </span>
            </div>

            {/* Opciones cuando se selecciona tipo imagen */}
            {formData.logoType === 'image' && (
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px dashed rgba(56, 189, 248, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileImage size={16} />
                    Subir Imagen del Logotipo
                  </span>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={handleResetToEmblem}
                      className="btn-text"
                      style={{ color: '#f87171', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: 0, cursor: 'pointer' }}
                    >
                      <Trash2 size={13} /> Quitar Imagen
                    </button>
                  )}
                </div>

                {/* File Upload Button / Input */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png,image/svg+xml,image/jpeg,image/webp"
                    style={{ display: 'none' }}
                    id="logo-file-input"
                  />
                  <label
                    htmlFor="logo-file-input"
                    className="btn btn-outline btn-md"
                    style={{
                      cursor: uploadingLogo ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(56, 189, 248, 0.1)',
                      borderColor: 'rgba(56, 189, 248, 0.35)',
                      color: 'var(--accent-cyan)'
                    }}
                  >
                    <Upload size={16} />
                    {uploadingLogo ? 'Subiendo imagen...' : 'Seleccionar Archivo (PNG, SVG, JPG)'}
                  </label>
                </div>

                {/* URL Directa Alternativa */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    O escribe la URL directa de la imagen:
                  </label>
                  <input
                    type="text"
                    name="logoUrl"
                    className="form-control"
                    value={formData.logoUrl || ''}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/mi-logo.png o /uploads/..."
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  💡 Consejo: Para un resultado profesional óptimo, usa imágenes en formato <strong>PNG o SVG con fondo transparente</strong> con proporciones cuadradas o circulares (mínimo 200x200 px).
                </div>
              </div>
            )}

            {/* Selector de modo emblema informativo */}
            {formData.logoType === 'emblem' && (
              <div style={{
                background: 'rgba(20, 184, 166, 0.08)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                fontSize: '0.84rem',
                color: 'var(--text-secondary)'
              }}>
                <span style={{ fontWeight: '700', color: 'var(--accent-teal)', display: 'block', marginBottom: '0.25rem' }}>
                  ✓ Modo Emblema Geotermal Activo
                </span>
                Se está utilizando el emblema vectorial ilustrado (Colibrí de Páramo + Manantial Termal + Cordillera de Papallacta) combinado automáticamente con el nombre de tu empresa.
              </div>
            )}
          </div>

          {/* Columna Derecha: Vista Previa en Vivo (Live Previews) */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Eye size={16} color="var(--accent-teal)" />
                Vista Previa en Tiempo Real
              </span>
              <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(45, 212, 191, 0.15)', color: 'var(--accent-teal)', fontWeight: '600' }}>
                Live Preview
              </span>
            </div>

            {/* Vista 1: Barra de Navegación Oscura (Header) */}
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                1. Vista en Barra Superior / Navbar (Fondo Oscuro):
              </span>
              <div style={{
                background: 'rgba(6, 17, 24, 0.95)',
                border: '1px solid rgba(45, 212, 191, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
              }}>
                <Logo 
                  size={42} 
                  showText={true}
                  customName={formData.name}
                  customSubtext={formData.logoSubtext}
                  customLogoUrl={formData.logoUrl}
                  customLogoType={formData.logoType}
                />
              </div>
            </div>

            {/* Vista 2: Modo Claro / Impresión */}
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                2. Vista en Modo Claro / Facturas / Documentos:
              </span>
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <div style={{ filter: 'brightness(0.2) contrast(1.2)' }}>
                  <Logo 
                    size={40} 
                    showText={true}
                    customName={formData.name}
                    customSubtext={formData.logoSubtext}
                    customLogoUrl={formData.logoUrl}
                    customLogoType={formData.logoType}
                  />
                </div>
              </div>
            </div>

            {/* Vista 3: Tamaño Compacto / Icono Móvil */}
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                3. Vista Solo Icono / Favicon / App móvil:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(6, 17, 24, 0.95)', padding: '0.6rem', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'inline-flex' }}>
                  <Logo 
                    size={36} 
                    showText={false}
                    customName={formData.name}
                    customSubtext={formData.logoSubtext}
                    customLogoUrl={formData.logoUrl}
                    customLogoType={formData.logoType}
                  />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Visualización optimizada para pantallas táctiles y barra de navegación compacta.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BLOQUE 2: DETALLES DE LA EMPRESA & ESCRIPCIÓN GENERAL                      */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={18} color="var(--accent-teal)" />
          Detalles Corporativos & Eslogan
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Alias o Nombre Corto Comercial</label>
            <input
              type="text"
              name="alias"
              className="form-control"
              value={formData.alias || ''}
              onChange={handleChange}
              placeholder="Ej. Terjamanco Papallacta"
            />
          </div>

          <div>
            <label className="form-label">Origen de las Aguas Termales</label>
            <input
              type="text"
              name="origin"
              className="form-control"
              value={formData.origin || ''}
              onChange={handleChange}
              placeholder="Ej. Aguas Termales Medicinales 100% Vírgenes..."
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Eslogan / Tagline Corporativo</label>
            <input
              type="text"
              name="tagline"
              className="form-control"
              value={formData.tagline || ''}
              onChange={handleChange}
              placeholder="Ej. El Paraíso Geotermal de Papallacta | Piscinas Termales..."
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BLOQUE 3: CONTACTO & REDES SOCIALES                                       */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Phone size={18} color="var(--accent-cyan)" />
          Canales de Contacto Directo & Redes Sociales
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Teléfono Visible (Formato amigable)</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="+593 98 138 5981"
            />
          </div>

          <div>
            <label className="form-label">WhatsApp (Solo números con código de país)</label>
            <input
              type="text"
              name="whatsapp"
              className="form-control"
              value={formData.whatsapp || ''}
              onChange={handleChange}
              placeholder="593981385981"
            />
          </div>

          <div>
            <label className="form-label">Correo Electrónico Oficial</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="contacto@termalesjamanco.com"
            />
          </div>

          <div>
            <label className="form-label">Facebook Handle (@nombre)</label>
            <input
              type="text"
              name="facebookHandle"
              className="form-control"
              value={formData.facebookHandle || ''}
              onChange={handleChange}
              placeholder="@Terjamancoo"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">URL Completa de Facebook</label>
            <input
              type="text"
              name="facebookUrl"
              className="form-control"
              value={formData.facebookUrl || ''}
              onChange={handleChange}
              placeholder="https://www.facebook.com/Terjamancoo"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Dirección Física Completa</label>
            <textarea
              name="address"
              className="form-control"
              rows={2}
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Vía Quito - Papallacta, Km 45..."
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BLOQUE 4: HORARIOS & MÉTRICAS                                             */}
      {/* ========================================================================= */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="#f59e0b" />
          Horarios de Atención & Métricas Clave
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Horario Sede 1</label>
            <input
              type="text"
              name="hours1"
              className="form-control"
              value={formData.hours1 || ''}
              onChange={handleChange}
              placeholder="Todos los días 06:00 AM - 19:30 PM"
            />
          </div>

          <div>
            <label className="form-label">Horario Sede 2 (Pase Nocturno)</label>
            <input
              type="text"
              name="hours2"
              className="form-control"
              value={formData.hours2 || ''}
              onChange={handleChange}
              placeholder="Todos los días 06:00 AM - 23:00 PM"
            />
          </div>

          <div>
            <label className="form-label">Horario El Mirador Jamanco</label>
            <input
              type="text"
              name="hoursMirador"
              className="form-control"
              value={formData.hoursMirador || ''}
              onChange={handleChange}
              placeholder="Fines de semana y feriados 06:00 AM - 17:00 PM"
            />
          </div>

          <div>
            <label className="form-label">Rango de Temperatura del Agua</label>
            <input
              type="text"
              name="waterTempRange"
              className="form-control"
              value={formData.waterTempRange || ''}
              onChange={handleChange}
              placeholder="37°C - 44°C"
            />
          </div>

          <div>
            <label className="form-label">Número Total de Piscinas</label>
            <input
              type="number"
              name="poolsCount"
              className="form-control"
              value={formData.poolsCount || 10}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Calificación Promedio (Rating)</label>
            <input
              type="number"
              step="0.1"
              name="rating"
              className="form-control"
              value={formData.rating || 4.9}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Botón de Guardado Inferior */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
        <button
          type="submit"
          disabled={saving || uploadingLogo}
          className="btn btn-primary btn-lg"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', minWidth: '220px', justifyContent: 'center' }}
        >
          <Save size={20} />
          {saving ? 'Guardando Cambios...' : 'Guardar Información'}
        </button>
      </div>
    </form>
  );
}

