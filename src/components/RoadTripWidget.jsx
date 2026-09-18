import React, { useState } from 'react';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Car, 
  Fuel, 
  ExternalLink, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { TERJAMANCO_INFO } from '../data/terjamancoData';

export default function RoadTripWidget() {
  const [selectedOrigin, setSelectedOrigin] = useState('pifo');

  const routes = {
    'pifo': {
      origin: 'Aeropuerto Tababela / Pifo',
      distance: '32 km',
      time: '35 min',
      highway: 'Vía Interoceánica E20',
      toll: '$0.00 (Sin peajes directos)',
      tip: 'La ruta más rápida y directa pasando el redondel de Pifo.'
    },
    'cumbaya': {
      origin: 'Quito Norte / Cumbayá',
      distance: '48 km',
      time: '55 min',
      highway: 'Ruta Viva -> Pifo -> E20 Papallacta',
      toll: '$0.60 (Peaje Túnel Guayasamín)',
      tip: 'Toma la Ruta Viva para evitar el tráfico de la ciudad.'
    },
    'chillos': {
      origin: 'Quito Sur / Valle de los Chillos',
      distance: '54 km',
      time: '1h 05 min',
      highway: 'Autopista Rumiñahui -> Pifo -> E20',
      toll: '$0.40 (Peaje Autopista)',
      tip: 'Conexión rápida por Píntag o vía Intervalles hacia Pifo.'
    },
    'baeza': {
      origin: 'Baeza / Tena (Oriente)',
      distance: '65 km',
      time: '1h 15 min',
      highway: 'Troncal Amazónica -> Vía Papallacta',
      toll: '$0.00',
      tip: 'Hermoso ascenso desde la Amazonía hacia la cordillera.'
    }
  };

  const currentRoute = routes[selectedOrigin];

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(2, 132, 199, 0.15)',
          border: '1px solid rgba(2, 132, 199, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-cyan)'
        }}>
          <Navigation size={20} />
        </div>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Calculadora de Ruta & Tiempo
          </div>
          <h4 style={{ fontSize: '1.25rem', color: 'var(--text-light)', fontWeight: '700' }}>
            ¿Cuánto demoras en llegar a Jamanco?
          </h4>
        </div>
      </div>

      {/* Origin Selection Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {Object.entries(routes).map(([key, r]) => {
          const isSelected = selectedOrigin === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedOrigin(key)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                background: isSelected ? 'rgba(2, 132, 199, 0.18)' : 'var(--card-inner-bg)',
                color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {r.origin.split('/')[0]}
            </button>
          );
        })}
      </div>

      {/* Route Metrics Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: 'var(--card-inner-bg)',
          border: '1px solid var(--border-glass)',
          padding: '0.9rem',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            <Clock size={13} color="var(--accent-teal)" />
            Tiempo Estimado
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-teal)', fontFamily: 'var(--font-display)' }}>
            {currentRoute.time}
          </div>
        </div>

        <div style={{
          background: 'var(--card-inner-bg)',
          border: '1px solid var(--border-glass)',
          padding: '0.9rem',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            <MapPin size={13} color="var(--accent-cyan)" />
            Distancia
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {currentRoute.distance}
          </div>
        </div>

        <div style={{
          background: 'var(--card-inner-bg)',
          border: '1px solid var(--border-glass)',
          padding: '0.9rem',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            <Car size={13} color="var(--accent-gold)" />
            Estado de Vía
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}>
            <CheckCircle2 size={15} />
            Asfalto 100%
          </div>
        </div>
      </div>

      {/* Route details banner */}
      <div style={{
        background: 'var(--card-inner-bg)',
        border: '1px solid var(--border-glass)',
        padding: '0.85rem 1rem',
        borderRadius: '10px',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
          Itinerario: {currentRoute.highway}
        </div>
        <div>{currentRoute.tip}</div>
      </div>

      {/* Open in Map Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <a
          href="https://maps.google.com/?q=Termales+Jamanco+Papallacta"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
          style={{ flex: 1, minWidth: '150px' }}
        >
          <Navigation size={15} />
          Iniciar en Google Maps
        </a>
      </div>
    </div>
  );
}
