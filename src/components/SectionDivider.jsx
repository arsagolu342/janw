import React from 'react';

export default function SectionDivider({ 
  fill = 'var(--bg-primary)', 
  bg = 'transparent', 
  flip = false,
  animated = true 
}) {
  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      lineHeight: 0,
      background: bg,
      position: 'relative',
      zIndex: 2,
      transform: flip ? 'rotate(180deg)' : 'none',
      marginTop: flip ? '-1px' : '0',
      marginBottom: flip ? '0' : '-1px'
    }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          position: 'relative',
          display: 'block',
          width: 'calc(100% + 1.3px)',
          height: '45px',
          fill: fill,
          animation: animated ? 'waveDrift 10s infinite ease-in-out alternate' : 'none'
        }}
      >
        <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"></path>
      </svg>
    </div>
  );
}
