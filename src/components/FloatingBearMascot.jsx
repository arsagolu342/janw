import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  CalendarCheck, 
  MapPin, 
  MessageCircle, 
  X, 
  Compass,
  Heart
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function FloatingBearMascot({ onOpenBookingModal }) {
  const { info } = useSiteData();
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  const tips = [
    { text: "¡Hola! Soy Jamanquito 🐻♨️ ¡El agua está a 40°C!", badge: "37° - 44°C" },
    { text: "¿Planeando tu viaje? ¡Estamos a 1h de Quito!", badge: "Vía Pifo" },
    { text: "¡Pase Nocturno hasta las 23:00 en Terjamanco 2! 🌙", badge: "Pool Party" },
    { text: "¡Toca aquí para reservar tu entrada o cabaña! 📅", badge: "Reserva Fácil" },
    { text: "¡Aguas 100% medicinales y naturales del páramo! 🌿", badge: "Salud & Relax" }
  ];

  // Rotate bubble messages every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowBubble(false);
      setTimeout(() => {
        setBubbleIndex((prev) => (prev + 1) % tips.length);
        setShowBubble(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [tips.length]);

  // Trigger wave animation occasionally
  const triggerWave = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1200);
  };

  const handleMascotClick = () => {
    triggerWave();
    setIsMenuOpen(prev => !prev);
  };

  return (
    <div 
      className="floating-mascot-container"
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 89,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none'
      }}
    >
      {/* Interactive Speech Bubble */}
      {showBubble && !isMenuOpen && (
        <div 
          className="mascot-speech-bubble"
          onClick={() => {
            setIsMenuOpen(true);
            triggerWave();
          }}
          style={{
            pointerEvents: 'auto',
            marginBottom: '0.6rem',
            background: 'rgba(3, 43, 61, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(56, 189, 248, 0.55)',
            borderRadius: '16px 16px 4px 16px',
            padding: '0.75rem 1.1rem',
            maxWidth: '240px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.35)',
            cursor: 'pointer',
            animation: 'mascotBubblePop 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}
        >
          {/* Close mini button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBubble(false);
            }}
            style={{
              position: 'absolute',
              top: '4px',
              right: '6px',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Ocultar mensaje"
          >
            <X size={12} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '800',
              padding: '0.15rem 0.45rem',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              textTransform: 'uppercase'
            }}>
              {tips[bubbleIndex].badge}
            </span>
            <Sparkles size={12} color="#fbbf24" />
          </div>

          <p style={{
            margin: 0,
            fontSize: '0.82rem',
            color: '#ffffff',
            fontWeight: '600',
            lineHeight: 1.35
          }}>
            {tips[bubbleIndex].text}
          </p>
        </div>
      )}

      {/* Quick Menu Popover when clicked */}
      {isMenuOpen && (
        <div 
          className="mascot-quick-menu"
          style={{
            pointerEvents: 'auto',
            marginBottom: '0.75rem',
            background: 'var(--bg-secondary, #071c26)',
            border: '1px solid var(--border-glass-hover, rgba(0, 180, 216, 0.45))',
            borderRadius: 'var(--radius-lg, 18px)',
            padding: '1.25rem',
            width: '270px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
            animation: 'drawerSlideDown 0.25s ease-out forwards'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🐻</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Jamanquito
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
                  Mascota Oficial de Jamanco
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: 'var(--text-secondary)',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (onOpenBookingModal) onOpenBookingModal();
              }}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '0.6rem' }}
            >
              <CalendarCheck size={16} />
              <span>Reservar Entrada / Cabaña</span>
            </button>

            <a
              href="#sedes"
              onClick={() => setIsMenuOpen(false)}
              className="btn btn-outline btn-sm"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '0.6rem' }}
            >
              <Compass size={16} />
              <span>Conocer las 3 Sedes</span>
            </a>

            <a
              href={`https://wa.me/${info?.whatsapp || '593981385981'}?text=Hola%20Jamanquito,%20deseo%20información%20de%20las%20termas`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold btn-sm"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '0.6rem' }}
            >
              <MessageCircle size={16} />
              <span>Preguntar por WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Animated Bear Mascot Button */}
      <div 
        className={`floating-bear-badge ${isHovered ? 'hovered' : ''} ${isWaving ? 'waving' : ''}`}
        onClick={handleMascotClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Jamanquito - Mascota Oficial de Termales Jamanco"
        style={{
          pointerEvents: 'auto',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #034b5e 0%, #0077b6 50%, #0096c7 100%)',
          border: '3px solid #38bdf8',
          boxShadow: '0 8px 28px rgba(0, 150, 199, 0.5), 0 0 20px rgba(56, 189, 248, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Animated Hot Springs Water Ripples Inside the Badge */}
        <div className="mascot-water-ripple" />
        <div className="mascot-water-ripple-2" />

        {/* Hot Spring Steam rising from the mascot */}
        <div className="mascot-steam" />

        {/* Real Andean Bear (Osito) in water */}
        <img 
          src="/images/osito_jamanco.png" 
          alt="Osito de Anteojos Termales Jamanco"
          style={{
            width: '84%',
            height: '84%',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 2,
            filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.45))',
            transition: 'transform 0.3s ease'
          }}
          className="mascot-bear-img"
        />

        {/* Temperature Badge floating on top */}
        <span style={{
          position: 'absolute',
          bottom: '2px',
          right: '2px',
          background: 'linear-gradient(135deg, #ffb703, #fb8500)',
          color: '#ffffff',
          fontSize: '0.55rem',
          fontWeight: '900',
          padding: '1px 5px',
          borderRadius: '999px',
          zIndex: 3,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}>
          40°C
        </span>
      </div>
    </div>
  );
}
