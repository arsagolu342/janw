import React, { useState } from 'react';
import { 
  ChevronDown, 
  MapPin, 
  Clock, 
  Car, 
  HelpCircle,
  Sparkles,
  Send
} from 'lucide-react';
import { FAQS as DEFAULT_FAQS, TERJAMANCO_INFO } from '../data/terjamancoData';
import { useSiteData } from '../context/SiteDataContext';

export default function FAQAndLocation() {
  const { faqs, info } = useSiteData();
  const currentFaqs = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;
  const currentInfo = info || TERJAMANCO_INFO;
  const [openIndex, setOpenIndex] = useState(0);
  const [contactMsg, setContactMsg] = useState({ name: '', phone: '', message: '' });
  const [msgSent, setMsgSent] = useState(false);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = `*CONSULTA DESDE LA WEB - TERMALES JAMANCO*\n\n` +
      `*Nombre:* ${contactMsg.name}\n` +
      `*Teléfono:* ${contactMsg.phone}\n` +
      `*Mensaje:* ${contactMsg.message}`;

    window.open(`https://wa.me/${currentInfo.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      setContactMsg({ name: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <section id="faq" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-subtitle">Resolvemos tus Dudas</span>
          <h2 className="section-title">Preguntas Frecuentes</h2>
          <p className="section-description">
            Todo lo que necesitas saber antes de planificar tu viaje a Termales Jamanco en Papallacta.
          </p>
        </div>

        <div style={{ maxWidth: '840px', margin: '0 auto 6rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="glass-card"
                style={{
                  border: isOpen ? '1px solid var(--accent-teal)' : '1px solid var(--border-glass)',
                  transition: 'all 0.25s ease'
                }}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '1rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <HelpCircle size={18} color="var(--accent-teal)" flexShrink={0} />
                    {faq.question}
                  </span>
                  <ChevronDown 
                    size={20} 
                    color="var(--text-muted)" 
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      flexShrink: 0
                    }} 
                  />
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 1.5rem 1.25rem 1.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.94rem',
                    lineHeight: '1.7',
                    borderTop: '1px solid var(--border-glass)',
                    paddingTop: '1rem',
                    whiteSpace: 'pre-line'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section 2: Location & Contact */}
        <div id="contacto" className="section-header" style={{ marginBottom: '3rem', scrollMarginTop: '100px' }}>
          <span className="section-subtitle">Ubicación Exacta & Horarios</span>
          <h2 className="section-title">Cómo Llegar a Termales Jamanco</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Card: Schedules and Route info */}
          <div className="glass-card" style={{ padding: '2.25rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              Horarios de Atención de Nuestras Sedes
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Horarios Oficiales</div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.5' }}>
                    • {currentInfo.hours1 || 'Terjamanco 1: 06:00 AM a 19:30 PM (Todos los días)'}<br/>
                    • {currentInfo.hours2 || 'Terjamanco 2: 06:00 AM a 23:00 PM (Pases nocturnos)'}<br/>
                    • {currentInfo.hoursMirador || 'El Mirador Jamanco: 06:00 AM a 17:00 PM (Fines de semana y feriados)'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Ruta desde Quito</div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.5' }}>
                    Tomas la Ruta Viva hacia Pifo y continúas por la vía asfaltada a Papallacta (45 km / 1 hora de viaje). Estamos ubicados a la entrada de Papallacta.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', flexShrink: 0 }}>
                  <Car size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Parqueadero y Seguridad</div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Parqueadero privado y gratuito para nuestros clientes en Terjamanco 1, 2 y Mirador.
                  </p>
                </div>
              </div>
            </div>

            <a 
              href="https://maps.google.com/?q=Termales+Jamanco+Papallacta"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              <MapPin size={18} />
              Abrir Ubicación en Google Maps
            </a>
          </div>

          {/* Quick Contact Form */}
          <div className="glass-card" style={{ padding: '2.25rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
              Contáctanos por WhatsApp Directo
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Escríbenos para consultar disponibilidad de hospedaje, eventos familiares o paquetes grupales.
            </p>

            {msgSent ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '12px',
                padding: '1.75rem',
                textAlign: 'center',
                color: '#10b981'
              }}>
                <Sparkles size={32} style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ color: 'var(--text-light)', marginBottom: '0.4rem' }}>¡Redirigiendo a WhatsApp!</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Se ha abierto tu chat con nuestro asesor oficial de Termales Jamanco.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Tu Nombre
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej. Carlos Paredes"
                    value={contactMsg.name}
                    onChange={(e) => setContactMsg({ ...contactMsg, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--input-text)',
                      outline: 'none',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Teléfono / WhatsApp
                  </label>
                  <input 
                    type="tel"
                    required
                    placeholder="Ej. 0981385981"
                    value={contactMsg.phone}
                    onChange={(e) => setContactMsg({ ...contactMsg, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--input-text)',
                      outline: 'none',
                      fontSize: '0.92rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Consulta o requerimiento
                  </label>
                  <textarea 
                    rows="3"
                    required
                    placeholder="Ej. Deseo reservar una cabaña para este sábado..."
                    value={contactMsg.message}
                    onChange={(e) => setContactMsg({ ...contactMsg, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--input-text)',
                      outline: 'none',
                      fontSize: '0.92rem',
                      resize: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem', background: '#25d366', color: '#fff' }}
                >
                  <Send size={16} />
                  Enviar Consulta a WhatsApp ({TERJAMANCO_INFO.phone})
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
