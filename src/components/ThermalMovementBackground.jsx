import React, { useEffect, useRef } from 'react';

/**
 * ThermalMovementBackground: Advanced lightweight HTML5 Canvas engine for 
 * photorealistic thermal steam ribbons, rising mineral particles, water ripples and ambient light glimmers.
 */
export default function ThermalMovementBackground({ opacity = 0.75 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // 1. Rising Thermal Steam Bubbles & Minerals
    const particleCount = 38;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 5 + 1.5,
        speedY: Math.random() * 0.7 + 0.25,
        speedX: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.45 + 0.1,
        color: Math.random() > 0.6 ? '56, 189, 248' : (Math.random() > 0.4 ? '255, 183, 3' : '16, 185, 129'),
        oscillationSpeed: Math.random() * 0.02 + 0.008,
        angle: Math.random() * Math.PI * 2
      });
    }

    // 2. Rising Thermal Steam Clouds / Ribbons over the pools
    const vaporClouds = [];
    const cloudCount = 7;
    for (let i = 0; i < cloudCount; i++) {
      vaporClouds.push({
        x: (width * (0.15 + i * 0.12)) + (Math.random() * 80 - 40),
        y: height * 0.6 + (Math.random() * height * 0.35),
        radius: Math.random() * 70 + 50,
        speedY: Math.random() * 0.4 + 0.2,
        speedX: Math.random() * 0.3 - 0.15,
        alpha: Math.random() * 0.08 + 0.03,
        scaleSpeed: Math.random() * 0.003 + 0.001,
        scale: 1,
        maxScale: Math.random() * 0.8 + 1.4
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Render Soft Vapor Clouds (Geothermal Steam)
      vaporClouds.forEach(vc => {
        vc.y -= vc.speedY;
        vc.x += vc.speedX + Math.sin(time + vc.radius) * 0.25;
        vc.scale += vc.scaleSpeed;

        if (vc.y < height * 0.15 || vc.scale > vc.maxScale) {
          vc.y = height * 0.85 + Math.random() * 60;
          vc.x = width * (0.1 + Math.random() * 0.8);
          vc.scale = 0.8;
          vc.alpha = Math.random() * 0.07 + 0.03;
        }

        ctx.save();
        ctx.beginPath();
        const currentRadius = vc.radius * vc.scale;
        const grad = ctx.createRadialGradient(vc.x, vc.y, 0, vc.x, vc.y, currentRadius);
        grad.addColorStop(0, `rgba(240, 253, 250, ${vc.alpha * 1.5})`);
        grad.addColorStop(0.5, `rgba(186, 230, 253, ${vc.alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.arc(vc.x, vc.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Glowing Thermal Bubbles
      particles.forEach(p => {
        p.y -= p.speedY;
        p.angle += p.oscillationSpeed;
        p.x += Math.sin(p.angle) * 0.6 + p.speedX;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        grad.addColorStop(0, `rgba(${p.color}, ${p.alpha * 1.2})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: opacity
      }}
    />
  );
}

