import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, AlertCircle, ShoppingBag, X, Star } from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import ImageUploader from '../components/ImageUploader';

export default function ProductsTab() {
  const { products, saveProduct, deleteProduct } = useSiteData();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialProduct = {
    id: `prod-${Date.now()}`,
    name: '',
    category: 'Tratamiento Facial & Corporal',
    tagline: '',
    price: 10.00,
    oldPrice: '',
    rating: 5.0,
    reviews: 50,
    badge: 'Nuevo',
    image: '',
    benefitsText: ''
  };

  const handleStartCreate = () => {
    setEditingProduct({ ...initialProduct });
    setIsCreating(true);
  };

  const handleStartEdit = (prod) => {
    setEditingProduct({
      ...prod,
      oldPrice: prod.oldPrice || '',
      benefitsText: Array.isArray(prod.benefits) ? prod.benefits.join('\n') : ''
    });
    setIsCreating(false);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsCreating(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const benefits = editingProduct.benefitsText
        ? editingProduct.benefitsText.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...editingProduct,
        price: Number(editingProduct.price) || 0,
        oldPrice: editingProduct.oldPrice ? Number(editingProduct.oldPrice) : null,
        rating: Number(editingProduct.rating) || 5.0,
        reviews: Number(editingProduct.reviews) || 0,
        benefits
      };
      delete payload.benefitsText;

      await saveProduct(payload, isCreating);
      setFeedback({ type: 'success', text: isCreating ? '¡Producto creado con éxito!' : '¡Producto actualizado con éxito!' });
      setTimeout(() => setFeedback(null), 3000);
      handleCloseModal();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al guardar el producto' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Deseas eliminar el producto "${name}"?`)) {
      try {
        await deleteProduct(id);
        setFeedback({ type: 'success', text: 'Producto eliminado' });
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
            Tienda, Cosmética & Souvenirs
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gestiona los productos naturales derivados de las aguas termales de Jamanco (Barro volcánico, bruma, jabones, sales).
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Nuevo Producto
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

      {/* Grid de Productos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {products.map((prod) => (
          <div key={prod.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
              <img
                src={prod.image || 'https://images.unsplash.com/photo-1608248597359-05f329971936?auto=format&fit=crop&w=600&q=80'}
                alt={prod.name}
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
                {prod.category}
              </div>

              {prod.badge && (
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.74rem',
                  fontWeight: '700'
                }}>
                  {prod.badge}
                </div>
              )}
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {prod.name}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                  {prod.tagline}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-teal)' }}>
                    ${Number(prod.price).toFixed(2)}
                  </span>
                  {prod.oldPrice && (
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ${Number(prod.oldPrice).toFixed(2)}
                    </span>
                  )}
                  <span style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: 'auto' }}>
                    <Star size={14} fill="#fbbf24" color="#fbbf24" /> {prod.rating} ({prod.reviews})
                  </span>
                </div>

                {prod.benefits && prod.benefits.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <ul style={{ paddingLeft: '1.1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {prod.benefits.slice(0, 2).map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                <button
                  onClick={() => handleStartEdit(prod)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Edit2 size={14} /> Editar
                </button>
                <button
                  onClick={() => handleDelete(prod.id, prod.name)}
                  className="btn btn-danger btn-sm"
                  style={{ padding: '0.5rem 0.8rem' }}
                  title="Eliminar producto"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Creación / Edición */}
      {editingProduct && (
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
                {isCreating ? 'Crear Nuevo Producto' : `Editar: ${editingProduct.name}`}
              </h3>
              <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="form-label">Nombre del Producto</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Categoría</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Etiqueta Badge (ej: Top Ventas, Antiacné)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.badge}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Eslogan / Subtítulo Corto</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct.tagline}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Precio Anterior</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={editingProduct.oldPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value })}
                    placeholder="Opcional"
                  />
                </div>
                <div>
                  <label className="form-label">Rating (1 - 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={editingProduct.rating}
                    onChange={(e) => setEditingProduct({ ...editingProduct, rating: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Reseñas #</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingProduct.reviews}
                    onChange={(e) => setEditingProduct({ ...editingProduct, reviews: e.target.value })}
                  />
                </div>
              </div>

              <ImageUploader
                label="Foto del Producto"
                currentImage={editingProduct.image}
                onImageUploaded={(url) => setEditingProduct({ ...editingProduct, image: url })}
              />

              <div>
                <label className="form-label">Beneficios Clave (Uno por línea)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={editingProduct.benefitsText}
                  onChange={(e) => setEditingProduct({ ...editingProduct, benefitsText: e.target.value })}
                  placeholder="Limpia toxinas y desobstruye poros&#10;Efecto tensor suave&#10;100% natural"
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
                  {saving ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
