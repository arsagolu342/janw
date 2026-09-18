import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function AdminLogin({ onBackToSite, onSuccess }) {
  const { loginAdmin } = useSiteData();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginAdmin(username, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'radial-gradient(circle at center, rgba(13, 148, 136, 0.15) 0%, var(--bg-primary) 70%)',
      position: 'relative'
    }}>
      {/* Botón Volver */}
      <button
        onClick={onBackToSite}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-glass)',
          color: 'var(--text-secondary)',
          padding: '0.6rem 1.2rem',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.88rem',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
      >
        <ArrowLeft size={16} /> Volver al Sitio Web
      </button>

      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)',
            border: '1px solid var(--accent-teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <Lock size={30} color="var(--accent-teal)" />
          </div>

          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '0.35rem' }}>
            Panel Administrativo
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Acceso seguro a la administración de Termales Jamanco
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#f87171',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Usuario Administrador</span>
            </label>
            <div className="input-icon-wrapper">
              <User size={18} className="input-icon-left" />
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuario de acceso"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Contraseña de Acceso</span>
            </label>
            <div className="input-icon-wrapper">
              <KeyRound size={18} className="input-icon-left" />
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
            </div>
          </div>

          <div style={{ background: 'var(--card-inner-bg)', border: '1px solid var(--border-glass)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            💡 Credencial por defecto: Usuario: <strong style={{ color: 'var(--accent-teal)' }}>admin</strong> | Contraseña: <strong style={{ color: 'var(--accent-teal)' }}>jamanco2025</strong>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
