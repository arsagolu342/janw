import React, { useState } from 'react';
import { Plus, Trash2, Check, AlertCircle, Camera, X, UploadCloud } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import ImageUploader from '../components/ImageUploader';

export default function GalleryTab() {
  const { gallery, addGalleryPhoto, deleteGalleryPhoto } = useSiteData();
  const [isAdding, setIsAdding] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'Terjamanco 1',
    url: ''
  });
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Todos');

  const categories = ['Terjamanco 1', 'Terjamanco 2', 'El Mirador Jamanco', 'Alojamiento Jamanco', 'Restaurante Jamanco', 'General'];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newPhoto.url) {
      setFeedback({ type: 'error', text: 'Por favor sube o proporciona la URL de la foto' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      await addGalleryPhoto({
        id: `gal-${Date.now()}`,
        title: newPhoto.title || 'Foto de Jamanco',
        category: newPhoto.category || 'General',
        url: newPhoto.url
      });
      setFeedback({ type: 'success', text: '¡Foto agregada a la galería con éxito!' });
      setTimeout(() => setFeedback(null), 3000);
      setIsAdding(false);
      setNewPhoto({ title: '', category: 'Terjamanco 1', url: '' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al agregar la foto' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`¿Deseas eliminar esta foto ("${title}") de la galería?`)) {
      try {
        await deleteGalleryPhoto(id);
        setFeedback({ type: 'success', text: 'Foto eliminada' });
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        setFeedback({ type: 'error', text: err.message || 'Error al eliminar foto' });
      }
    }
  };

  const filteredGallery = filterCategory === 'Todos'
    ? gallery
    : gallery.filter(g => g.category === filterCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Galería Fotográfica & Multimedia
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sube fotos desde tu computadora o agrega enlaces para mostrarlas en la galería pública del sitio web.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Subir Nueva Foto
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

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['Todos', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.84rem',
              fontWeight: '600',
              border: filterCategory === cat ? '1px solid var(--accent-teal)' : '1px solid var(--border-glass)',
              background: filterCategory === cat ? 'rgba(20, 184, 166, 0.2)' : 'var(--card-inner-bg)',
              color: filterCategory === cat ? 'var(--accent-teal)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Galería */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {filteredGallery.map((photo) => (
          <div key={photo.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', group: 'photo' }}>
            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
              <img
                src={photo.url}
                alt={photo.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => handleDelete(photo.id, photo.title)}
                className="btn btn-danger btn-sm"
                title="Eliminar foto"
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  padding: '0.4rem',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.9)'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--accent-teal)', fontWeight: '700', marginBottom: '0.2rem' }}>
                {photo.category}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {photo.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Agregar Foto */}
      {isAdding && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '550px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                Subir Foto a la Galería
              </h3>
              <button onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="form-label">Título o Pie de Foto</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  placeholder="ej: Piscinas al atardecer, Columpio Extremo, etc."
                  required
                />
              </div>

              <div>
                <label className="form-label">Categoría / Sede</label>
                <select
                  className="form-control"
                  value={newPhoto.category}
                  onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <ImageUploader
                label="Seleccionar o Subir Imagen"
                currentImage={newPhoto.url}
                onImageUploaded={(url) => setNewPhoto({ ...newPhoto, url })}
              />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="btn btn-outline btn-md"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary btn-md"
                  style={{ flex: 1 }}
                >
                  {saving ? 'Subiendo...' : 'Agregar a Galería'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
