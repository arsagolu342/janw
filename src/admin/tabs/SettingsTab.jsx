import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  ShieldAlert,
  FileText,
  Flame,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Database,
  ExternalLink,
  Code2
} from 'lucide-react';
import { apiChangePassword, apiRestoreBackup, apiGetFirebaseStatus, apiSyncFirebase } from '../../services/api';
import { useSiteData } from '../../context/SiteDataContext';

export default function SettingsTab() {
  const {
    resetToDefaults,
    refreshData,
    isFirebaseOnline,
    isFirebaseActive,
    syncAllToFirebase,
    saveAndApplyFirebaseConfig,
    testFirebaseConnection,
    getStoredFirebaseConfig
  } = useSiteData();

  // Estados de cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('admin');
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [changingPass, setChangingPass] = useState(false);

  // Estados de backup y reset
  const [systemFeedback, setSystemFeedback] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  // Estado del servidor backend y Firebase Admin
  const [serverFirebaseStatus, setServerFirebaseStatus] = useState(null);

  // Estados de Firebase Cloud
  const [firebaseForm, setFirebaseForm] = useState({
    apiKey: '',
    authDomain: '',
    projectId: 'terjamancoweb',
    storageBucket: 'terjamancoweb.firebasestorage.app',
    messagingSenderId: '',
    appId: ''
  });
  const [rawConfigInput, setRawConfigInput] = useState('');
  const [showRawConfig, setShowRawConfig] = useState(false);
  const [firebaseFeedback, setFirebaseFeedback] = useState(null);
  const [isTestingFb, setIsTestingFb] = useState(false);
  const [isSyncingFb, setIsSyncingFb] = useState(false);
  const [isSavingFb, setIsSavingFb] = useState(false);

  // Cargar estado de Firebase Admin y config actual
  useEffect(() => {
    apiGetFirebaseStatus().then((res) => {
      setServerFirebaseStatus(res);
    }).catch(() => {});

    const currentFb = getStoredFirebaseConfig();
    if (currentFb) {
      setFirebaseForm({
        apiKey: currentFb.apiKey || '',
        authDomain: currentFb.authDomain || '',
        projectId: currentFb.projectId || 'terjamancoweb',
        storageBucket: currentFb.storageBucket || 'terjamancoweb.firebasestorage.app',
        messagingSenderId: currentFb.messagingSenderId || '',
        appId: currentFb.appId || ''
      });
    }
  }, [getStoredFirebaseConfig]);

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

  // Helper para parsear objeto o bloque JS pegado desde la consola de Firebase
  const handleParseRawConfig = () => {
    if (!rawConfigInput.trim()) return;
    try {
      let cleaned = rawConfigInput.trim();
      // Limpiar prefijo const firebaseConfig = ...
      if (cleaned.includes('firebaseConfig')) {
        cleaned = cleaned.substring(cleaned.indexOf('{'), cleaned.lastIndexOf('}') + 1);
      }
      // Reemplazar claves sin comillas por claves con comillas si es objeto JS
      const parsed = Function(`'use strict'; return (${cleaned})`)();
      if (parsed && typeof parsed === 'object') {
        setFirebaseForm({
          apiKey: parsed.apiKey || '',
          authDomain: parsed.authDomain || '',
          projectId: parsed.projectId || '',
          storageBucket: parsed.storageBucket || '',
          messagingSenderId: parsed.messagingSenderId || '',
          appId: parsed.appId || ''
        });
        setFirebaseFeedback({ type: 'success', text: '¡Configuración pegada y procesada correctamente!' });
        setTimeout(() => setFirebaseFeedback(null), 3000);
      }
    } catch (err) {
      setFirebaseFeedback({ type: 'error', text: 'No se pudo interpretar el formato. Verifica los campos o ingresa manualmente.' });
    }
  };

  // Probar conexión a Firebase
  const handleTestFirebase = async () => {
    if (!firebaseForm.apiKey || !firebaseForm.projectId) {
      setFirebaseFeedback({ type: 'error', text: 'Debes ingresar al menos el apiKey y el projectId.' });
      return;
    }
    setIsTestingFb(true);
    setFirebaseFeedback(null);
    try {
      const res = await testFirebaseConnection(firebaseForm);
      if (res.success) {
        setFirebaseFeedback({ type: 'success', text: '🟢 ¡Conexión con Firebase Firestore verificada con éxito!' });
      } else {
        setFirebaseFeedback({ type: 'error', text: `🔴 Fallo de conexión: ${res.message}` });
      }
    } catch (err) {
      setFirebaseFeedback({ type: 'error', text: `Error probando conexión: ${err.message}` });
    } finally {
      setIsTestingFb(false);
    }
  };

  // Guardar configuración de Firebase
  const handleSaveFirebaseConfig = async (e) => {
    e.preventDefault();
    setIsSavingFb(true);
    setFirebaseFeedback(null);
    try {
      const ok = await saveAndApplyFirebaseConfig(firebaseForm);
      if (ok) {
        setFirebaseFeedback({ type: 'success', text: '🔥 ¡Firebase conectado y activo! Todos los cambios ahora se sincronizan en la nube.' });
      } else {
        setFirebaseFeedback({ type: 'error', text: 'No se pudo inicializar Firebase con los datos proporcionados.' });
      }
    } catch (err) {
      setFirebaseFeedback({ type: 'error', text: err.message || 'Error guardando configuración' });
    } finally {
      setIsSavingFb(false);
    }
  };

  // Sincronizar todos los datos actuales a la nube de Firebase
  const handleSyncToFirebase = async () => {
    setIsSyncingFb(true);
    setFirebaseFeedback(null);
    try {
      await syncAllToFirebase();
      setFirebaseFeedback({ type: 'success', text: '🚀 ¡Todos los datos actuales (servicios, fotos, precios, FAQs) fueron subidos y sincronizados en Firebase Firestore!' });
      setTimeout(() => setFirebaseFeedback(null), 5000);
    } catch (err) {
      setFirebaseFeedback({ type: 'error', text: err.message || 'Error al subir datos a Firebase' });
    } finally {
      setIsSyncingFb(false);
    }
  };

  // Desconectar Firebase
  const handleDisconnectFirebase = async () => {
    if (window.confirm('¿Deseas desconectar Firebase de este navegador?')) {
      await saveAndApplyFirebaseConfig(null);
      setFirebaseForm({
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
      });
      setFirebaseFeedback({ type: 'info', text: 'Firebase desconectado. El sistema funcionará en modo local.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Configuración del Sistema & Conexión Cloud
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Conecta Firebase para sincronizar datos e imágenes en la nube en tiempo real para todos los dispositivos y administra las credenciales.
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

      {/* BLOQUE DESTACADO: CONEXIÓN FIREBASE CLOUD */}
      <div className="glass-card" style={{
        padding: '1.75rem',
        border: isFirebaseOnline ? '1.5px solid rgba(16, 185, 129, 0.45)' : '1.5px solid rgba(245, 158, 11, 0.45)',
        background: isFirebaseOnline ? 'rgba(16, 185, 129, 0.04)' : 'rgba(245, 158, 11, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <Flame size={24} color="#f59e0b" />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                Conexión Cloud con Google Firebase (Firestore + Storage)
              </h3>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '750px' }}>
              Al conectar Firebase, todas las fotos, precios, reservas y contenidos se guardan en la nube global de Google. Cualquier usuario o dispositivo en el mundo verá los cambios al instante.
            </p>
          </div>

          {/* Badge de Estado */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.95rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '700',
            background: isFirebaseOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            border: `1px solid ${isFirebaseOnline ? '#10b981' : '#f59e0b'}`,
            color: isFirebaseOnline ? '#34d399' : '#fbbf24'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isFirebaseOnline ? '#10b981' : '#f59e0b',
              boxShadow: isFirebaseOnline ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
            }} />
            {isFirebaseOnline || serverFirebaseStatus?.connected ? '🟢 Firebase Cloud Sincronizado 100%' : '🟡 Modo Local (Sin Conexión Cloud)'}
          </div>
        </div>

        {/* Info del Proyecto de Firebase Configurado */}
        <div style={{
          background: 'rgba(6, 17, 24, 0.75)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              🔥 Proyecto Activo: <span style={{ color: '#34d399', fontFamily: 'monospace' }}>terjamancoweb</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
              Cuenta de Servicio: <span style={{ fontFamily: 'monospace' }}>firebase-adminsdk-fbsvc@terjamancoweb.iam.gserviceaccount.com</span>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Colección Firestore: <code style={{ color: 'var(--accent-teal)' }}>terjamanco_site / main_content</code> • Conexión en vivo con el público activa.
          </div>
          <div style={{ marginTop: '0.35rem' }}>
            <button
              type="button"
              onClick={handleSyncToFirebase}
              disabled={isSyncingFb}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
            >
              <Database size={15} />
              {isSyncingFb ? 'Sincronizando con Google Cloud...' : '🚀 Sincronizar Todos los Datos a Firestore Ahora'}
            </button>
          </div>
        </div>

        {firebaseFeedback && (
          <div style={{
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            background: firebaseFeedback.type === 'success' 
              ? 'rgba(16, 185, 129, 0.2)' 
              : firebaseFeedback.type === 'info'
              ? 'rgba(6, 182, 212, 0.2)'
              : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${
              firebaseFeedback.type === 'success' ? '#10b981' : firebaseFeedback.type === 'info' ? '#06b6d4' : '#ef4444'
            }`,
            color: firebaseFeedback.type === 'success' ? '#34d399' : firebaseFeedback.type === 'info' ? '#38bdf8' : '#f87171',
            fontSize: '0.88rem',
            fontWeight: '600'
          }}>
            {firebaseFeedback.text}
          </div>
        )}

        {/* Pegar Configuración Rápida */}
        <div style={{ marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setShowRawConfig(!showRawConfig)}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
          >
            <Code2 size={15} />
            {showRawConfig ? 'Ocultar importador rápido' : '⚡ Pegar objeto de configuración de Firebase directo'}
          </button>

          {showRawConfig && (
            <div style={{ marginTop: '0.75rem', background: 'rgba(6, 17, 24, 0.7)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>
                Pega el bloque <code>const firebaseConfig = &#123; ... &#125;;</code> obtenido de la consola de Firebase:
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "jamanco-web.firebaseapp.com",\n  projectId: "jamanco-web",\n  storageBucket: "jamanco-web.firebasestorage.app",\n  messagingSenderId: "...",\n  appId: "..."\n};`}
                value={rawConfigInput}
                onChange={(e) => setRawConfigInput(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
              />
              <button
                type="button"
                onClick={handleParseRawConfig}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                Cargar y Llenar Campos
              </button>
            </div>
          )}
        </div>

        {/* Formulario de Campos de Firebase */}
        <form onSubmit={handleSaveFirebaseConfig}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">API Key (apiKey) *</label>
              <input
                type="text"
                className="form-control"
                placeholder="AIzaSy..."
                value={firebaseForm.apiKey}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, apiKey: e.target.value.trim() })}
                required
              />
            </div>

            <div>
              <label className="form-label">Project ID (projectId) *</label>
              <input
                type="text"
                className="form-control"
                placeholder="terjamanco-app"
                value={firebaseForm.projectId}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, projectId: e.target.value.trim() })}
                required
              />
            </div>

            <div>
              <label className="form-label">Storage Bucket (storageBucket)</label>
              <input
                type="text"
                className="form-control"
                placeholder="terjamanco-app.firebasestorage.app"
                value={firebaseForm.storageBucket}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, storageBucket: e.target.value.trim() })}
              />
            </div>

            <div>
              <label className="form-label">Auth Domain (authDomain)</label>
              <input
                type="text"
                className="form-control"
                placeholder="terjamanco-app.firebaseapp.com"
                value={firebaseForm.authDomain}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, authDomain: e.target.value.trim() })}
              />
            </div>

            <div>
              <label className="form-label">Messaging Sender ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="1048291..."
                value={firebaseForm.messagingSenderId}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, messagingSenderId: e.target.value.trim() })}
              />
            </div>

            <div>
              <label className="form-label">App ID (appId)</label>
              <input
                type="text"
                className="form-control"
                placeholder="1:1048291:web:..."
                value={firebaseForm.appId}
                onChange={(e) => setFirebaseForm({ ...firebaseForm, appId: e.target.value.trim() })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="submit"
              disabled={isSavingFb}
              className="btn btn-primary btn-md"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={18} />
              {isSavingFb ? 'Conectando...' : 'Guardar y Conectar Firebase'}
            </button>

            <button
              type="button"
              onClick={handleTestFirebase}
              disabled={isTestingFb}
              className="btn btn-outline btn-md"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={17} className={isTestingFb ? 'spin-animation' : ''} />
              {isTestingFb ? 'Probando...' : 'Probar Conexión'}
            </button>

            {isFirebaseOnline && (
              <button
                type="button"
                onClick={handleSyncToFirebase}
                disabled={isSyncingFb}
                className="btn btn-secondary btn-md"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Database size={17} />
                {isSyncingFb ? 'Subiendo datos a la nube...' : '🚀 Subir y Sincronizar Datos Actuales en Firebase'}
              </button>
            )}

            {isFirebaseOnline && (
              <button
                type="button"
                onClick={handleDisconnectFirebase}
                className="btn btn-outline btn-md"
                style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
              >
                Desconectar
              </button>
            )}
          </div>
        </form>

        {/* Guía rápida */}
        <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(6, 17, 24, 0.6)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          💡 <strong>¿No tienes proyecto de Firebase?</strong> Ve a <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-teal)', textDecoration: 'underline' }}>console.firebase.google.com</a>, crea un proyecto gratis, activa <strong>Cloud Firestore</strong> (en modo producción o test) y <strong>Storage</strong>, crea una app Web y copia las credenciales aquí.
        </div>
      </div>

      {/* Bloque 2: Cambio de Contraseña */}
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

      {/* Bloque 3: Copia de Seguridad */}
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

      {/* Bloque 4: Restauración de Fábrica */}
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
