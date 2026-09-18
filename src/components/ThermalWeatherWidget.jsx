import React, { useState } from 'react';
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  Flame, 
  Sparkles, 
  RefreshCw,
  Mountain,
  Sun
} from 'lucide-react';
import { TERJAMANCO_INFO } from '../data/terjamancoData';

export default function ThermalWeatherWidget() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPool, setSelectedPool] = useState('Terjamanco 2');

  const poolTemps = {
    'Terjamanco 1': { temp: 40, air: 13, name: 'Piscinas Familiares & Turco', status: 'Ideal para familias' },
    'Terjamanco 2': { temp: 43, air: 11, name: 'Pozas Calientes & Nocturno', status: 'Efecto descontracturante intenso' },
    'El Mirador': { temp: 38, air: 10, name: 'Mirador & Laguna Andina', status: 'Viento fresco de cordillera' }
  };

  const current = poolTemps[selectedPool];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

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
      {/* Decorative ambient water glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '140px',
        height: '140px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Widget Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(20, 184, 166, 0.15)',
            border: '1px solid rgba(20, 184, 166, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-teal)'
          }}>
            <CloudSun size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estado Meteorológico en Vivo
            </div>
            <h4 style={{ fontSize: '1.25rem', color: 'var(--text-light)', fontWeight: '700' }}>
              Papallacta & Aguas Termales
            </h4>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          title="Actualizar datos de sensores"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--card-inner-bg)',
            border: '1px solid var(--border-glass)',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <RefreshCw size={13} style={{ transform: isRefreshing ? 'rotate(360deg)' : 'none', transition: 'transform 0.8s ease' }} />
          Actualizado hace 2 min
        </button>
      </div>

      {/* Area Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        background: 'var(--card-inner-bg)',
        padding: '0.35rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-glass)'
      }}>
        {Object.keys(poolTemps).map((poolName) => {
          const isSelected = selectedPool === poolName;
          return (
            <button
              key={poolName}
              onClick={() => setSelectedPool(poolName)}
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                background: isSelected ? 'var(--gradient-teal)' : 'transparent',
                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {poolName}
            </button>
          );
        })}
      </div>

      {/* Main Dual Temperature Meter Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.2rem',
        marginBottom: '1.5rem'
      }}>
        {/* Hot Water Sensor Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: '700', textTransform: 'uppercase' }}>
              Temperatura del Agua
            </span>
            <Flame size={18} color="#f59e0b" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-gold)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {current.temp}°C
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Geotermal</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            {current.name}
          </div>
        </div>

        {/* Cold Mountain Air Sensor Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(14, 165, 233, 0.06) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase' }}>
              Clima Páramo Andino
            </span>
            <Mountain size={18} color="#0284c7" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {current.air}°C
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Ambiente</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            {current.status}
          </div>
        </div>
      </div>

      {/* Atmospheric Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        padding: '0.9rem',
        background: 'var(--card-inner-bg)',
        border: '1px solid var(--border-glass)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <Droplets size={13} color="var(--accent-teal)" />
            Humedad
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>84%</div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <Wind size={13} color="var(--accent-cyan)" />
            Viento
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>12 km/h</div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
            <Sparkles size={13} color="var(--accent-gold)" />
            Pureza Mineral
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-teal)' }}>100% Virgen</div>
        </div>
      </div>

      {/* Operational Live Status Footer */}
      <div style={{
        marginTop: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#10b981',
          display: 'inline-block',
          boxShadow: '0 0 10px #10b981',
          animation: 'pulse 1.8s infinite'
        }} />
        <span>Complejos <strong>Terjamanco 1, 2 y Mirador</strong> operando con normalidad hoy.</span>
      </div>
    </div>
  );
}
