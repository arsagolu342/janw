import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle, MapPin, X } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import ImageUploader from '../components/ImageUploader';

export default function ZonesTab() {
  const { zones, saveZone, deleteZone, info, updateInfo } = useSiteData();
  const [editingZone, setEditingZone] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  // Estado para el encabezado general de la sección
  const [headerData, setHeaderData] = useState({
    zonesSubtitle: info?.zonesSubtitle || 'Nuestras 3 Áreas Turísticas',
    zonesTitle: info?.zonesTitle || 'El Complejo Termales Jamanco',
    zonesDescription: info?.zonesDescription || 'Descubre las diferentes experiencias que tenemos preparadas para ti en Papallacta: relajación hidrotermal, noches de fiesta bajo las estrellas y actividades extremas en el mirador.'
  });
  const [savingHeader, setSavingHeader] = useState(false);

  const initialZone = {
    id: `zone-${Date.now()}`,
    name: '',
    temp: '38°C - 42°C',
    schedule: '06:00 AM a 19:30 PM',
    badge: 'Familiar & Relax',
    description: '',
    image: '',
    featuresText: ''
  };

  const handleStartCreate = () => {
    setEditingZone({ ...initialZone });
    setIsCreating(true);
  };

  const handleStartEdit = (zone) => {
    setEditingZone({
      ...zone,
      featuresText: Array.isArray(zone.features) ? zone.features.join('\n') : ''
    });
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setEditingZone(null);
    setIsCreating(false);
  };

  const handleSaveHeader = async (e) => {
    e.preventDefault();
    setSavingHeader(true);
    try {
      await updateInfo(headerData);
      setFeedback({ type: 'success', text: '¡Encabezado de la sección Sedes actualizado con éxito!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al actualizar encabezado' });
    } finally {
      setSavingHeader(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const features = editingZone.featuresText
        ? editingZone.featuresText.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...editingZone,
        features
      };
      delete payload.featuresText;

      await saveZone(payload, isCreating);
      setFeedback({ type: 'success', text: isCreating ? '¡Sede creada exitosamente!' : '¡Sede actualizada exitosamente!' });
      setTimeout(() => setFeedback(null), 3000);
      handleCloseModal();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al guardar la sede' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la sede "${name}"?`)) {
      try {
        await deleteZone(id);
        setFeedback({ type: 'success', text: 'Sede eliminada' });
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
            Sedes y Circuitos Turísticos
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Personaliza los títulos principales y administra las sedes: Terjamanco 1, Terjamanco 2 y El Mirador Jamanco.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Agregar Nueva Sede
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

      {/* Editor del Encabezado de la Sección */}
      <form onSubmit={handleSaveHeader} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0 }}>
            📝 Título y Textos de la Sección Sedes
          </h3>
          <button type="submit" disabled={savingHeader} className="btn btn-primary btn-sm">
            {savingHeader ? 'Guardando...' : 'Guardar Textos'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="form-label">Subtítulo / Etiqueta Superior</label>
            <input
              type="text"
              className="form-control"
              value={headerData.zonesSubtitle}
              onChange={(e) => setHeaderData({ ...headerData, zonesSubtitle: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Título Principal de la Sección</label>
            <input
              type="text"
              className="form-control"
              value={headerData.zonesTitle}
              onChange={(e) => setHeaderData({ ...headerData, zonesTitle: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="form-label">Descripción General de la Sección</label>
          <textarea
            className="form-control"
            rows={2}
            value={headerData.zonesDescription}
            onChange={(e) => setHeaderData({ ...headerData, zonesDescription: e.target.value })}
          />
        </div>
      </form>

      {/* Grid de Sedes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {zones.map((zone) => (
          <div key={zone.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
              <img
                src={zone.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'}
                alt={zone.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'rgba(6, 17, 24, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                color: '#5eead4',
                fontSize: '0.78rem',
                fontWeight: '700',
                border: '1px solid rgba(45, 212, 191, 0.4)'
              }}>
                {zone.badge}
              </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {zone.name}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                  <span>🌡️ {zone.temp}</span>
                  <span>⏰ {zone.schedule}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {zone.description}
                </p>

                {zone.features && zone.features.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Incluye:
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {zone.features.slice(0, 3).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                      {zone.features.length > 3 && <li style={{ color: 'var(--accent-teal)' }}>+{zone.features.length - 3} más...</li>}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                <button
                  onClick={() => handleStartEdit(zone)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Edit2 size={14} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(zone.id, zone.name)}
                  className="btn btn-danger btn-sm"
                  style={{ padding: '0.5rem 0.8rem' }}
                  title="Eliminar sede"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Creación / Edición */}
      {editingZone && (
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
                {isCreating ? 'Agregar Nueva Sede' : `Editar: ${editingZone.name}`}
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="form-label">Nombre de la Sede</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingZone.name}
                  onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Temperatura del Agua</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingZone.temp}
                    onChange={(e) => setEditingZone({ ...editingZone, temp: e.target.value })}
                    placeholder="38°C - 42°C"
                  />
                </div>
                <div>
                  <label className="form-label">Horario de Atención</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingZone.schedule}
                    onChange={(e) => setEditingZone({ ...editingZone, schedule: e.target.value })}
                    placeholder="06:00 AM a 19:30 PM"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Etiqueta / Badge (ej: Familiar & Relax, Pool Party)</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingZone.badge}
                  onChange={(e) => setEditingZone({ ...editingZone, badge: e.target.value })}
                />
              </div>

              <ImageUploader
                label="Foto de la Sede"
                currentImage={editingZone.image}
                onImageUploaded={(url) => setEditingZone({ ...editingZone, image: url })}
              />

              <div>
                <label className="form-label">Descripción Detallada</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={editingZone.description}
                  onChange={(e) => setEditingZone({ ...editingZone, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Características (Una por línea)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editingZone.featuresText}
                  onChange={(e) => setEditingZone({ ...editingZone, featuresText: e.target.value })}
                  placeholder="Piscinas cubiertas y al aire libre&#10;Baño turco natural&#10;Restaurante de truchas"
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
                  {saving ? 'Guardando...' : 'Guardar Sede'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
