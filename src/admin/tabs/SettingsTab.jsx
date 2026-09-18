import React, { useState } from 'react';
import { KeyRound, Download, Upload, RotateCcw, Check, AlertCircle, ShieldAlert, FileText } from 'lucide-react';
import { apiChangePassword, apiRestoreBackup } from '../../services/api';
import { useSiteData } from '../../context/SiteDataContext';

export default function SettingsTab() {
  const { resetToDefaults, refreshData } = useSiteData();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('admin');
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [changingPass, setChangingPass] = useState(false);

  const [systemFeedback, setSystemFeedback] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPass(true);
    setPasswordFeedback(null);
    try {
      await apiChangePassword(currentPassword, newPassword, newUsername);
      setPasswordFeedback({ type: 'success', text: '¡Credenciales actualizadas exitosamente!' });
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordFeedback(null), 3500);
    } catch (err) {
      setPasswordFeedback({ type: 'error', text: err.message || 'Error al actualizar credenciales' });
    } finally {
      setChangingPass(false);
    }
  };

  const handleDownloadBackup = () => {
    window.open('/api/data/backup', '_blank');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        await apiRestoreBackup(json);
        await refreshData();
        setSystemFeedback({ type: 'success', text: '¡Copia de seguridad restaurada exitosamente!' });
        setTimeout(() => setSystemFeedback(null), 3500);
      } catch (err) {
        setSystemFeedback({ type: 'error', text: 'Error al importar: archivo JSON inválido' });
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = async () => {
    if (window.confirm('⚠️ ¿Estás seguro de que deseas restaurar todos los textos y datos de Termales Jamanco a sus valores originales de fábrica?')) {
      setIsResetting(true);
      setSystemFeedback(null);
      try {
        await resetToDefaults();
        setSystemFeedback({ type: 'success', text: '¡Sistema restaurado a valores de fábrica!' });
        setTimeout(() => setSystemFeedback(null), 3500);
      } catch (err) {
        setSystemFeedback({ type: 'error', text: err.message || 'Error al restaurar' });
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Configuración del Sistema & Seguridad
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Administra las credenciales de acceso, copias de seguridad de la base de datos y opciones avanzadas.
        </p>
      </div>

      {systemFeedback && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: systemFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${systemFeedback.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: systemFeedback.type === 'success' ? '#34d399' : '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '600',
          fontSize: '0.9rem'
        }}>
          {systemFeedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {systemFeedback.text}
        </div>
      )}

      {/* Bloque 1: Cambio de Contraseña */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <KeyRound size={18} color="var(--accent-teal)" />
          Cambiar Credenciales de Acceso Administrativo
        </h3>

        {passwordFeedback && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            background: passwordFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${passwordFeedback.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: passwordFeedback.type === 'success' ? '#34d399' : '#f87171',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            {passwordFeedback.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Nombre de Usuario</label>
            <input
              type="text"
              className="form-control"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Contraseña Actual</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Contraseña actual"
              required
            />
          </div>

          <div>
            <label className="form-label">Nueva Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 4 caracteres"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={changingPass}
              className="btn btn-primary btn-md"
              style={{ width: '100%' }}
            >
              {changingPass ? 'Actualizando...' : 'Actualizar Credenciales'}
            </button>
          </div>
        </form>
      </div>

      {/* Bloque 2: Copia de Seguridad */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} color="var(--accent-cyan)" />
          Copias de Seguridad (Backup & Restore)
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Descarga una copia completa de todos los textos, servicios, productos, precios y configuración en formato JSON para respaldar tus datos.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="btn btn-outline btn-md"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={18} />
            Descargar Respaldo JSON
          </button>

          <label className="btn btn-outline btn-md" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
            <Upload size={18} />
            Restaurar desde Respaldo JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Bloque 3: Restauración de Fábrica */}
      <div className="glass-card" style={{ padding: '1.75rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#f87171', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} color="#f87171" />
          Zona de Peligro: Restauración a Valores de Fábrica
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Esta acción restablecerá todos los textos, servicios, zonas, precios y FAQs a los datos oficiales iniciales de Termales Jamanco.
        </p>

        <button
          type="button"
          onClick={handleFactoryReset}
          disabled={isResetting}
          className="btn btn-danger btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RotateCcw size={18} />
          {isResetting ? 'Restaurando...' : 'Restablecer Todo a Valores de Fábrica'}
        </button>
      </div>
    </div>
  );
}
