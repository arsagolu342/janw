import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle, Waves, X, Tag } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import ImageUploader from '../components/ImageUploader';

export default function ServicesTab() {
  const { services, saveService, deleteService } = useSiteData();
  const [editingService, setEditingService] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Todos');

  const categories = ['Piscinas Termales', 'Mirador & Aventura', 'Hospedaje', 'Gastronomía'];

  const initialService = {
    id: `srv-${Date.now()}`,
    category: 'Piscinas Termales',
    title: '',
    shortDesc: '',
    price: 6.00,
    unit: 'por persona',
    duration: 'Pase de Día',
    badge: 'Más Popular',
    image: '',
    includedText: ''
  };

  const handleStartCreate = () => {
    setEditingService({ ...initialService });
    setIsCreating(true);
  };

  const handleStartEdit = (srv) => {
    setEditingService({
      ...srv,
      includedText: Array.isArray(srv.included) ? srv.included.join('\n') : ''
    });
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setEditingService(null);
    setIsCreating(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const included = editingService.includedText
        ? editingService.includedText.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...editingService,
        price: Number(editingService.price) || 0,
        included
      };
      delete payload.includedText;

      await saveService(payload, isCreating);
      setFeedback({ type: 'success', text: isCreating ? '¡Servicio creado con éxito!' : '¡Servicio actualizado con éxito!' });
      setTimeout(() => setFeedback(null), 3000);
      handleCloseModal();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al guardar el servicio' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`¿Deseas eliminar el servicio "${title}"?`)) {
      try {
        await deleteService(id);
        setFeedback({ type: 'success', text: 'Servicio eliminado' });
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        setFeedback({ type: 'error', text: err.message || 'Error al eliminar' });
      }
    }
  };

  const filteredServices = filterCategory === 'Todos'
    ? services
    : services.filter(s => s.category === filterCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Servicios, Entradas & Actividades
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Administra los precios de pases termales, columpio extremo, pesca, cabañas y almuerzos típicos.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Crear Nuevo Servicio
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

      {/* Categorías Filter */}
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

      {/* Grid de Servicios */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredServices.map((srv) => (
          <div key={srv.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '170px', width: '100%' }}>
              <img
                src={srv.image || 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'}
                alt={srv.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                left: '0.75rem',
                background: 'rgba(6, 17, 24, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-primary)',
                fontSize: '0.74rem',
                fontWeight: '700'
              }}>
                {srv.category}
              </div>

              {srv.badge && (
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#ffffff',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.74rem',
                  fontWeight: '700'
                }}>
                  {srv.badge}
                </div>
              )}
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {srv.title}
                  </h3>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-teal)' }}>
                    ${Number(srv.price).toFixed(2)}
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {srv.unit} • {srv.duration}
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                  {srv.shortDesc}
                </p>

                {srv.included && srv.included.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Qué incluye:
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {srv.included.slice(0, 3).map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                      {srv.included.length > 3 && <li style={{ color: 'var(--accent-teal)' }}>+{srv.included.length - 3} más...</li>}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                <button
                  onClick={() => handleStartEdit(srv)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Edit2 size={14} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(srv.id, srv.title)}
                  className="btn btn-danger btn-sm"
                  style={{ padding: '0.5rem 0.8rem' }}
                  title="Eliminar servicio"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Creación / Edición */}
      {editingService && (
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
          <div className="glass-card" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                {isCreating ? 'Crear Nuevo Servicio' : `Editar: ${editingService.title}`}
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Título del Servicio</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-control"
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Precio ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Unidad (ej: por adulto)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingService.unit}
                    onChange={(e) => setEditingService({ ...editingService, unit: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Duración / Horario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingService.duration}
                    onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Etiqueta Destacada (Badge opcional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingService.badge}
                  onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                  placeholder="Más Popular, Favorito Nocturno, etc."
                />
              </div>

              <ImageUploader
                label="Foto del Servicio o Actividad"
                currentImage={editingService.image}
                onImageUploaded={(url) => setEditingService({ ...editingService, image: url })}
              />

              <div>
                <label className="form-label">Descripción Corta</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Elementos Incluidos (Uno por línea)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editingService.includedText}
                  onChange={(e) => setEditingService({ ...editingService, includedText: e.target.value })}
                  placeholder="Acceso a piscinas e hidromasajes&#10;Vestidores y duchas&#10;Estacionamiento vigilado"
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
                  {saving ? 'Guardando...' : 'Guardar Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
