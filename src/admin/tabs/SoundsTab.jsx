import React, { useState, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Volume1, 
  Play, 
  Pause, 
  Waves, 
  Plus, 
  Check, 
  Trash2, 
  Music, 
  Sparkles, 
  Radio, 
  AlertCircle, 
  Sliders, 
  Layers,
  FileAudio
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import AudioUploader from '../components/AudioUploader';

export default function SoundsTab() {
  const { 
    soundSettings, 
    updateSoundSettings, 
    setActiveSoundTrack, 
    addSoundTrack, 
    deleteSoundTrack 
  } = useSiteData();

  // Estados locales para configuración general
  const [enabled, setEnabled] = useState(soundSettings?.enabled !== false);
  const [autoplayOnInteract, setAutoplayOnInteract] = useState(soundSettings?.autoplayOnInteract !== false);
  const [defaultVolume, setDefaultVolume] = useState(soundSettings?.defaultVolume || 0.4);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState(null);

  // Estados para formulario de nueva pista
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Agua Termal');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [addingTrack, setAddingTrack] = useState(false);
  const [trackFeedback, setTrackFeedback] = useState(null);

  // Estado de reproducción de preview en el admin
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const adminAudioRef = useRef(null);

  const tracks = soundSettings?.tracks || [];
  const activeTrackId = soundSettings?.activeTrackId || (tracks[0]?.id);

  // Guardar configuración global de sonido
  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsFeedback(null);
    try {
      await updateSoundSettings({
        enabled,
        autoplayOnInteract,
        defaultVolume
      });
      setSettingsFeedback({ type: 'success', text: '¡Configuración de sonido ambiental guardada!' });
      setTimeout(() => setSettingsFeedback(null), 3500);
    } catch (err) {
      setSettingsFeedback({ type: 'error', text: err.message || 'Error al guardar configuración' });
    } finally {
      setSavingSettings(false);
    }
  };

  // Cambiar la pista activa en el sitio
  const handleSetActive = async (trackId) => {
    try {
      await setActiveSoundTrack(trackId);
      setSettingsFeedback({ type: 'success', text: '¡Sonido activo cambiado! Ahora los visitantes escucharán esta pista.' });
      setTimeout(() => setSettingsFeedback(null), 3000);
    } catch (err) {
      setSettingsFeedback({ type: 'error', text: 'Error al cambiar sonido activo' });
    }
  };

  // Reproducir/Pausar pista en el admin
  const handleToggleAdminPlay = (track) => {
    if (playingTrackId === track.id) {
      if (adminAudioRef.current) adminAudioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(track.id);
      if (adminAudioRef.current) {
        adminAudioRef.current.src = track.url;
        adminAudioRef.current.volume = defaultVolume;
        adminAudioRef.current.play().catch(err => {
          console.error('Error reproduciendo en admin:', err);
          setPlayingTrackId(null);
        });
      }
    }
  };

  // Agregar nueva pista
  const handleCreateTrack = async (e) => {
    e.preventDefault();
    if (!newUrl) {
      setTrackFeedback({ type: 'error', text: 'Debes subir un archivo de audio o ingresar una URL' });
      return;
    }

    setAddingTrack(true);
    setTrackFeedback(null);
    try {
      await addSoundTrack({
        title: newTitle || 'Nuevo Sonido Relajante',
        category: newCategory || 'Agua Termal',
        url: newUrl,
        description: newDescription
      });

      setTrackFeedback({ type: 'success', text: '¡Nueva pista de sonido agregada a la biblioteca!' });
      setNewTitle('');
      setNewUrl('');
      setNewDescription('');
      setShowAddForm(false);
      setTimeout(() => setTrackFeedback(null), 3500);
    } catch (err) {
      setTrackFeedback({ type: 'error', text: err.message || 'Error al agregar la pista' });
    } finally {
      setAddingTrack(false);
    }
  };

  // Eliminar pista
  const handleDeleteTrack = async (trackId, trackTitle) => {
    if (window.confirm(`¿Estás seguro de eliminar el sonido "${trackTitle}"?`)) {
      try {
        if (playingTrackId === trackId && adminAudioRef.current) {
          adminAudioRef.current.pause();
          setPlayingTrackId(null);
        }
        await deleteSoundTrack(trackId);
        setSettingsFeedback({ type: 'success', text: 'Pista de sonido eliminada' });
        setTimeout(() => setSettingsFeedback(null), 3000);
      } catch (err) {
        setSettingsFeedback({ type: 'error', text: 'Error al eliminar pista' });
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Audio Element oculto para pruebas en el Admin */}
      <audio
        ref={adminAudioRef}
        onEnded={() => setPlayingTrackId(null)}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Waves size={24} color="var(--accent-teal)" />
            Sonidos Relajantes de Aguas Termales & Naturaleza
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Configura los sonidos ambientales de agua, río, cascada o spa que escuchan los visitantes al abrir la página web.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {showAddForm ? 'Cerrar Formulario' : <><Plus size={18} /> Subir Nuevo Sonido</>}
        </button>
      </div>

      {/* Feedback Alert */}
      {settingsFeedback && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: settingsFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${settingsFeedback.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: settingsFeedback.type === 'success' ? '#34d399' : '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '600',
          fontSize: '0.9rem'
        }}>
          {settingsFeedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {settingsFeedback.text}
        </div>
      )}

      {/* Formulario para Subir / Agregar Nuevo Sonido */}
      {showAddForm && (
        <div className="glass-card" style={{ padding: '1.75rem', borderColor: 'var(--accent-teal)', animation: 'fadeIn 0.25s ease' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} color="var(--accent-teal)" />
            Subir o Registrar Nuevo Sonido Relajante
          </h3>

          {trackFeedback && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              background: trackFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${trackFeedback.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: trackFeedback.type === 'success' ? '#34d399' : '#f87171',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              {trackFeedback.text}
            </div>
          )}

          <form onSubmit={handleCreateTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label className="form-label">Nombre del Sonido</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Manantial de Papallacta, Cascada Termal..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Categoría</label>
                <select
                  className="form-control"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Agua Termal">Agua Termal & Manantial</option>
                  <option value="Cascadas">Cascadas & Río</option>
                  <option value="Lluvia & Clima">Lluvia Suave del Páramo</option>
                  <option value="Música Zen Spa">Música Zen & Cuencos Tibetanos</option>
                  <option value="Naturaleza">Brisa & Páramo Andino</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Descripción o Sensación</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Sonido de corriente pura y burbujeo termal relajante para inducir paz y descanso."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            {/* Subidor de Archivo de Audio */}
            <AudioUploader
              currentAudio={newUrl}
              onAudioUploaded={(url) => setNewUrl(url)}
              label="Archivo de Audio (MP3, WAV, OGG, M4A)"
              helpText="Sube un archivo de audio desde tu computadora o pega un enlace directo"
            />

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-outline btn-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={addingTrack || !newUrl}
                className="btn btn-primary btn-md"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Check size={18} />
                {addingTrack ? 'Guardando...' : 'Guardar Sonido en la Biblioteca'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bloque de Ajustes Generales de Reproducción */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={20} color="var(--accent-teal)" />
          Preferencias del Reproductor en la Página Web
        </h3>

        <form onSubmit={handleSaveGeneralSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            {/* Toggle Habilitar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <input
                type="checkbox"
                id="soundEnabled"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-teal)', cursor: 'pointer' }}
              />
              <label htmlFor="soundEnabled" style={{ cursor: 'pointer', margin: 0 }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Activar Sonidos en la Web
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Muestra el reproductor flotante y reproduce sonidos de agua a los visitantes.
                </div>
              </label>
            </div>

            {/* Toggle Autoplay interact */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <input
                type="checkbox"
                id="autoplayInteract"
                checked={autoplayOnInteract}
                onChange={(e) => setAutoplayOnInteract(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-teal)', cursor: 'pointer' }}
              />
              <label htmlFor="autoplayInteract" style={{ cursor: 'pointer', margin: 0 }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Autoplay al Primer Toque
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Inicia la reproducción suavemente en cuanto el usuario hace clic en el sitio.
                </div>
              </label>
            </div>

            {/* Control Volumen Inicial */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Volumen Inicial:
                </span>
                <span style={{ fontSize: '0.88rem', color: 'var(--accent-teal)', fontWeight: '700' }}>
                  {Math.round(defaultVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={defaultVolume}
                onChange={(e) => setDefaultVolume(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-teal)', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={savingSettings}
              className="btn btn-primary btn-md"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Check size={18} />
              {savingSettings ? 'Guardando...' : 'Guardar Preferencias'}
            </button>
          </div>
        </form>
      </div>

      {/* Catálogo y Selección de Sonidos Disponibles */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--accent-teal)" />
            Biblioteca de Sonidos Relajantes ({tracks.length})
          </h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Haz clic en <strong>"Establecer como Sonido Activo"</strong> para cambiar el sonido predeterminado de la web.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {tracks.map((track) => {
            const isActive = track.id === activeTrackId;
            const isPlayingThis = playingTrackId === track.id;

            return (
              <div
                key={track.id}
                className="glass-card"
                style={{
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isActive ? '2px solid var(--accent-teal)' : '1px solid var(--border-glass)',
                  background: isActive ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.12), rgba(6, 17, 24, 0.85))' : 'var(--bg-secondary)',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 10px 30px rgba(20, 184, 166, 0.2)' : 'none'
                }}
              >
                {/* Badge de activo */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'var(--gradient-teal)',
                    color: '#032025',
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.4)'
                  }}>
                    <Radio size={12} className="spin-slow" /> ACTIVO EN LA WEB
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: isActive ? 'rgba(20, 184, 166, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-teal)',
                      flexShrink: 0
                    }}>
                      <Waves size={22} />
                    </div>

                    <div style={{ paddingRight: isActive ? '6.5rem' : '0' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        fontWeight: '700',
                        color: 'var(--accent-teal)',
                        letterSpacing: '0.05em'
                      }}>
                        {track.category || 'Agua Termal'}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0, fontWeight: '700' }}>
                        {track.title}
                      </h4>
                    </div>
                  </div>

                  {track.description && (
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.45' }}>
                      {track.description}
                    </p>
                  )}

                  {/* Reproductor de Prueba en el Admin */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.25rem'
                  }}>
                    <button
                      type="button"
                      onClick={() => handleToggleAdminPlay(track)}
                      title={isPlayingThis ? 'Pausar' : 'Probar sonido'}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        border: 'none',
                        background: isPlayingThis ? 'var(--gradient-teal)' : 'rgba(255, 255, 255, 0.1)',
                        color: isPlayingThis ? '#032025' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {isPlayingThis ? <Pause size={15} fill="#032025" /> : <Play size={15} fill="#ffffff" style={{ marginLeft: '2px' }} />}
                    </button>

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.72rem', color: isPlayingThis ? 'var(--accent-teal)' : 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>{isPlayingThis ? 'Reproduciendo prueba...' : 'Escuchar audio'}</span>
                        {isPlayingThis && (
                          <div className="audio-wave-bars">
                            <span />
                            <span />
                            <span />
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {track.url}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones de la Tarjeta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
                  {isActive ? (
                    <button
                      disabled
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, borderColor: 'var(--accent-teal)', color: 'var(--accent-teal)', background: 'rgba(20, 184, 166, 0.1)' }}
                    >
                      <Check size={15} /> Sonido Activo
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSetActive(track.id)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <Radio size={14} /> Establecer como Activo
                    </button>
                  )}

                  {!track.isPreset && (
                    <button
                      onClick={() => handleDeleteTrack(track.id, track.title)}
                      title="Eliminar este sonido"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
