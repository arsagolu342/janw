import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Volume1, 
  Play, 
  Pause, 
  Waves, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Music,
  Check
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

// Procedural Web Audio API Engine for Realistic Thermal Water / Bubbling Springs
class WebAudioWaterEngine {
  constructor() {
    this.ctx = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.timer = null;
    this.bubbleTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start(volume = 0.4, type = 'thermal') {
    this.init();
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;
    this.setVolume(volume);

    // Create pink noise buffer
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    const left = noiseBuffer.getChannelData(0);
    const right = noiseBuffer.getChannelData(1);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let b0_r = 0, b1_r = 0, b2_r = 0, b3_r = 0, b4_r = 0, b5_r = 0, b6_r = 0;

    for (let i = 0; i < bufferSize; i++) {
      const wL = Math.random() * 2 - 1;
      const wR = Math.random() * 2 - 1;

      b0 = 0.99886 * b0 + wL * 0.0555179;
      b1 = 0.99332 * b1 + wL * 0.0750759;
      b2 = 0.96900 * b2 + wL * 0.1538520;
      b3 = 0.86650 * b3 + wL * 0.3104856;
      b4 = 0.55000 * b4 + wL * 0.5329522;
      b5 = -0.7616 * b5 - wL * 0.0168980;
      left[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + wL * 0.5362) * 0.08;
      b6 = wL * 0.115926;

      b0_r = 0.99886 * b0_r + wR * 0.0555179;
      b1_r = 0.99332 * b1_r + wR * 0.0750759;
      b2_r = 0.96900 * b2_r + wR * 0.1538520;
      b3_r = 0.86650 * b3_r + wR * 0.3104856;
      b4_r = 0.55000 * b4_r + wR * 0.5329522;
      b5_r = -0.7616 * b5_r - wR * 0.0168980;
      right[i] = (b0_r + b1_r + b2_r + b3_r + b4_r + b5_r + b6_r + wR * 0.5362) * 0.08;
      b6_r = wR * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filters for soothing stream resonance
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = type === 'waterfall' ? 650 : 420;
    filter.Q.value = 1.2;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1200;

    whiteNoise.connect(filter);
    filter.connect(lowpass);
    lowpass.connect(this.gainNode);
    whiteNoise.start();
    this.noiseSource = whiteNoise;

    // LFO for organic water movement
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.18;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 150;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.lfo = lfo;

    // Occasional thermal bubble generator
    const makeBubble = () => {
      if (!this.isPlaying || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        const startFreq = 380 + Math.random() * 450;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(startFreq + 250, this.ctx.currentTime + 0.12);

        bGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        bGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 0.02);
        bGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

        osc.connect(bGain);
        bGain.connect(this.gainNode);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
      } catch (e) {}

      const nextTime = 200 + Math.random() * 800;
      this.bubbleTimer = setTimeout(makeBubble, nextTime);
    };
    makeBubble();
  }

  setVolume(vol) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.bubbleTimer) clearTimeout(this.bubbleTimer);
    try {
      if (this.noiseSource) this.noiseSource.stop();
      if (this.lfo) this.lfo.stop();
    } catch (e) {}
    this.noiseSource = null;
    this.lfo = null;
  }
}

const globalWaterSynth = new WebAudioWaterEngine();

export default function AmbientAudioPlayer() {
  const { soundSettings } = useSiteData();
  const audioRef = useRef(null);

  // Estados locales
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('jamanco_ambient_volume');
    return saved !== null ? parseFloat(saved) : (soundSettings?.defaultVolume || 0.4);
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(soundSettings?.activeTrackId || 'sound-water-termal');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showWelcomePill, setShowWelcomePill] = useState(true);
  const [useSynthMode, setUseSynthMode] = useState(false);

  // Pistas disponibles
  const tracks = soundSettings?.tracks || [];
  const activeTrack = tracks.find(t => t.id === currentTrackId) || tracks[0];

  // Sincronizar con cambio de pista desde el admin
  useEffect(() => {
    if (soundSettings?.activeTrackId && soundSettings.activeTrackId !== currentTrackId) {
      setCurrentTrackId(soundSettings.activeTrackId);
    }
  }, [soundSettings?.activeTrackId]);

  // Manejo de cambio de pista o URL
  useEffect(() => {
    if (audioRef.current && activeTrack?.url) {
      const wasPlaying = isPlaying;
      audioRef.current.src = activeTrack.url;
      audioRef.current.load();
      audioRef.current.volume = isMuted ? 0 : volume;
      if (wasPlaying) {
        audioRef.current.play().catch(e => {
          console.warn('Audio tag falló, activando sintetizador Web Audio:', e);
          setUseSynthMode(true);
          globalWaterSynth.start(isMuted ? 0 : volume, activeTrack?.category === 'Cascadas' ? 'waterfall' : 'thermal');
        });
      }
    }
  }, [activeTrack?.url]);

  // Actualizar volumen
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVol;
    }
    if (useSynthMode || globalWaterSynth.isPlaying) {
      globalWaterSynth.setVolume(effectiveVol);
    }
    localStorage.setItem('jamanco_ambient_volume', volume.toString());
  }, [volume, isMuted, useSynthMode]);

  // Intento de reproducción INMEDIATA al abrir la página
  useEffect(() => {
    if (!soundSettings?.enabled) return;

    const startAudioNow = () => {
      const effectiveVol = isMuted ? 0 : volume;

      if (audioRef.current && activeTrack?.url) {
        audioRef.current.volume = effectiveVol;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setUseSynthMode(false);
            })
            .catch(() => {
              // Si el navegador bloqueó el autoplay sin interacción, activar al primer movimiento/toque
              const onUserFirstMove = () => {
                if (audioRef.current) {
                  audioRef.current.volume = effectiveVol;
                  audioRef.current.play()
                    .then(() => {
                      setIsPlaying(true);
                      setUseSynthMode(false);
                    })
                    .catch(() => {
                      setUseSynthMode(true);
                      globalWaterSynth.start(effectiveVol, activeTrack?.category === 'Cascadas' ? 'waterfall' : 'thermal');
                      setIsPlaying(true);
                    });
                } else {
                  setUseSynthMode(true);
                  globalWaterSynth.start(effectiveVol, 'thermal');
                  setIsPlaying(true);
                }

                ['pointerdown', 'mousemove', 'scroll', 'touchstart', 'click', 'keydown', 'wheel'].forEach(evt => {
                  window.removeEventListener(evt, onUserFirstMove);
                });
              };

              ['pointerdown', 'mousemove', 'scroll', 'touchstart', 'click', 'keydown', 'wheel'].forEach(evt => {
                window.addEventListener(evt, onUserFirstMove, { once: true, passive: true });
              });
            });
        }
      }
    };

    // Intentar reproducir de inmediato al cargar la página
    startAudioNow();
  }, [soundSettings?.enabled, activeTrack?.url, isMuted, volume]);

  // Ocultar notificación de bienvenida tras unos segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomePill(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  if (!soundSettings || soundSettings.enabled === false) {
    return null;
  }

  const togglePlay = () => {
    const effectiveVol = isMuted ? 0 : volume;
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      globalWaterSynth.stop();
      setIsPlaying(false);
    } else {
      if (audioRef.current && activeTrack?.url) {
        audioRef.current.volume = effectiveVol;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setUseSynthMode(false);
          })
          .catch(e => {
            console.warn('Reproduciendo mediante motor de agua Web Audio:', e);
            setUseSynthMode(true);
            globalWaterSynth.start(effectiveVol, activeTrack?.category === 'Cascadas' ? 'waterfall' : 'thermal');
            setIsPlaying(true);
          });
      } else {
        setUseSynthMode(true);
        globalWaterSynth.start(effectiveVol, 'thermal');
        setIsPlaying(true);
      }
    }
    setShowWelcomePill(false);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleSelectTrack = (trackId) => {
    setCurrentTrackId(trackId);
    const selected = tracks.find(t => t.id === trackId);
    const effectiveVol = isMuted ? 0 : volume;

    if (audioRef.current && selected?.url) {
      audioRef.current.src = selected.url;
      audioRef.current.load();
      audioRef.current.volume = effectiveVol;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setUseSynthMode(false);
          globalWaterSynth.stop();
        })
        .catch(() => {
          setUseSynthMode(true);
          globalWaterSynth.stop();
          globalWaterSynth.start(effectiveVol, selected?.category === 'Cascadas' ? 'waterfall' : 'thermal');
          setIsPlaying(true);
        });
    }
  };

  return (
    <>
      {/* Elemento de Audio HTML5 (Inaudible/Invisible en interfaz) */}
      <audio
        ref={audioRef}
        src={activeTrack?.url}
        autoPlay
        playsInline
        loop
        preload="auto"
        onError={() => {
          console.warn('Error cargando archivo de audio, fallback a sintetizador Web Audio activo');
          if (isPlaying) {
            setUseSynthMode(true);
            globalWaterSynth.start(isMuted ? 0 : volume, 'thermal');
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (!useSynthMode) setIsPlaying(false);
        }}
        style={{ display: 'none' }}
      />
    </>
  );
}

