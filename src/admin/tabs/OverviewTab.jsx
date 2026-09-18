import React from 'react';
import { 
  Waves, 
  ShoppingBag, 
  MapPin, 
  Camera, 
  HelpCircle, 
  Star, 
  Server, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

export default function OverviewTab({ onSelectTab, onExitAdmin }) {
  const { 
    info, 
    services, 
    products, 
    gallery, 
    reviews, 
    faqs, 
    zones, 
    isServerOnline, 
    lastSync 
  } = useSiteData();

  const stats = [
    { title: "Sedes Activas", count: zones.length, icon: MapPin, color: "#14b8a6", tab: "zones" },
    { title: "Servicios y Entradas", count: services.length, icon: Waves, color: "#06b6d4", tab: "services" },
    { title: "Productos en Tienda", count: products.length, icon: ShoppingBag, color: "#f59e0b", tab: "products" },
    { title: "Fotos en Galería", count: gallery.length, icon: Camera, color: "#8b5cf6", tab: "gallery" },
    { title: "Reseñas Sociales", count: reviews.length, icon: Star, color: "#ec4899", tab: "reviews" },
    { title: "Preguntas Frecuentes", count: faqs.length, icon: HelpCircle, color: "#10b981", tab: "faqs" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '2.5rem', 
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(6, 17, 24, 0.6) 100%)',
          border: '1px solid rgba(45, 212, 191, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{
              background: 'rgba(20, 184, 166, 0.25)',
              color: '#5eead4',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <ShieldCheck size={14} /> Panel Administrativo Oficial
            </span>
            <span style={{
              background: isServerOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: isServerOnline ? '#34d399' : '#f87171',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Server size={14} /> {isServerOnline ? 'Backend Conectado (Puerto 5000)' : 'Modo Offline / Local'}
            </span>
          </div>

          <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.4rem' }}>
            Bienvenido al Gestor de Contenidos de {info.name}
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
            Administra los textos del sitio web, sube nuevas fotos a la galería, modifica precios de entradas y productos, y mantén actualizada la información de Papallacta en tiempo real.
          </p>
        </div>

        <button
          onClick={onExitAdmin}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ExternalLink size={16} />
          Ver Sitio Web en Vivo
        </button>
      </div>

      {/* Grid de Métricas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card"
              onClick={() => onSelectTab(item.tab)}
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border-glass)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.3rem' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {item.count}
                </div>
              </div>

              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `rgba(${item.color === '#14b8a6' ? '20, 184, 166' : item.color === '#06b6d4' ? '6, 182, 212' : item.color === '#f59e0b' ? '245, 158, 11' : item.color === '#8b5cf6' ? '139, 92, 246' : item.color === '#ec4899' ? '236, 72, 153' : '16, 185, 129'}, 0.15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={24} color={item.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Accesos Rápidos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--accent-teal)" />
            Acciones Frecuentes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => onSelectTab('gallery')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1.2rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--card-inner-bg)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span>Subir nuevas fotos a la galería</span>
              <ArrowRight size={16} color="var(--accent-teal)" />
            </button>

            <button
              onClick={() => onSelectTab('services')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1.2rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--card-inner-bg)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span>Actualizar precios de entradas y pases</span>
              <ArrowRight size={16} color="var(--accent-teal)" />
            </button>

            <button
              onClick={() => onSelectTab('info')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1.2rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--card-inner-bg)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span>Cambiar Logotipo y Datos de la Empresa</span>
              <ArrowRight size={16} color="var(--accent-teal)" />
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            Estado de Datos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
              <span>Base de Datos:</span>
              <strong style={{ color: 'var(--text-primary)' }}>JSON Persistente (`db.json`)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
              <span>Servicio de Archivos:</span>
              <strong style={{ color: 'var(--text-primary)' }}>Multer Local (`/uploads`)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
              <span>Última Sincronización:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{lastSync ? lastSync.toLocaleTimeString() : 'Al cargar'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Teléfono Oficial:</span>
              <strong style={{ color: 'var(--accent-teal)' }}>{info.phone}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
