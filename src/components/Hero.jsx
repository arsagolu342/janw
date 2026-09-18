import React from 'react';
import { 
  Flame, 
  Waves, 
  CalendarCheck, 
  ShoppingBag, 
  Star, 
  Compass, 
  MapPin, 
  Sparkles,
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';
import { TERJAMANCO_INFO } from '../data/terjamancoData';
import { useSiteData } from '../context/SiteDataContext';
import ThermalMovementBackground from './ThermalMovementBackground';

export default function Hero({ onOpenBookingModal }) {
  const { info, hero } = useSiteData();
  const currentInfo = info || TERJAMANCO_INFO;
  const currentHero = hero || {};

  return (
    <section 
      id="inicio" 
      className="hero-section"
    >
      {/* Background Image of Papallacta Thermal Springs with smooth cinematic Ken Burns animation */}
      <div 
        className="hero-bg-image"
        style={{
          backgroundImage: `url('${currentHero.bgImage || "/images/jamanco_hero_cinematic.jpg"}')`
        }} 
      />

      {/* Adaptive crystal aqua & solar glow gradient overlay */}
      <div className="hero-overlay" />

      {/* Water Shimmer & Sun Reflection Effect */}
      <div className="hero-water-shimmer" />

      {/* Live Movement Background Particles, Steam Clouds & Mist */}
      <ThermalMovementBackground opacity={0.7} />

      {/* Floating Animated Steam Particles */}
      <div className="steam-effect" style={{ top: '18%', left: '10%', animationDelay: '0s' }} />
      <div className="steam-effect" style={{ top: '30%', right: '12%', animationDelay: '2.5s' }} />
      <div className="steam-effect" style={{ bottom: '20%', left: '42%', animationDelay: '4s' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* Top Badges with vibrant contrast */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '1.75rem'
        }}>
          <span className="hero-badge-pill hero-badge-teal float-animated">
            <Flame size={15} color="#0096c7" />
            {currentHero.badge1 || `Aguas Termales Vírgenes ${currentInfo.waterTempRange || '37°C - 44°C'}`}
          </span>

          <span className="hero-badge-pill hero-badge-gold float-animated-reverse">
            <Star size={15} fill="#fb8500" color="#fb8500" />
            {currentHero.badge2 || `${currentInfo.name} • ${currentInfo.facebookHandle || '@Terjamancoo'}`}
          </span>

          <span className="hero-badge-pill hero-badge-cyan float-animated">
            <MapPin size={15} color="#0284c7" />
            {currentHero.badge3 || 'A 1h de Quito desde Pifo'}
          </span>
        </div>

        {/* Main Title - Radiant & vivid */}
        <h1 className="hero-title">
          {currentHero.titlePrefix || 'Descubre la Magia de '}
          <span className="hero-title-highlight">
            {currentHero.titleHighlight || currentInfo.name || 'Termales Jamanco'}
          </span>
          {currentHero.titleSuffix || ' en Papallacta'}
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          {currentHero.subtitle || (
            <>
              Sumérgete en nuestras piscinas termales naturales en <strong>Terjamanco 1 y 2</strong>, vive la adrenalina del <strong>Columpio Extremo en El Mirador</strong>, disfruta de la mejor trucha andina y hospédate en el corazón del páramo.
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <button 
            onClick={onOpenBookingModal}
            className="btn btn-primary btn-lg"
            style={{ minWidth: '220px' }}
          >
            <CalendarCheck size={20} />
            Reservar Entrada / Cabaña
          </button>

          <a 
            href="#sedes" 
            className="btn btn-outline btn-lg"
          >
            <Compass size={20} />
            Conocer las 3 Sedes
          </a>

          <a 
            href="#productos" 
            className="btn btn-gold btn-lg"
          >
            <ShoppingBag size={20} />
            Tienda & Souvenirs
          </a>
        </div>

        {/* Key Metrics Grid with micro-floating effect */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          maxWidth: '1080px',
          margin: '0 auto 3rem auto'
        }}>
          {/* Card 1 */}
          <div className="glass-card float-animated" style={{ padding: '1.4rem 1rem', textAlign: 'center', animationDelay: '0s' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              fontFamily: 'var(--font-display)',
              color: 'var(--accent-cyan)',
              marginBottom: '0.2rem'
            }}>
              37° - 44°C
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '700', marginBottom: '0.2rem' }}>
              Aguas Geotermales
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              100% medicinales y relajantes
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card float-animated" style={{ padding: '1.4rem 1rem', textAlign: 'center', animationDelay: '0.4s' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              fontFamily: 'var(--font-display)',
              color: 'var(--accent-emerald)',
              marginBottom: '0.2rem'
            }}>
              3 Zonas
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '700', marginBottom: '0.2rem' }}>
              Terjamanco 1, 2 & Mirador
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Termas, pool parties y aventura
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card float-animated" style={{ padding: '1.4rem 1rem', textAlign: 'center', animationDelay: '0.8s' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              fontFamily: 'var(--font-display)',
              color: 'var(--accent-amber)',
              marginBottom: '0.2rem'
            }}>
              Hasta 23:00
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '700', marginBottom: '0.2rem' }}>
              Pases Nocturnos
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Pozas calientes bajo las estrellas
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card float-animated" style={{ padding: '1.4rem 1rem', textAlign: 'center', animationDelay: '1.2s' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              fontFamily: 'var(--font-display)',
              color: '#8b5cf6',
              marginBottom: '0.2rem'
            }}>
              45 km
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '700', marginBottom: '0.2rem' }}>
              Cerca de Quito
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Vía asfaltada de fácil acceso
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
