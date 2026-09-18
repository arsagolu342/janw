import React, { useState, useRef } from 'react';
import { UploadCloud, Music, Check, AlertCircle, Link as LinkIcon, X, Play, Pause, Volume2, FileAudio } from 'lucide-react';
import { apiUploadAudio } from '../../services/api';

export default function AudioUploader({
  currentAudio,
  onAudioUploaded,
  label = "Archivo de audio relajante",
  helpText = "MP3, WAV, OGG, M4A, AAC hasta 30MB"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [manualUrl, setManualUrl] = useState(currentAudio || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  
  const fileInputRef = useRef(null);
  const audioPreviewRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(25);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const res = await apiUploadAudio(file);
      clearInterval(interval);
      setUploadProgress(100);

      if (res.success && res.url) {
        setUploadSuccess(true);
        onAudioUploaded(res.url);
        setTimeout(() => {
          setUploadSuccess(false);
          setUploadProgress(0);
        }, 3000);
      }
    } catch (err) {
      setUploadError(err.message || 'Error al subir el archivo de audio');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleApplyManualUrl = () => {
    if (manualUrl.trim()) {
      onAudioUploaded(manualUrl.trim());
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2500);
    }
  };

  const togglePreview = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.play()
        .then(() => setIsPlayingPreview(true))
        .catch(err => console.error('Error previsualizando audio:', err));
    }
  };

  return (
    <div className="form-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
        <label className="form-label" style={{ margin: 0 }}>
          <span>{label}</span>
        </label>
        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--card-inner-bg)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: '700',
              border: 'none',
              background: mode === 'upload' ? 'var(--gradient-teal)' : 'transparent',
              color: mode === 'upload' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Subir Archivo
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: '700',
              border: 'none',
              background: mode === 'url' ? 'var(--gradient-teal)' : 'transparent',
              color: mode === 'url' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Pegar URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: isDragging ? '2px dashed var(--accent-teal)' : '1.5px dashed var(--input-border)',
            background: isDragging 
              ? 'rgba(20, 184, 166, 0.12)' 
              : 'rgba(6, 17, 24, 0.45)',
            borderRadius: 'var(--radius-md)',
            padding: '1.4rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: isDragging ? '0 0 20px rgba(20, 184, 166, 0.25)' : 'none'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.webm"
            onChange={onFileInputChange}
            style={{ display: 'none' }}
          />

          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(20, 184, 166, 0.15)',
            border: '1px solid rgba(45, 212, 191, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileAudio size={24} color="var(--accent-teal)" />
          </div>

          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
              {isUploading ? 'Subiendo audio al servidor...' : 'Haz clic o arrastra un archivo de audio aquí'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {helpText}
            </div>
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div style={{ width: '80%', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginTop: '0.3rem' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--accent-teal)', transition: 'width 0.2s ease' }} />
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div className="input-icon-wrapper" style={{ flex: 1 }}>
            <LinkIcon size={16} className="input-icon-left" />
            <input
              type="text"
              className="form-control"
              placeholder="https://ejemplo.com/audio.mp3 o /uploads/..."
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.6rem 1.1rem' }}
          >
            Aplicar
          </button>
        </div>
      )}

      {/* Feedback alerts */}
      {uploadSuccess && (
        <div className="form-feedback-success" style={{ marginTop: '0.45rem' }}>
          <Check size={14} /> Audio cargado y configurado exitosamente
        </div>
      )}

      {uploadError && (
        <div className="form-feedback-error" style={{ marginTop: '0.45rem' }}>
          <AlertCircle size={14} /> {uploadError}
        </div>
      )}

      {/* Pre-escucha y Reproductor del Audio Cargado */}
      {currentAudio && (
        <div style={{
          marginTop: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          background: 'rgba(6, 17, 24, 0.75)',
          border: '1px solid var(--border-glass)',
          padding: '0.65rem 0.95rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <audio
            ref={audioPreviewRef}
            src={currentAudio}
            onEnded={() => setIsPlayingPreview(false)}
            onPause={() => setIsPlayingPreview(false)}
            onPlay={() => setIsPlayingPreview(true)}
          />

          <button
            type="button"
            onClick={togglePreview}
            title={isPlayingPreview ? 'Pausar audio' : 'Escuchar vista previa'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: isPlayingPreview ? 'var(--gradient-teal)' : 'rgba(255, 255, 255, 0.1)',
              color: isPlayingPreview ? '#032025' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {isPlayingPreview ? <Pause size={16} fill="#032025" /> : <Play size={16} fill="#ffffff" style={{ marginLeft: '2px' }} />}
          </button>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>AUDIO ASIGNADO</span>
              {isPlayingPreview && (
                <div className="audio-wave-bars">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500' }}>
              {currentAudio}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (audioPreviewRef.current) audioPreviewRef.current.pause();
              setIsPlayingPreview(false);
              onAudioUploaded('');
            }}
            title="Quitar audio"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
