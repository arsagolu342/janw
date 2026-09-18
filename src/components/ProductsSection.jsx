import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Star, 
  Check, 
  Plus, 
  Truck, 
  ShieldCheck, 
  Leaf 
} from 'lucide-react';
import { PRODUCTS_LIST as DEFAULT_PRODUCTS, TERJAMANCO_INFO } from '../data/terjamancoData';
import { useSiteData } from '../context/SiteDataContext';

export default function ProductsSection({ onAddToCart, onOpenCart }) {
  const { products } = useSiteData();
  const currentProducts = products && products.length > 0 ? products : DEFAULT_PRODUCTS;
  const [addedProductId, setAddedProductId] = useState(null);

  const handleAdd = (product) => {
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  return (
    <section id="productos" style={{ padding: '6rem 0', background: 'var(--bg-primary)', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-subtitle">Cosmética & Recuerdos de Papallacta</span>
          <h2 className="section-title">Lleva el Spa Jamanco a tu Hogar</h2>
          <p className="section-description">
            Productos artesanales formulados directamente con agua de manantial volcánico, arcilla pura y botánica andina medicinal de Papallacta.
          </p>
        </div>

        {/* Benefits bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <Leaf size={24} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>100% Natural</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sin químicos agresivos</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <Truck size={24} color="#0284c7" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>Envíos Nacionales</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>A todo el Ecuador (Servientrega)</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <ShieldCheck size={24} color="#d97706" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>Garantía Termal</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Minerales puros certificados</div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {currentProducts.map((prod) => {
            const isJustAdded = addedProductId === prod.id;

            return (
              <div 
                key={prod.id} 
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Image container */}
                  <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                    <img 
                      src={prod.image} 
                      alt={prod.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />

                    {prod.badge && (
                      <span style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'var(--gradient-gold)',
                        color: '#000',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                      }}>
                        {prod.badge}
                      </span>
                    )}

                    <span style={{
                      position: 'absolute',
                      bottom: '0.9rem',
                      right: '0.9rem',
                      background: 'var(--modal-bg)',
                      border: '1px solid var(--border-glass)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--accent-gold)',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <Star size={13} fill="currentColor" />
                      {prod.rating} ({prod.reviews})
                    </span>
                  </div>

                  {/* Body details */}
                  <div style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                      {prod.category}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '0.4rem', lineHeight: '1.3' }}>
                      {prod.name}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.1rem' }}>
                      {prod.tagline}
                    </p>

                    {/* Bullet benefits */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {prod.benefits.map((b, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                          <Check size={13} color="var(--accent-teal)" flexShrink={0} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price and Add button */}
                <div style={{
                  padding: '1.25rem 1.5rem 1.5rem 1.5rem',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.55rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                        ${prod.price.toFixed(2)}
                      </span>
                      {prod.oldPrice && (
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ${prod.oldPrice.toFixed(2)}
                        </span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>USD</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdd(prod)}
                    className="btn btn-gold btn-sm"
                    style={{
                      background: isJustAdded ? '#10b981' : 'var(--gradient-gold)',
                      gap: '0.4rem',
                      minWidth: '135px'
                    }}
                  >
                    {isJustAdded ? (
                      <>
                        <Check size={16} />
                        ¡Agregado!
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Al Carrito
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner for custom orders */}
        <div style={{
          marginTop: '4rem',
          background: 'var(--card-inner-bg)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem'
        }}>
          <div>
            <span className="badge-teal" style={{ marginBottom: '0.6rem' }}>
              Venta Mayorista & Souvenirs Corporativos
            </span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-light)', marginBottom: '0.4rem' }}>
              ¿Deseas kits de recuerdos de Termales Jamanco para tu empresa o grupo?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '650px' }}>
              Preparamos cajas de regalo con barro volcánico, brumas termales y jabones artesanales con tarifas preferenciales para grupos y tours.
            </p>
          </div>

          <a 
            href={`https://wa.me/${TERJAMANCO_INFO.whatsapp}?text=Hola%20Termales%20Jamanco,%20deseo%20cotizar%20pedidos%20por%20mayor%20de%20productos%20termales`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            Cotizar por WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
