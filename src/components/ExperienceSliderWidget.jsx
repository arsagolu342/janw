import React, { useState } from 'react';
import { 
  Sparkles, 
  Smile, 
  Frown, 
  Activity, 
  Zap, 
  Droplet, 
  Heart,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function ExperienceSliderWidget({ onOpenBookingModal }) {
  const [activeState, setActiveState] = useState('after'); // 'before' or 'after'

  const metrics = [
    {
      name: 'Nivel de Estrés y Ansiedad',
      before: '90% (Sobrecarga urbana)',
      after: '5% (Paz y mente en calma)',
      beforePercent: 90,
      afterPercent: 5,
      icon: Activity,
      color: '#ef4444',
      afterColor: '#10b981'
    },
    {
      name: 'Tensión Muscular y Espalda',
      before: '85% (Contracturas acumuladas)',
      after: '10% (Alivio térmico total)',
      beforePercent: 85,
      afterPercent: 10,
      icon: Zap,
      color: '#f59e0b',
      afterColor: '#10b981'
    },
    {
      name: 'Hidratación & Salud Dérmica',
      before: '35% (Resequedad por clima)',
      after: '98% (Renovación con azufre y silicio)',
      beforePercent: 35,
      afterPercent: 98,
      icon: Droplet,
      color: '#64748b',
      afterColor: '#06b6d4'
    },
    {
      name: 'Energía y Calidad del Sueño',
      before: '40% (Cansancio crónico)',
      after: '100% (Descanso reparador profundo)',
      beforePercent: 40,
      afterPercent: 100,
      icon: Heart,
      color: '#8b5cf6',
      afterColor: '#f59e0b'
    }
  ];

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-lg)',
      padding: '2.5rem',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2rem auto' }}>
        <span className="badge-teal" style={{ marginBottom: '0.6rem' }}>
          Simulador de Bienestar
        </span>
        <h3 style={{ fontSize: '1.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
          El Efecto Jamanco en tu Organismo
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Compara cómo reacciona tu cuerpo antes y después de una sesión de inmersión en nuestras aguas geotermales.
        </p>
      </div>

      {/* State Switcher Tabs */}
      <div style={{
        display: 'flex',
        maxWidth: '440px',
        margin: '0 auto 2.5rem auto',
        background: 'var(--card-inner-bg)',
        padding: '0.35rem',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-glass)'
      }}>
        <button
          onClick={() => setActiveState('before')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.2rem',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: activeState === 'before' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
            color: activeState === 'before' ? '#ef4444' : 'var(--text-muted)',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          <Frown size={18} />
          Antes de Jamanco
        </button>

        <button
          onClick={() => setActiveState('after')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.2rem',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: activeState === 'after' ? 'var(--gradient-teal)' : 'transparent',
            color: activeState === 'after' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: activeState === 'after' ? '0 4px 15px rgba(13, 148, 136, 0.4)' : 'none'
          }}
        >
          <Smile size={18} />
          Después de Jamanco
        </button>
      </div>

      {/* Dynamic Metrics Progress Bars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {metrics.map((m, idx) => {
          const IconC = m.icon;
          const isAfter = activeState === 'after';
          const percent = isAfter ? m.afterPercent : m.beforePercent;
          const statusText = isAfter ? m.after : m.before;
          const color = isAfter ? m.afterColor : m.color;

          return (
            <div
              key={idx}
              style={{
                background: 'var(--card-inner-bg)',
                border: '1px solid var(--border-glass)',
                padding: '1.25rem',
                borderRadius: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconC size={18} color={color} />
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {m.name}
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: color }}>
                  {percent}%
                </span>
              </div>

              {/* Progress Bar with smooth animation */}
              <div style={{
                height: '8px',
                background: 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '0.6rem'
              }}>
                <div style={{
                  height: '100%',
                  width: `${percent}%`,
                  background: color,
                  borderRadius: '4px',
                  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {statusText}
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onOpenBookingModal}
          className="btn btn-primary"
          style={{ minWidth: '240px' }}
        >
          <Sparkles size={18} />
          Experimentar la Relajación en Jamanco
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
