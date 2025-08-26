import React, { useState } from 'react';
import { Html } from '@react-three/drei';

function Hotspot({ position, rotation, label, onClick, isActive }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position} rotation={rotation}>
      <Html
        distanceFactor={10}
        center
        style={{
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <div
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Hotspot circle */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: isActive ? '#ff6b6b' : hovered ? '#4fc3f7' : '#ffffff',
              border: '2px solid #ffffff',
              boxShadow: hovered 
                ? '0 0 20px rgba(79, 195, 247, 0.8), 0 0 40px rgba(79, 195, 247, 0.4)' 
                : '0 2px 10px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              animation: hovered ? 'pulse 1.5s infinite' : 'none',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Inner dot */}
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ffffff',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
          
          {/* Outer ring when hovered */}
          {hovered && (
            <div
              style={{
                position: 'absolute',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #4fc3f7',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.6,
                animation: 'ripple 2s infinite',
                zIndex: 1
              }}
            />
          )}
          
          {/* Label */}
          
        </div>
        
        {/* CSS Animations */}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          @keyframes ripple {
            0% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 0;
            }
          }
        `}</style>
      </Html>
    </group>
  );
}

export default Hotspot;