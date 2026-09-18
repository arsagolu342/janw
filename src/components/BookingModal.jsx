import React, { useState } from 'react';
import { 
  X, 
  CalendarCheck, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { TERJAMANCO_INFO } from '../data/terjamancoData';

export default function BookingModal({ isOpen, onClose, initialData }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    const randomCode = 'JAMANCO-' + Math.floor(100000 + Math.random() * 900000);
    setBookingCode(randomCode);
    setIsSubmitted(true);
  };

  const handleSendWhatsAppNotification = () => {
    const text = `*SOLICITUD DE RESERVA WEB - TERMALES JAMANCO*\n\n` +
      `*Código:* ${bookingCode}\n` +
      `*Nombre:* ${formData.fullName}\n` +
      `*Teléfono:* ${formData.phone}\n` +
      `*Email:* ${formData.email || 'No especificado'}\n` +
      (initialData ? `*Paquete:* ${initialData.packageName}\n*Fecha:* ${initialData.date}\n*Total Estimado:* $${initialData.grandTotal?.toFixed(2)} USD\n` : '') +
      `*Comentarios:* ${formData.notes || 'Ninguno'}\n\n` +
      `Hola Termales Jamanco, he registrado esta solicitud en su web. Deseo validar disponibilidad y cuenta para transferencia.`;

    window.open(`https://wa.me/${TERJAMANCO_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFormData({ fullName: '', phone: '', email: '', notes: '' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(20, 184, 166, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-teal)'
            }}>
              <CalendarCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-light)' }}>
                {isSubmitted ? '¡Solicitud Registrada!' : 'Reservar en Termales Jamanco'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isSubmitted ? 'Código generado con éxito' : 'Completa tus datos para agendar tu visita'}
              </span>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.3rem'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.75rem' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: '#10b981'
              }}>
                <CheckCircle2 size={38} />
              </div>

              <h4 style={{ fontSize: '1.4rem', color: 'var(--text-light)', marginBottom: '0.4rem' }}>
                ¡Gracias, {formData.fullName.split(' ')[0]}!
              </h4>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Hemos generado tu código de solicitud. Para asegurar tu ingreso o cabaña y recibir los datos de cuenta bancaria o pagos, finaliza el contacto por WhatsApp:
              </p>

              <div style={{
                background: 'rgba(20, 184, 166, 0.12)',
                border: '1px dashed var(--accent-teal)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.75rem'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Código de Solicitud
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-teal)', letterSpacing: '0.08em' }}>
                  {bookingCode}
                </div>
              </div>

              <button
                onClick={handleSendWhatsAppNotification}
                className="btn btn-primary"
                style={{ width: '100%', background: '#25d366', color: '#fff', fontSize: '1rem', marginBottom: '0.75rem' }}
              >
                Confirmar Solicitud en WhatsApp
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleResetAndClose}
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.9rem' }}
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {initialData && (
                <div style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '0.9rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.88rem'
                }}>
                  <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{initialData.packageName}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>Fecha: {initialData.date} | Total Estimado: ${initialData.grandTotal?.toFixed(2)} USD</div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Nombre y Apellidos *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="text"
                      required
                      placeholder="Ej. Sofía Paredes"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem 0.75rem 2.4rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        color: 'var(--input-text)',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Teléfono / WhatsApp *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="tel"
                      required
                      placeholder="Ej. 0981385981"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem 0.75rem 2.4rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        color: 'var(--input-text)',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Correo Electrónico (Opcional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem 0.75rem 2.4rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        color: 'var(--input-text)',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Comentarios o Peticiones Especiales (Opcional)
                  </label>
                  <textarea 
                    rows="2"
                    placeholder="Ej. Deseamos habitación matrimonial, consulta sobre horario nocturno..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.75rem', fontSize: '1rem' }}
              >
                Generar Código de Solicitud
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
