import { useState } from 'react';
import { Html } from '@react-three/drei';

const ToggleHiddenObjects = ({ onToggleHidden, isVisible }) => {
  const [isHidden, setIsHidden] = useState(false);

  // Always call hooks first (Rules of Hooks)
  const handleToggle = (e) => {
    e.stopPropagation();
    const newHiddenState = !isHidden;
    setIsHidden(newHiddenState);
    onToggleHidden(newHiddenState);
  };

  // Early returns after all hooks
  if (!isVisible) return null;

  return (
    <group position={[17.1, 5.7, -32.2]} >
      {/* Clickable Text Label - similar to hotspot labels */}
      <Html
        occlude
        position={[0, 0, 0]}
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
      >
        <div
          onClick={handleToggle}
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.8)';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
          }}
        >
          {isHidden ? 'Show Objects' : 'Hide Objects'}
        </div>
      </Html>
    </group>
  );
};

export default ToggleHiddenObjects;
