import React, { useState } from 'react';
import { Html } from '@react-three/drei';

const Hotspot = ({ position, rotation, label, isActive, onClick, onResetState }) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <group position={position} rotation={rotation}>
      <Html
        
        style={{
          pointerEvents: 'none',
        }}
      >
        <style>
          {`
            .annotationHTML {
              pointer-events: none;
            }
            
            .annotationHTML .annotation {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              padding: 5px;
              width: max-content;
              gap: 13px;
              cursor: pointer;
              pointer-events: none;
            }
            
            .annotationHTML .annotation.active:before {
              width: 100%;
              pointer-events: none;
            }
            
            .annotationHTML .annotation.active .box .title {
              opacity: 1;
              animation: text-wipe .7s ease-in-out forwards;
              pointer-events: none;
            }
            
            .annotationHTML .annotation:before {
              content: "";
              position: absolute;
              top: 0;
              left: -5px;
              display: block;
              border-radius: 28px;
              background: none;
              width: 40px;
              height: 40px;
              transition: all .4s ease-in-out;
              pointer-events: none;
            }
            
            .annotationHTML .annotation .pulse {
              position: absolute;
              top: 5px;
              left: 0;
              width: 30px;
              height: 30px;
            }
            
            .annotationHTML .annotation .pulse:after {
              content: "";
              display: block;
              position: absolute;
              border: 1px solid #ffffff;
              left: -30px;
              right: -30px;
              top: -30px;
              bottom: -30px;
              border-radius: 50%;
              animation: animate-pulse 2.7s linear infinite;
              pointer-events: none;
            }
            
            .annotationHTML .annotation .box {
              display: flex;
              flex-direction: column;
              padding-right: 20px;
              pointer-events: none;
            }
            
            .annotationHTML .annotation .box .title {
              font-family: Inter, sans-serif;
              font-size: 16px;
              font-weight: 500;
              line-height: 30px;
              opacity: 0;
              -webkit-mask-image: linear-gradient(to left, #0000 38%, #000 40%);
              -webkit-mask-size: 300%;
              mask-image: linear-gradient(to left, #0000 38%, #000 40%);
              mask-size: 300%;
              z-index: 10;
              pointer-events: none;
              color: #000;
            }
            
            .annotationHTML .annotation .statusCircle {
              width: 20px;
              height: 20px;
              border-radius: 50px;
              border: 1px solid grey;
              z-index: 10;
              background-color: #fff;
              pointer-events: all;
            }
            
            .annotationHTML .annotation:hover:before {
              width: 100%;
              box-shadow: 0 8px 24px #0000000a, 0 8px 16px #0000000a;
              pointer-events: none;
              -webkit-backdrop-filter: blur(6px);
              backdrop-filter: blur(6px);
              background: #ffffffd7;
            }
            
            .annotationHTML .annotation:hover .box .title {
              animation: text-wipe .9s ease-in-out forwards;
              pointer-events: none;
            }
            
            @keyframes text-wipe {
              0% {
                opacity: 0;
                -webkit-mask-position: 100%;
              }
              to {
                opacity: .4;
                -webkit-mask-position: 0%;
              }
            }
            
            @keyframes animate-pulse {
              0% {
                transform: scale(.5);
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
              to {
                transform: scale(1.2);
                opacity: 0;
              }
            }
          `}
        </style>
        
        <div className="annotationHTML">
          <div 
            className={`annotation ${hovered ? 'active' : ''}`}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <span className="statusCircle"></span>
            <div className="box">
              <span className="title">{label}</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

export default Hotspot;
