import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Check, AlertCircle, Link as LinkIcon, X, Eye, Sparkles } from 'lucide-react';
import { apiUploadImage } from '../../services/api';

// Helper de compresión y lectura en el navegador
function compressAndReadImage(file, maxWidth = 1280, maxHeight = 800, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

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

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ 
  currentImage, 
  onImageUploaded, 
  label = "Imagen del elemento",
  helpText = "PNG, JPG, WEBP, SVG hasta 15MB" 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [manualUrl, setManualUrl] = useState(currentImage || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Sincronizar input manual cuando cambie la imagen prop (ej: al abrir modal de otra sede)
  useEffect(() => {
    setManualUrl(currentImage || '');
  }, [currentImage]);

  const handleFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(25);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // 1. Comprimir y generar DataURL ultra ligero de inmediato
      const compressedDataUrl = await compressAndReadImage(file);
      onImageUploaded(compressedDataUrl);
      setUploadProgress(70);

      // 2. Notificar al backend si está disponible
      try {
        const res = await apiUploadImage(file);
        if (res && res.url) {
          onImageUploaded(res.url);
        }
      } catch (uploadErr) {
        console.warn('Backend upload offline, usando versión comprimida en memoria/localStorage:', uploadErr.message);
      }

      setUploadProgress(100);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setUploadProgress(0);
      }, 3000);
    } catch (err) {
      console.error('Error procesando imagen:', err);
      setUploadError(err.message || 'Error al procesar la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleManualUrlChange = (e) => {
    const val = e.target.value;
    setManualUrl(val);
    onImageUploaded(val); // Aplicar de inmediato al estado del formulario
  };

  const handleApplyManualUrl = () => {
    onImageUploaded(manualUrl.trim());
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  return (
    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
        <label className="form-label" style={{ margin: 0, fontWeight: '600' }}>
          <span>{label}</span>
        </label>
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--card-inner-bg)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: '700',
              border: 'none',
              background: mode === 'upload' ? 'var(--gradient-teal)' : 'transparent',
              color: mode === 'upload' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Subir Archivo
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: '700',
              border: 'none',
              background: mode === 'url' ? 'var(--gradient-teal)' : 'transparent',
              color: mode === 'url' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Pegar URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
              fileInputRef.current.click();
            }
          }}
          style={{
            border: isDragging ? '2px dashed var(--accent-teal)' : '1.5px dashed var(--input-border)',
            background: isDragging 
              ? 'rgba(20, 184, 166, 0.12)' 
              : 'rgba(6, 17, 24, 0.45)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: isDragging ? '0 0 20px rgba(20, 184, 166, 0.25)' : 'none'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileInputChange}
            style={{ display: 'none' }}
          />

          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(20, 184, 166, 0.15)',
            border: '1px solid rgba(45, 212, 191, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UploadCloud size={22} color="var(--accent-teal)" />
          </div>

          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
              {isUploading ? 'Procesando y subiendo imagen...' : 'Haz clic para seleccionar o arrastra una imagen'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {helpText}
            </div>
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div style={{ width: '80%', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginTop: '0.3rem' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--accent-teal)', transition: 'width 0.2s ease' }} />
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div className="input-icon-wrapper" style={{ flex: 1 }}>
            <LinkIcon size={16} className="input-icon-left" />
            <input
              type="text"
              className="form-control"
              placeholder="https://ejemplo.com/foto.jpg o /uploads/..."
              value={manualUrl}
              onChange={handleManualUrlChange}
            />
          </div>
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.6rem 1.1rem' }}
          >
            Aplicar
          </button>
        </div>
      )}

      {/* Estados de feedback */}
      {uploadSuccess && (
        <div className="form-feedback-success" style={{ marginTop: '0.45rem' }}>
          <Check size={14} /> ¡Imagen actualizada y lista para guardar!
        </div>
      )}

      {uploadError && (
        <div className="form-feedback-error" style={{ marginTop: '0.45rem' }}>
          <AlertCircle size={14} /> {uploadError}
        </div>
      )}

      {/* Previsualización ejecutiva con miniatura */}
      {currentImage && (
        <div style={{
          marginTop: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          background: 'rgba(6, 17, 24, 0.75)',
          border: '1px solid var(--border-glass)',
          padding: '0.6rem 0.85rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <img
            src={currentImage}
            alt="Vista previa"
            style={{
              width: '60px',
              height: '45px',
              objectFit: 'cover',
              borderRadius: '6px',
              border: '1px solid var(--border-glass)'
            }}
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>VISTA PREVIA ACTIVA</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500' }}>
              {currentImage.startsWith('data:') ? 'Imagen personalizada cargada' : currentImage}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onImageUploaded('');
              setManualUrl('');
            }}
            title="Quitar imagen"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

