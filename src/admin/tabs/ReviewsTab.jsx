import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle, Star, X } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import ImageUploader from '../components/ImageUploader';

export default function ReviewsTab() {
  const { reviews, saveReview, deleteReview } = useSiteData();
  const [editingRev, setEditingRev] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialRev = {
    id: `rev-${Date.now()}`,
    name: '',
    role: 'Visitante de Quito',
    rating: 5,
    comment: '',
    date: 'Hace 1 semana (Facebook Review)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  };

  const handleStartCreate = () => {
    setEditingRev({ ...initialRev });
    setIsCreating(true);
  };

  const handleStartEdit = (rev) => {
    setEditingRev({ ...rev });
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setEditingRev(null);
    setIsCreating(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const payload = {
        ...editingRev,
        rating: Number(editingRev.rating) || 5
      };

      await saveReview(payload, isCreating);
      setFeedback({ type: 'success', text: isCreating ? '¡Testimonio creado!' : '¡Testimonio actualizado!' });
      setTimeout(() => setFeedback(null), 3000);
      handleCloseModal();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al guardar el testimonio' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Deseas eliminar la reseña de "${name}"?`)) {
      try {
        await deleteReview(id);
        setFeedback({ type: 'success', text: 'Reseña eliminada' });
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        setFeedback({ type: 'error', text: err.message || 'Error al eliminar' });
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Testimonios & Reseñas de Redes Sociales
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Administra las opiniones destacadas de Facebook y redes mostradas en la página principal.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Agregar Testimonio
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

      {/* Grid de Reseñas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {reviews.map((rev) => (
          <div key={rev.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                    <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.date}</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                "{rev.comment}"
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginBottom: '1rem' }}>
                <img
                  src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={rev.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-teal)' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)' }}>{rev.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{rev.role}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleStartEdit(rev)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Edit2 size={14} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(rev.id, rev.name)}
                  className="btn btn-danger btn-sm"
                  style={{ padding: '0.5rem 0.8rem' }}
                  title="Eliminar testimonio"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición */}
      {editingRev && (
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
          <div className="glass-card" style={{ maxWidth: '550px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                {isCreating ? 'Agregar Nuevo Testimonio' : `Editar Testimonio`}
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nombre del Visitante</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingRev.name}
                    onChange={(e) => setEditingRev({ ...editingRev, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Rol / Procedencia</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingRev.role}
                    onChange={(e) => setEditingRev({ ...editingRev, role: e.target.value })}
                    placeholder="Visitante de Quito, Cumbayá, etc."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Calificación (Estrellas)</label>
                  <select
                    className="form-control"
                    value={editingRev.rating}
                    onChange={(e) => setEditingRev({ ...editingRev, rating: Number(e.target.value) })}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
                    <option value="4">⭐⭐⭐⭐ (4 estrellas)</option>
                    <option value="3">⭐⭐⭐ (3 estrellas)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Fecha o Fuente</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingRev.date}
                    onChange={(e) => setEditingRev({ ...editingRev, date: e.target.value })}
                  />
                </div>
              </div>

              <ImageUploader
                label="Foto de Perfil / Avatar"
                currentImage={editingRev.avatar}
                onImageUploaded={(url) => setEditingRev({ ...editingRev, avatar: url })}
              />

              <div>
                <label className="form-label">Comentario / Opinión</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editingRev.comment}
                  onChange={(e) => setEditingRev({ ...editingRev, comment: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
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
                  {saving ? 'Guardando...' : 'Guardar Reseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
