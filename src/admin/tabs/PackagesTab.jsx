import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle, Ticket, X } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

export default function PackagesTab() {
  const { packages, savePackage, deletePackage } = useSiteData();
  const [editingPkg, setEditingPkg] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialPkg = {
    id: `pack-${Date.now()}`,
    name: '',
    category: 'Entradas',
    priceAdult: 6.00,
    priceChild: 3.00,
    popular: false,
    fixedForTwo: false,
    description: '',
    featuresText: ''
  };

  const handleStartCreate = () => {
    setEditingPkg({ ...initialPkg });
    setIsCreating(true);
  };

  const handleStartEdit = (pkg) => {
    setEditingPkg({
      ...pkg,
      featuresText: Array.isArray(pkg.features) ? pkg.features.join('\n') : ''
    });
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setEditingPkg(null);
    setIsCreating(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const features = editingPkg.featuresText
        ? editingPkg.featuresText.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...editingPkg,
        priceAdult: Number(editingPkg.priceAdult) || 0,
        priceChild: Number(editingPkg.priceChild) || 0,
        popular: !!editingPkg.popular,
        fixedForTwo: !!editingPkg.fixedForTwo,
        features
      };
      delete payload.featuresText;

      await savePackage(payload, isCreating);
      setFeedback({ type: 'success', text: isCreating ? '¡Paquete creado con éxito!' : '¡Paquete actualizado con éxito!' });
      setTimeout(() => setFeedback(null), 3000);
      handleCloseModal();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al guardar el paquete' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Deseas eliminar el paquete tarifario "${name}"?`)) {
      try {
        await deletePackage(id);
        setFeedback({ type: 'success', text: 'Paquete eliminado' });
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
            Tarifas, Paquetes & Calculadora
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Modifica las tarifas oficiales por adulto/niño utilizadas en el cotizador de reservas de Jamanco.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Nuevo Paquete
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

      {/* Grid de Paquetes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {packages.map((pkg) => (
          <div key={pkg.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-teal)', background: 'rgba(20, 184, 166, 0.15)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                  {pkg.category}
                </span>
                {pkg.popular && (
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                    ⭐ Popular
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {pkg.name}
              </h3>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-teal)' }}>
                  ${Number(pkg.priceAdult).toFixed(2)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ adulto</span>
                </span>
                {!pkg.fixedForTwo && (
                  <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#06b6d4' }}>
                    ${Number(pkg.priceChild).toFixed(2)} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ niño</span>
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                {pkg.description}
              </p>

              {pkg.features && pkg.features.length > 0 && (
                <ul style={{ paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {pkg.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
              <button
                onClick={() => handleStartEdit(pkg)}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Edit2 size={14} /> Editar
              </button>
              <button
                onClick={() => handleDelete(pkg.id, pkg.name)}
                className="btn btn-danger btn-sm"
                style={{ padding: '0.5rem 0.8rem' }}
                title="Eliminar paquete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición */}
      {editingPkg && (
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
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                {isCreating ? 'Crear Nuevo Paquete' : `Editar: ${editingPkg.name}`}
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="form-label">Nombre del Paquete</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Precio Adulto ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={editingPkg.priceAdult}
                    onChange={(e) => setEditingPkg({ ...editingPkg, priceAdult: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Precio Niño ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={editingPkg.priceChild}
                    onChange={(e) => setEditingPkg({ ...editingPkg, priceChild: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={editingPkg.popular}
                    onChange={(e) => setEditingPkg({ ...editingPkg, popular: e.target.checked })}
                  />
                  Marcar como Popular / Recomendado
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={editingPkg.fixedForTwo}
                    onChange={(e) => setEditingPkg({ ...editingPkg, fixedForTwo: e.target.checked })}
                  />
                  Precio Fijo para Parejas / Cabaña
                </label>
              </div>

              <div>
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={editingPkg.description}
                  onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Beneficios o Características (Uno por línea)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editingPkg.featuresText}
                  onChange={(e) => setEditingPkg({ ...editingPkg, featuresText: e.target.value })}
                  placeholder="Acceso completo de día&#10;Vestidores y duchas&#10;Estacionamiento vigilado"
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
                  {saving ? 'Guardando...' : 'Guardar Paquete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
