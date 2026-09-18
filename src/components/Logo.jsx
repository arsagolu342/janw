import React, { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { TERJAMANCO_INFO } from '../data/terjamancoData';

export default function Logo({ 
  size = 44, 
  showText = true, 
  customName, 
  customSubtext, 
  customLogoUrl, 
  customLogoType,
  style = {},
  className = ''
}) {
  let contextInfo = null;
  try {
    const siteData = useSiteData();
    contextInfo = siteData?.info;
  } catch {
    // Si se usa fuera del Provider, fallback a TERJAMANCO_INFO
    contextInfo = null;
  }

  const currentInfo = contextInfo || TERJAMANCO_INFO;
  const companyName = customName || currentInfo?.name || "Termales Jamanco";
  const subtext = customSubtext !== undefined ? customSubtext : (currentInfo?.logoSubtext || currentInfo?.alias || "Papallacta • Ecuador");
  const logoType = customLogoType || currentInfo?.logoType || (currentInfo?.logoUrl ? 'image' : 'emblem');
  const logoUrl = customLogoUrl !== undefined ? customLogoUrl : (currentInfo?.logoUrl || '');

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [logoUrl, logoType]);

  // Renderizador del Emblema Vectorial Original (Colibrí + Manantial Geotermal)
  const renderEmblem = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: 'drop-shadow(0 4px 14px rgba(20, 184, 166, 0.45))',
        flexShrink: 0,
        transition: 'transform 0.3s ease'
      }}
      className="brand-logo-svg"
      aria-label={`Emblema de ${companyName}`}
    >
      <defs>
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#034b5e" />
          <stop offset="50%" stopColor="#0077b6" />
          <stop offset="100%" stopColor="#0096c7" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe600" />
          <stop offset="50%" stopColor="#ffb703" />
          <stop offset="100%" stopColor="#fb8500" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00b4d8" />
          <stop offset="50%" stopColor="#0096c7" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* Circular Outer Badge with volcanic glow */}
      <circle cx="50" cy="50" r="48" fill="url(#logoBg)" stroke="#00b4d8" strokeWidth="2.5" />
      
      {/* Mountain Silhouette of Papallacta */}
      <path 
        d="M 12 70 L 36 38 L 52 56 L 68 32 L 88 70 Z" 
        fill="#062831" 
        opacity="0.9" 
      />
      <path 
        d="M 36 38 L 44 50 L 52 56 L 60 44 L 68 32 L 76 46" 
        stroke="#fef08a" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
      />

      {/* Rising Thermal Steam Waves */}
      <path 
        d="M 28 62 Q 38 52 48 62 T 68 62 T 82 62" 
        stroke="url(#waterGrad)" 
        strokeWidth="3.5" 
        fill="none" 
        strokeLinecap="round" 
      />
      <path 
        d="M 20 74 Q 35 64 50 74 T 80 74" 
        stroke="url(#waterGrad)" 
        strokeWidth="4" 
        fill="none" 
        strokeLinecap="round" 
      />

      {/* Colibrí (Hummingbird) Emblem in Flight */}
      <g transform="translate(18, 12) scale(0.65)">
        {/* Beak */}
        <path d="M 52 28 L 78 20" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Body */}
        <path d="M 50 28 C 42 22 34 32 36 44 C 38 54 48 60 52 52 C 54 44 54 34 50 28 Z" fill="url(#goldGrad)" />
        {/* Wings */}
        <path d="M 44 32 C 34 14 18 10 12 16 C 18 24 30 32 40 38 Z" fill="#2dd4bf" />
        <path d="M 40 36 C 30 20 16 22 14 30 C 22 36 32 40 38 42 Z" fill="#38bdf8" />
        {/* Tail */}
        <path d="M 40 48 L 22 66 L 32 54 L 20 72 L 36 56" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Eye */}
        <circle cx="48" cy="27" r="2" fill="#ffffff" />
      </g>

      {/* Hot Spring Drops */}
      <circle cx="78" cy="46" r="3" fill="#fef08a" />
      <circle cx="84" cy="54" r="2" fill="#38bdf8" />
    </svg>
  );

  // Renderizador de Imagen Personalizada
  const renderCustomImage = () => {
    if (!logoUrl || imageError) {
      return renderEmblem();
    }
    return (
      <div 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 4px 14px rgba(6, 182, 212, 0.25)',
          flexShrink: 0,
          padding: '2px',
          transition: 'transform 0.3s ease'
        }}
        className="brand-logo-img-wrapper"
      >
        <img 
          src={logoUrl} 
          alt={`Logotipo de ${companyName}`}
          onError={() => setImageError(true)}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>
    );
  };

  return (
    <div 
      className={`brand-logo-container ${className}`} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.85rem', 
        textDecoration: 'none',
        ...style 
      }}
    >
      {/* Visual Icon / Emblem or Uploaded Logo Image */}
      {logoType === 'image' && logoUrl ? renderCustomImage() : renderEmblem()}

      {/* Dynamic Typography with crisp contrast */}
      {showText && (
        <div className="brand-logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
          <span 
            className="brand-company-title"
            style={{
              fontFamily: 'var(--font-serif, "Cinzel", Georgia, serif)',
              fontSize: size > 40 ? '1.25rem' : '1.1rem',
              fontWeight: '800',
              color: 'var(--text-primary, #ffffff)',
              letterSpacing: '0.04em',
              lineHeight: 1.15,
              textTransform: 'uppercase',
              transition: 'color 0.2s ease'
            }}
          >
            {companyName}
          </span>
          {subtext && (
            <span 
              className="brand-company-subtext"
              style={{
                fontSize: '0.68rem',
                color: 'var(--accent-cyan, #0096c7)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: '700',
                lineHeight: 1.2
              }}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

