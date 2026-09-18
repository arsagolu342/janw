import React, { useState } from 'react';
import { 
  Clock, 
  Check, 
  CalendarCheck
} from 'lucide-react';
import { SERVICES_LIST as DEFAULT_SERVICES } from '../data/terjamancoData';
import { useSiteData } from '../context/SiteDataContext';

export default function ServicesSection({ onOpenBookingModal }) {
  const { services } = useSiteData();
  const currentServices = services && services.length > 0 ? services : DEFAULT_SERVICES;
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', 'Piscinas Termales', 'Mirador & Aventura', 'Hospedaje', 'Gastronomía'];

  const filteredServices = activeCategory === 'Todos'
    ? currentServices
    : currentServices.filter(s => s.category === activeCategory);

  return (
    <section id="servicios" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-subtitle">Servicios & Actividades</span>
          <h2 className="section-title">Vive la Experiencia Completa en Jamanco</h2>
          <p className="section-description">
            Desde baños relajantes en aguas termales curativas hasta la emoción del columpio extremo en el mirador, hospedaje y la mejor gastronomía típica de Papallacta.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          justifyContent: 'center',
          marginBottom: '3rem'
        }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1px solid var(--accent-teal)' : '1px solid var(--border-glass)',
                  background: isActive ? 'rgba(20, 184, 166, 0.2)' : 'var(--card-inner-bg)',
                  color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem'
        }}>
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Image Container */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img 
                    src={service.image} 
                    alt={service.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  {service.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'var(--gradient-gold)',
                      color: '#000',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                      {service.badge}
                    </span>
                  )}
                  <span style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    background: 'var(--modal-bg)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--accent-teal)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    padding: '0.3rem 0.7rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    {service.category}
                  </span>
                </div>

                {/* Content Details */}
                <div style={{ padding: '1.75rem 1.75rem 1rem 1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <Clock size={15} />
                    {service.duration}
                  </div>

                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-light)', lineHeight: '1.3' }}>
                    {service.title}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    {service.shortDesc}
                  </p>

                  {/* Included list */}
                  <div style={{
                    background: 'var(--card-inner-bg)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Incluye:
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {service.included.map((inc, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          <Check size={14} color="var(--accent-teal)" flexShrink={0} />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Price and CTA footer */}
              <div style={{
                padding: '1.25rem 1.75rem 1.75rem 1.75rem',
                borderTop: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Precio / Tarifa</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--accent-teal)', fontFamily: 'var(--font-display)' }}>
                      ${service.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      USD
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenBookingModal}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <CalendarCheck size={16} />
                  Consultar / Reservar
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
