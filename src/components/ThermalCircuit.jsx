import React, { useState } from 'react';
import { 
  Waves, 
  Clock, 
  Check, 
  ArrowRight,
  Flame,
  Sparkles,
  Compass
} from 'lucide-react';
import { COMPLEX_ZONES as DEFAULT_ZONES } from '../data/terjamancoData';
import { useSiteData } from '../context/SiteDataContext';

export default function ThermalCircuit({ onOpenBookingModal }) {
  const { zones, info } = useSiteData();
  const currentZones = zones && zones.length > 0 ? zones : DEFAULT_ZONES;
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);
  const activeZone = currentZones[activeZoneIndex] || currentZones[0];

  return (
    <section id="sedes" style={{ padding: '6rem 0', background: 'var(--bg-primary)', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-subtitle">
            {info?.zonesSubtitle || "Nuestras 3 Áreas Turísticas"}
          </span>
          <h2 className="section-title">
            {info?.zonesTitle || "El Complejo Termales Jamanco"}
          </h2>
          <p className="section-description">
            {info?.zonesDescription || "Descubre las diferentes experiencias que tenemos preparadas para ti en Papallacta: relajación hidrotermal, noches de fiesta bajo las estrellas y actividades extremas en el mirador."}
          </p>
        </div>

        {/* Zone Selector Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          justifyContent: 'center',
          marginBottom: '2.5rem'
        }}>
          {currentZones.map((zone, idx) => {
            const isActive = activeZoneIndex === idx;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZoneIndex(idx)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.85rem 1.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'var(--gradient-teal)' : 'var(--card-inner-bg)',
                  border: isActive ? '1px solid #38bdf8' : '1px solid var(--border-glass)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: '700',
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? '0 4px 20px rgba(13, 148, 136, 0.45)' : 'none'
                }}
              >
                {zone.id.includes('mirador') ? <Compass size={18} color={isActive ? '#fff' : '#f59e0b'} /> : <Flame size={18} color={isActive ? '#fff' : '#0d9488'} />}
                {zone.name.split('(')[0]}
                <span style={{
                  fontSize: '0.75rem',
                  background: isActive ? 'rgba(0,0,0,0.3)' : 'rgba(14,165,233,0.15)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '10px',
                  color: isActive ? '#fff' : 'var(--accent-teal)'
                }}>
                  {zone.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Zone Card */}
        <div className="glass-card" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '0',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-glass)'
        }}>
          {/* Left Column: Image with badges */}
          <div style={{ position: 'relative', minHeight: '400px' }}>
            <img 
              src={activeZone.image} 
              alt={activeZone.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                minHeight: '400px'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '1.25rem',
              left: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <span style={{
                background: 'var(--modal-bg)',
                backdropFilter: 'blur(8px)',
                color: 'var(--accent-teal)',
                border: '1px solid var(--border-glass)',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <Flame size={16} />
                {activeZone.temp}
              </span>

              <span style={{
                background: 'var(--modal-bg)',
                backdropFilter: 'blur(8px)',
                color: 'var(--accent-gold)',
                border: '1px solid var(--border-glass)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <Clock size={14} />
                {activeZone.schedule}
              </span>
            </div>
          </div>

          {/* Right Column: Zone Highlights */}
          <div style={{
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--bg-card)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)', marginBottom: '0.5rem' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {activeZone.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '1.9rem', marginBottom: '1rem', color: 'var(--text-light)' }}>
                {activeZone.name}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '1.8rem' }}>
                {activeZone.description}
              </p>

              {/* Feature list */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Instalaciones y Servicios incluidos:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {activeZone.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                      <Check size={16} color="var(--accent-teal)" flexShrink={0} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenBookingModal}
                className="btn btn-primary"
                style={{ flex: '1', minWidth: '180px' }}
              >
                Planificar Visita a esta Sede
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
