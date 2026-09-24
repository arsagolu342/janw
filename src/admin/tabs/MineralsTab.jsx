import React, { useState } from 'react';
import { Save, Check, AlertCircle, Sparkles, Activity } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

export default function MineralsTab() {
  const { minerals, updateMinerals } = useSiteData();
  const [mineralsList, setMineralsList] = useState([...minerals]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleItemChange = (index, field, value) => {
    const updated = [...mineralsList];
    updated[index] = { ...updated[index], [field]: value };
    setMineralsList(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await updateMinerals(mineralsList);
      setFeedback({ type: 'success', text: '¡Minerales y propiedades terapéuticas actualizadas!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al guardar minerales' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
             Propiedades Geotermales
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Edita los 4 componentes minerales volcánicos destacados (Azufre, Magnesio, Calcio, Silicio) y sus beneficios en la salud.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar Minerales'}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {mineralsList.map((mineral, index) => (
          <div key={mineral.id || index} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: `rgba(${mineral.color === '#f59e0b' ? '245, 158, 11' : mineral.color === '#10b981' ? '16, 185, 129' : mineral.color === '#06b6d4' ? '6, 182, 212' : '139, 92, 246'}, 0.2)`,
                color: mineral.color || 'var(--accent-teal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.95rem'
              }}>
                {mineral.symbol}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  className="form-control"
                  value={mineral.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  placeholder="Nombre del Mineral"
                  style={{ fontWeight: '700' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Símbolo Químico</label>
                <input
                  type="text"
                  className="form-control"
                  value={mineral.symbol}
                  onChange={(e) => handleItemChange(index, 'symbol', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.78rem' }}>Nivel de Concentración</label>
                <input
                  type="text"
                  className="form-control"
                  value={mineral.level}
                  onChange={(e) => handleItemChange(index, 'level', e.target.value)}
                  placeholder="Alto, Concentrado, etc."
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Beneficio Médico / Terapéutico</label>
              <textarea
                className="form-control"
                rows={3}
                value={mineral.benefit}
                onChange={(e) => handleItemChange(index, 'benefit', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
