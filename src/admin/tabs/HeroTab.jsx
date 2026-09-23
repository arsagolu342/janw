import React, { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import ImageUploader from '../components/ImageUploader';

export default function HeroTab() {
  const { hero, updateHero } = useSiteData();
  const [formData, setFormData] = useState({ ...hero });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (hero) {
      setFormData(prev => ({ ...prev, ...hero }));
    }
  }, [hero]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await updateHero(formData);
      setFeedback({ type: 'success', text: '¡Sección Hero principal guardada con éxito!' });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al guardar la sección Hero' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Cabecera Principal (Hero)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Personaliza el título de impacto, el subtítulo, las etiquetas flotantes y la foto de fondo principal de la portada.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: feedback.type === 'success' ? '#34d399' : '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '600',
          fontSize: '0.9rem'
        }}>
          {feedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {feedback.text}
        </div>
      )}

      {/* Imagen de Fondo */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ImageIcon size={18} color="var(--accent-teal)" />
          Foto de Fondo del Hero
        </h3>

        <ImageUploader
          label="Imagen de Fondo Panorámica"
          currentImage={formData.bgImage}
          onImageUploaded={(url) => setFormData(prev => ({ ...prev, bgImage: url }))}
          helpText="Foto panorámica de alta calidad (1920x1080 recomendado)"
        />
      </div>

      {/* Textos del Título */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--accent-cyan)" />
          Título Principal & Subtítulo
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Prefijo del Título</label>
            <input
              type="text"
              name="titlePrefix"
              className="form-control"
              value={formData.titlePrefix || ''}
              onChange={handleChange}
              placeholder="Descubre la Magia de "
            />
          </div>

          <div>
            <label className="form-label">Texto Destacado (Gradiente)</label>
            <input
              type="text"
              name="titleHighlight"
              className="form-control"
              value={formData.titleHighlight || ''}
              onChange={handleChange}
              placeholder="Termales Jamanco"
            />
          </div>

          <div>
            <label className="form-label">Sufijo del Título</label>
            <input
              type="text"
              name="titleSuffix"
              className="form-control"
              value={formData.titleSuffix || ''}
              onChange={handleChange}
              placeholder=" en Papallacta"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Subtítulo Descriptivo</label>
            <textarea
              name="subtitle"
              className="form-control"
              rows={3}
              value={formData.subtitle || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Badges Superiores */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Etiquetas Flotantes (Badges Superiores)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Etiqueta 1 (Temperatura)</label>
            <input
              type="text"
              name="badge1"
              className="form-control"
              value={formData.badge1 || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Etiqueta 2 (Redes / Ubicación)</label>
            <input
              type="text"
              name="badge2"
              className="form-control"
              value={formData.badge2 || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Etiqueta 3 (Distancia / Ruta)</label>
            <input
              type="text"
              name="badge3"
              className="form-control"
              value={formData.badge3 || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
