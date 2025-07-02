import { useState } from "react";
import { Html } from "@react-three/drei";

export function PositionPicker({ isEnabled = false, onPositionPicked }) {
  const [pickedPositions, setPickedPositions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleModelClick = (event) => {
    if (!isEnabled) return;

    event.stopPropagation();
    
    // Lấy tọa độ từ intersection point
    const position = event.point;
    const roundedPosition = [
      parseFloat(position.x.toFixed(2)),
      parseFloat(position.y.toFixed(2)),
      parseFloat(position.z.toFixed(2))
    ];

    console.log('🎯 Clicked position:', roundedPosition);
    
    // Thêm vào lịch sử
    const newPosition = {
      id: Date.now(),
      position: roundedPosition,
      timestamp: new Date().toLocaleTimeString()
    };

    setPickedPositions(prev => [newPosition, ...prev.slice(0, 9)]); // Giữ tối đa 10 vị trí

    // Callback để parent component có thể sử dụng
    if (onPositionPicked) {
      onPositionPicked(roundedPosition);
    }

    // Copy vào clipboard
    navigator.clipboard.writeText(`[${roundedPosition.join(', ')}]`).then(() => {
      console.log('📋 Position copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  };

  const copyPosition = (position) => {
    const positionString = `[${position.join(', ')}]`;
    navigator.clipboard.writeText(positionString).then(() => {
      console.log('📋 Position copied:', positionString);
    });
  };

  const clearHistory = () => {
    setPickedPositions([]);
  };

  if (!isEnabled) return null;

  return (
    <>
      {/* Click handler - invisible sphere covering the scene */}
      <mesh
        onClick={handleModelClick}
        visible={false}
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[1000, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Position History UI */}
      <Html
        position={[0, 0, 0]}
        center={false}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        <div style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          minWidth: '280px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '8px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#4CAF50'
            }}>
              🎯 Position Picker
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {showHistory ? 'Hide' : 'Show'} History
            </button>
          </div>

          {/* Instructions */}
          <div style={{
            fontSize: '12px',
            color: '#ccc',
            marginBottom: '12px',
            lineHeight: '1.4'
          }}>
            Click anywhere on the 3D model to get position coordinates.
            Positions are automatically copied to clipboard.
          </div>

          {/* Last picked position */}
          {pickedPositions.length > 0 && (
            <div style={{
              background: 'rgba(76, 175, 80, 0.2)',
              border: '1px solid #4CAF50',
              borderRadius: '4px',
              padding: '8px',
              marginBottom: '8px'
            }}>
              <div style={{ fontSize: '12px', color: '#4CAF50', marginBottom: '4px' }}>
                Latest Position:
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '4px 6px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
              onClick={() => copyPosition(pickedPositions[0].position)}
              title="Click to copy"
              >
                [{pickedPositions[0].position.join(', ')}]
              </div>
            </div>
          )}

          {/* Position History */}
          {showHistory && pickedPositions.length > 1 && (
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  History ({pickedPositions.length})
                </span>
                <button
                  onClick={clearHistory}
                  style={{
                    background: 'rgba(255, 0, 0, 0.3)',
                    border: 'none',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
              
              {pickedPositions.slice(1).map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    padding: '6px 8px',
                    borderBottom: index < pickedPositions.length - 2 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  onClick={() => copyPosition(item.position)}
                  title="Click to copy"
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontFamily: 'monospace',
                      color: '#ccc'
                    }}>
                      [{item.position.join(', ')}]
                    </span>
                    <span style={{
                      fontSize: '10px',
                      color: '#888'
                    }}>
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div style={{
            fontSize: '10px',
            color: '#888',
            marginTop: '8px',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            💡 Use these coordinates for hotspot positions
          </div>
        </div>
      </Html>
    </>
  );
}