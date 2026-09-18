import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight
} from 'lucide-react';
import { TERJAMANCO_INFO } from '../data/terjamancoData';

export default function CartModal({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    const itemsSummary = cartItems.map(
      (item, i) => `${i + 1}. ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)} USD`
    ).join('\n');

    const text = `*PEDIDO DE SOUVENIRS & PRODUCTOS TERMALES - JAMANCO*\n\n` +
      `*Artículos solicitados:*\n${itemsSummary}\n\n` +
      `*Total:* $${total.toFixed(2)} USD\n\n` +
      `Hola Termales Jamanco, deseo coordinar el pago y entrega o retiro de estos productos.`;

    window.open(`https://wa.me/${TERJAMANCO_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(20, 184, 166, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-teal)'
            }}>
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>Tu Carrito Jamanco</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {cartItems.length} {cartItems.length === 1 ? 'artículo' : 'artículos'} seleccionados
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.3rem',
              borderRadius: '6px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', maxHeight: '55vh', overflowY: 'auto' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--card-inner-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                color: 'var(--text-muted)'
              }}>
                <ShoppingBag size={30} />
              </div>
              <h4 style={{ color: 'var(--text-light)', marginBottom: '0.4rem' }}>Tu carrito está vacío</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Explora nuestra línea de recuerdos, barro volcánico y productos de Papallacta.
              </p>
              <button 
                onClick={onClose}
                className="btn btn-primary btn-sm"
              >
                Ver Tienda Jamanco
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'var(--card-inner-bg)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '0.85rem'
                  }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{
                      color: 'var(--text-light)',
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </h5>
                    <div style={{ color: 'var(--accent-teal)', fontWeight: '700', fontSize: '0.88rem' }}>
                      ${item.price.toFixed(2)} USD
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-glass)'
                  }}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.35rem 0.55rem', cursor: 'pointer' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.35rem 0.55rem', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    title="Eliminar producto"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      padding: '0.4rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-glass)',
            background: 'var(--card-inner-bg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Total a Pagar:</span>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-teal)', fontFamily: 'var(--font-display)' }}>
                ${total.toFixed(2)} USD
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={handleWhatsAppCheckout}
                className="btn btn-primary"
                style={{ width: '100%', background: '#25d366', color: '#fff' }}
              >
                Completar Pedido por WhatsApp
                <ArrowRight size={18} />
              </button>

              <button
                onClick={onClearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: '0.3rem',
                  textDecoration: 'underline'
                }}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
