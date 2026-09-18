import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Calendar, ShoppingBag, X } from 'lucide-react';

const activities = [
  {
    icon: Calendar,
    color: '#0d9488',
    title: 'Nueva Reserva Confirmada',
    desc: 'Esteban P. de Quito reservó 2 Pases Nocturnos para Terjamanco 2',
    time: 'Hace 4 minutos'
  },
  {
    icon: Users,
    color: '#0284c7',
    title: 'Gran Afluencia en Papallacta',
    desc: '14 personas explorando El Mirador & Columpio Extremo en este momento',
    time: 'En tiempo real'
  },
  {
    icon: ShoppingBag,
    color: '#f59e0b',
    title: 'Pedido de Souvenirs',
    desc: 'Valeria M. adquirió el Combo Recuerdo Termales Jamanco con envío a Quito',
    time: 'Hace 12 minutos'
  },
  {
    icon: Sparkles,
    color: '#10b981',
    title: 'Consulta de Hospedaje',
    desc: 'Familia Salazar cotizó Cabaña Campestre para este fin de semana',
    time: 'Hace 18 minutos'
  }
];

export default function LiveActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = activities[currentIndex];
  const IconC = current.icon;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.75rem',
      left: '1.75rem',
      zIndex: 80,
      maxWidth: '360px',
      background: 'var(--modal-bg)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1rem',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.95)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      backdropFilter: 'blur(12px)'
    }}>
      {/* Icon Badge */}
      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        background: `${current.color}20`,
        border: `1px solid ${current.color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: current.color,
        flexShrink: 0
      }}>
        <IconC size={18} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: current.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {current.title}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {current.time}
          </span>
        </div>
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-primary)',
          fontWeight: '600',
          lineHeight: '1.3',
          marginTop: '0.15rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {current.desc}
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setIsDismissed(true)}
        title="Ocultar notificaciones"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '0.2rem',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
