import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  HeartHandshake, 
  Droplet, 
  Activity, 
  Smile, 
  CheckCircle2,
  Flame,
  Award,
  HeartPulse
} from 'lucide-react';
import { MINERALS_DATA as DEFAULT_MINERALS } from '../data/terjamancoData';
import { useSiteData } from '../context/SiteDataContext';
import ThermalMovementBackground from './ThermalMovementBackground';

const iconMap = {
  Sparkles: Sparkles,
  Zap: Zap,
  ShieldCheck: ShieldCheck,
  HeartHandshake: HeartHandshake
};

export default function ThermalBenefits() {
  const { minerals } = useSiteData();
  const currentMinerals = minerals && minerals.length > 0 ? minerals : DEFAULT_MINERALS;
  const [selectedMineral, setSelectedMineral] = useState(currentMinerals[0] || DEFAULT_MINERALS[0]);

  const generalBenefits = [
    {
      title: "Alivio Muscular & Espalda",
      desc: "El calor geotérmico relaja fibras musculares tensas y contracturas.",
      icon: Activity,
      color: "#0d9488"
    },
    {
      title: "Regeneración de la Piel",
      desc: "Azufre y silicio orgánico combaten afecciones dérmicas y nutren con colágeno.",
      icon: Droplet,
      color: "#0284c7"
    },
    {
      title: "Reducción del Estrés",
      desc: "Disminuye el cortisol y activa endorfinas que brindan calma y paz mental.",
      icon: Smile,
      color: "#f59e0b"
    },
    {
      title: "Circulación Sanguínea",
      desc: "La vasodilatación térmica optimiza el flujo de oxígeno celular en todo el cuerpo.",
      icon: HeartHandshake,
      color: "#8b5cf6"
    }
  ];

  return (
    <section id="beneficios" style={{ padding: '5rem 0', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
      {/* Live Particle Movement */}
      <ThermalMovementBackground opacity={0.3} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Master Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">Poder Curativo & Secreto Mineral</span>
          <h2 className="section-title">El Secreto Mineral</h2>
          <p className="section-description">
            Nuestras aguas brotan de las entrañas volcánicas andinas cargadas de minerales terapéuticos que restauran tu cuerpo, alivian el estrés y renuevan tu piel en cada sesión.
          </p>
        </div>

        {/* Unified Master Card Container */}
        <div className="glass-card" style={{
          padding: '2.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-glass)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}>
          {/* Top Half: 2-Column Interactive Showcase (Image + Minerals 2x2 Grid) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch'
          }}>
            {/* Left Side: Photo with Balneotherapy Badge & Wellness Stats */}
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              minHeight: '360px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              background: '#041d27'
            }}>
             

              {/* Dark gradient overlay for text legibility */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(3, 18, 26, 0.95) 0%, rgba(3, 18, 26, 0.3) 50%, transparent 100%)'
              }} />

              {/* Top floating badge */}
              <div style={{
                position: 'absolute',
                top: '1.25rem',
                left: '1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(6, 17, 24, 0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(45, 212, 191, 0.5)',
                color: '#5eead4',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}>
                <Award size={16} />
                Certificación Balneoterapéutica
              </div>

              {/* Bottom Info Glass Pill */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                margin: '1.25rem',
                background: 'rgba(3, 22, 33, 0.88)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '1rem 1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: '700', fontSize: '0.92rem', marginBottom: '0.25rem' }}>
                  <HeartPulse size={18} color="#38bdf8" />
                  ¿Por qué tu cuerpo lo necesita?
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Aguas 100% analizadas y avaladas para recuperación física, alivio de dolores articulares y relajación anti-estrés.
                </p>
              </div>
            </div>

            {/* Right Side: 4 Minerals in 2x2 Clean Responsive Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  4 Componentes Minerales Volcánicos
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Toca para explorar
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.85rem',
                flex: 1
              }}>
                {currentMinerals.map((mineral, idx) => {
                  const IconComp = iconMap[mineral.icon] || Sparkles;
                  const isSelected = selectedMineral?.id === mineral.id;

                  return (
                    <div
                      key={mineral.id}
                      onClick={() => setSelectedMineral(mineral)}
                      style={{
                        padding: '1.15rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        border: isSelected ? `1.5px solid ${mineral.color}` : '1px solid var(--border-glass)',
                        background: isSelected 
                          ? 'rgba(20, 184, 166, 0.14)' 
                          : 'var(--card-inner-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? `0 4px 20px ${mineral.color}30` : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: `${mineral.color}20`,
                          border: `1px solid ${mineral.color}50`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: mineral.color
                        }}>
                          <IconComp size={20} />
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.05rem',
                          fontWeight: '800',
                          color: mineral.color,
                          background: 'rgba(0,0,0,0.25)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          {mineral.symbol}
                        </span>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 0.2rem 0', fontWeight: '700' }}>
                          {mineral.name}
                        </h4>
                        <div style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          color: mineral.color,
                          textTransform: 'uppercase',
                          marginBottom: '0.35rem'
                        }}>
                          Nivel: {mineral.level}
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.45' }}>
                          {mineral.benefit}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Half: 4 Health Benefits in Horizontal Integrated Strip */}
          <div style={{
            borderTop: '1px solid var(--border-glass)',
            paddingTop: '2rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem'
            }}>
              {generalBenefits.map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div 
                    key={idx} 
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'var(--card-inner-bg)',
                      border: '1px solid var(--border-glass)'
                    }}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: `${item.color}18`,
                      border: `1px solid ${item.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      flexShrink: 0
                    }}>
                      <ItemIcon size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: '0 0 0.25rem 0', fontWeight: '700' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.45' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

