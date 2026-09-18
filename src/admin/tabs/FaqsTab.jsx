import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle, HelpCircle, X } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

export default function FaqsTab() {
  const { faqs, saveFaq, deleteFaq } = useSiteData();
  const [editingFaq, setEditingFaq] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialFaq = {
    id: `faq-${Date.now()}`,
    question: '',
    answer: ''
  };

  const handleStartCreate = () => {
    setEditingFaq({ ...initialFaq });
    setIsCreating(true);
  };

  const handleStartEdit = (faq) => {
    setEditingFaq({ ...faq });
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setEditingFaq(null);
    setIsCreating(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await saveFaq(editingFaq, isCreating);
      setFeedback({ type: 'success', text: isCreating ? '¡Pregunta creada con éxito!' : '¡Pregunta actualizada!' });
      setTimeout(() => setFeedback(null), 3000);
      handleCloseModal();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al guardar FAQ' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, question) => {
    if (window.confirm(`¿Deseas eliminar la pregunta "${question}"?`)) {
      try {
        await deleteFaq(id);
        setFeedback({ type: 'success', text: 'Pregunta eliminada' });
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
            Preguntas Frecuentes (FAQ)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Administra las dudas comunes de los turistas sobre cómo llegar a Papallacta, qué llevar y diferencias de sedes.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Nueva Pregunta
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

      {/* Lista de FAQs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, index) => (
          <div key={faq.id || index} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-teal)', fontWeight: '800' }}>#{index + 1}</span> {faq.question}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {faq.answer}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleStartEdit(faq)}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.45rem 0.75rem' }}
                title="Editar"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(faq.id, faq.question)}
                className="btn btn-danger btn-sm"
                style={{ padding: '0.45rem 0.75rem' }}
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición */}
      {editingFaq && (
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
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                {isCreating ? 'Nueva Pregunta Frecuente' : 'Editar Pregunta Frecuente'}
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="form-label">Pregunta</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="¿A qué temperatura está el agua? ¿Cómo llegar?"
                  required
                />
              </div>

              <div>
                <label className="form-label">Respuesta Detallada</label>
                <textarea
                  className="form-control"
                  rows={5}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
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
                  {saving ? 'Guardando...' : 'Guardar FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
