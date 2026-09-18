import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle, 
  ExternalLink, 
  Facebook 
} from 'lucide-react';
import { REVIEWS as DEFAULT_REVIEWS, TERJAMANCO_INFO } from '../data/terjamancoData';
import { useSiteData } from '../context/SiteDataContext';

export default function GalleryAndReviews() {
  const { gallery, reviews, info } = useSiteData();
  const currentReviews = reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
  const currentGallery = gallery && gallery.length > 0 ? gallery : [];
  const currentInfo = info || TERJAMANCO_INFO;
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <section id="galeria" style={{ padding: '6rem 0', background: 'var(--bg-primary)', position: 'relative' }}>
      <div className="container">
        {/* Section 1: Testimonials */}
        <div className="section-header">
          <span className="section-subtitle">Opiniones de Nuestros Visitantes</span>
          <h2 className="section-title">Comentarios en Facebook & Redes</h2>
          <p className="section-description">
            Descubre las experiencias y recomendaciones de familias y viajeros que visitan Termales Jamanco en Papallacta cada fin de semana.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {currentReviews.map((rev) => (
            <div 
              key={rev.id} 
              className="glass-card"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Rating & Quote Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                  <Facebook size={20} color="var(--accent-cyan)" />
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '1.75rem' }}>
                  "{rev.comment}"
                </p>
              </div>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                <img 
                  src={rev.avatar} 
                  alt={rev.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent-teal)'
                  }}
                />
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {rev.name}
                    <CheckCircle size={14} color="#10b981" />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {rev.role} • {rev.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Photo Gallery */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">Momentos Inolvidables</span>
          <h2 className="section-title">Galería de Fotos de Jamanco</h2>
          <p className="section-description">
            Imágenes de nuestras piscinas termales, el mirador extremo, lagunas, cabañas y la gastronomía de Papallacta.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem'
        }}>
          {currentGallery.map((img, i) => (
            <div
              key={i}
              onClick={() => setSelectedPhoto(img)}
              style={{
                position: 'relative',
                height: '260px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <img 
                src={img.url} 
                alt={img.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(6, 17, 24, 0.92) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#2dd4bf', textTransform: 'uppercase', fontWeight: '700' }}>
                  {img.category}
                </span>
                <h4 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: '600' }}>
                  {img.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Facebook Link Banner */}
        <div style={{
          textAlign: 'center',
          background: 'var(--card-inner-bg)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem'
        }}>
          <span style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600' }}>
            ¿Quieres ver más fotos, videos en vivo y promociones del fin de semana?
          </span>
          <a
            href={TERJAMANCO_INFO.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Facebook size={16} />
            Visitar Facebook @Terjamancoo
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
            <div 
              style={{
                position: 'relative',
                maxWidth: '850px',
                width: '100%',
                maxHeight: '85vh',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title}
                style={{ width: '100%', height: 'auto', maxHeight: '75vh', objectFit: 'contain', display: 'block', background: '#000' }}
              />
              <div style={{
                background: 'var(--modal-bg)',
                padding: '1.25rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-glass)'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: '700' }}>{selectedPhoto.category}</span>
                  <h4 style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>{selectedPhoto.title}</h4>
                </div>
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="btn btn-outline btn-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
