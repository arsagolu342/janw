import React from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Facebook, 
  ExternalLink,
  Lock,
  Mail
} from 'lucide-react';
import Logo from './Logo';
import { TERJAMANCO_INFO as DEFAULT_INFO } from '../data/terjamancoData';
import { useSiteData } from '../context/SiteDataContext';

export default function Footer({ onOpenBookingModal, onOpenAdmin }) {
  const { info } = useSiteData();
  const currentInfo = info || DEFAULT_INFO;

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-glass)',
      padding: '5rem 0 2rem 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <Logo size={42} />
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              El complejo turístico y de aguas termales más emblemático de Papallacta. Piscinas calientes, mirador con columpio extremo, pesca deportiva, hospedaje y restaurante.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a 
                href={currentInfo.facebookUrl} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'; }}
              >
                <Facebook size={16} />
                <span>{currentInfo.facebookHandle || '@Terjamancoo'}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Sede 1 & 2 info */}
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--accent-teal)" />
              Horarios & Sedes
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Terjamanco 1:</strong><br/>
                {currentInfo.hours1 || '06:00 AM - 19:30 PM (Diario)'}
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Terjamanco 2:</strong><br/>
                {currentInfo.hours2 || '06:00 AM - 23:00 PM (Pase Nocturno)'}
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>El Mirador Jamanco:</strong><br/>
                {currentInfo.hoursMirador || '06:00 AM - 17:00 PM (Fines de semana)'}
              </li>
            </ul>
          </div>

          {/* Location & Phone */}
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--accent-cyan)" />
              Contacto & Ubicación
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Dirección:</strong><br/>
                {currentInfo.address}
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>WhatsApp / Reservas:</strong><br/>
                <a href={`https://wa.me/${currentInfo.whatsapp}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-teal)', textDecoration: 'none', fontWeight: '600' }}>
                  {currentInfo.phone}
                </a>
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Email:</strong><br/>
                <a href={`mailto:${currentInfo.email}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  {currentInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Admin button */}
        <div style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} {currentInfo.name} ({currentInfo.alias}). Todos los derechos reservados.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Papallacta, Ecuador</span>
            <button
              onClick={onOpenAdmin}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-glass)',
                color: 'var(--accent-teal)',
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Lock size={12} /> Panel Admin (CMS)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
