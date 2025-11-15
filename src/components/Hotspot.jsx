import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMobile } from "../hooks/useMobile";
import * as THREE from "three";

export function Hotspot({ chapter, onHotspotClick, selectedHotspot, currentPosition }) {
  const mobile = useMobile();
  const { camera, controls } = useThree();

  if (!chapter || !chapter.hotspot) {
    return null;
  }

  const isSelected = selectedHotspot && selectedHotspot.id === chapter.id;

  // Hide labels at very beginning of scene to prevent see-through walls
  const shouldHideAtStart = currentPosition < 0.15;
  
  // Calculate relative label position from hotspot position
  const hotspotPosition = chapter.hotspot.position || [0, 0, 0];

  // Get absolute label position from data
  const absoluteLabelPosition = mobile.isMobile
    ? (chapter.hotspot.mobileLabelPosition || chapter.hotspot.labelPosition)
    : (chapter.hotspot.labelPosition);

  // Use absolute position directly (not relative to hotspot group since label is now outside)
  const labelPosition = absoluteLabelPosition || [
    hotspotPosition[0],
    hotspotPosition[1] + 0.3,
    hotspotPosition[2] + 0.1
  ];

  const labelRotation = mobile.isMobile
    ? (chapter.hotspot.mobileLabelRotation || chapter.hotspot.labelRotation || [0, 0, 0])
    : (chapter.hotspot.labelRotation || [0, 0, 0]);

  // Zoom to specific mesh function
  const zoomToMesh = (meshName) => {
    if (meshName === "Geom3D_393" && camera && controls) {
      // Target position for Geom3D_393 mesh
      const targetPosition = new THREE.Vector3(27.78, 4.4, -20.5); // Closer to the mesh
      const currentPosition = camera.position.clone();

      // Smooth camera movement
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();

      const animateCamera = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(currentPosition, targetPosition, easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        } else {
          // Update controls target if available
          if (controls && controls.target) {
            controls.target.set(27.78, 4.4, -22.5); // Look at the mesh
            controls.update();
          }
        }
      };

      animateCamera();
    }
  };

  return (
    <>
      {/* Hotspot 3D Icon - with rotation */}
      <group
      position={chapter.hotspot.position}
      rotation={chapter.hotspot.rotation}
      onClick={(e) => {
        e.stopPropagation();
        // Zoom to mesh if it's Geom3D_393
        if (chapter.id === "Geom3D_393") {
          zoomToMesh("Geom3D_393");
        }
        onHotspotClick(chapter.id);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        // Zoom to mesh if it's Geom3D_393
        if (chapter.id === "Geom3D_393") {
          zoomToMesh("Geom3D_393");
          // console.log("it work")
        }
        onHotspotClick(chapter.id);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
      }}
    >

      </group>

      {/* HTML label - separate from rotated group to maintain correct position */}
      {!isSelected && !shouldHideAtStart && (
        <Html
          distanceFactor={mobile.isMobile ? 8 : 10}
          position={labelPosition}
          rotation={labelRotation}
          occlude={true}
          style={{
            pointerEvents: 'none',
          }}
        >
          <style>
            {`
              .hotspotHTML {
                pointer-events: none;
              }
              
              .hotspotHTML .hotspot-annotation {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding: 5px;
                width: max-content;
                gap: 13px;
                cursor: pointer;
                pointer-events: none;
              }
              
              .hotspotHTML .hotspot-annotation.active:before {
                width: 100%;
                pointer-events: none;
              }
              
              .hotspotHTML .hotspot-annotation.active .hotspot-box .hotspot-title {
                opacity: 1;
                animation: hotspot-text-wipe .7s ease-in-out forwards;
                pointer-events: none;
              }
              
              .hotspotHTML .hotspot-annotation:before {
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
              
              .hotspotHTML .hotspot-annotation .hotspot-pulse {
                position: absolute;
                top: 5px;
                left: 0;
                width: 30px;
                height: 30px;
              }
              
              .hotspotHTML .hotspot-annotation .hotspot-pulse:after {
                content: "";
                display: block;
                position: absolute;
                border: 1px solid #ffffff;
                left: -30px;
                right: -30px;
                top: -30px;
                bottom: -30px;
                border-radius: 50%;
                animation: hotspot-animate-pulse 2.7s linear infinite;
                pointer-events: none;
              }
              
              .hotspotHTML .hotspot-annotation .hotspot-box {
                display: flex;
                flex-direction: column;
                padding-right: 20px;
                pointer-events: none;
              }
              
              .hotspotHTML .hotspot-annotation .hotspot-box .hotspot-title {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: ${mobile.isMobile ? '18px' : '12px'};
                font-weight: 600;
                line-height: 30px;
                opacity: 0;
                -webkit-mask-image: linear-gradient(to left, #0000 38%, #000 40%);
                -webkit-mask-size: 300%;
                mask-image: linear-gradient(to left, #0000 38%, #000 40%);
                mask-size: 300%;
                z-index: 10;
                pointer-events: none;
                color: #fff;
                text-shadow: 0 1px 2px rgba(0,0,0,0.8);
              }
              
              .hotspotHTML .hotspot-annotation .hotspot-statusCircle {
                width: ${mobile.isMobile ? '24px' : '20px'};
                height: ${mobile.isMobile ? '24px' : '20px'};
                border-radius: 50px;
                border: 1px solid rgba(255, 255, 255, 0.87);
                z-index: 10;
                background-color: #1976d2;
                pointer-events: all;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: ${mobile.isMobile ? '14px' : '12px'};
                font-weight: bold;
              }
              
              .hotspotHTML .hotspot-annotation .hotspot-statusCircle::before {
                content: '?';
                color: white;
                font-size: ${mobile.isMobile ? '14px' : '12px'};
                font-weight: bold;
              }
              
              .hotspotHTML .hotspot-annotation:hover:before {
                width: 100%;
                box-shadow: 0 8px 24px rgba(25,118,210,0.4), 0 8px 16px rgba(25,118,210,0.4);
                pointer-events: none;
                -webkit-backdrop-filter: blur(6px);
                backdrop-filter: blur(6px);
                background: rgba(25, 118, 210, 0.95);
                border-radius: ${mobile.isMobile ? '8px' : '6px'};
              }
              
              .hotspotHTML .hotspot-annotation:hover .hotspot-box .hotspot-title {
                animation: hotspot-text-wipe .9s ease-in-out forwards;
                pointer-events: none;
              }
              
              .hotspotHTML .hotspot-annotation:hover .hotspot-statusCircle {
                background-color: #1565c0;
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(25,118,210,0.6);
              }
              
              @keyframes hotspot-text-wipe {
                0% {
                  opacity: 0;
                  -webkit-mask-position: 100%;
                }
                to {
                  opacity: 1;
                  -webkit-mask-position: 0%;
                }
              }
              
              @keyframes hotspot-animate-pulse {
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
          
          <div className="hotspotHTML">
            <div 
              className="hotspot-annotation"
              onClick={(e) => {
                e.stopPropagation();
                onHotspotClick(chapter.id);
              }}
            >
              <span className="hotspot-statusCircle"></span>
              <div className="hotspot-box">
                <span className="hotspot-title">{chapter.hotspot.title || chapter.title || `H${chapter.id}`}</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

// HotspotsRenderer component - renders all hotspots
export function HotspotsRenderer({ sequenceChapters, onHotspotClick, selectedHotspot, currentPosition }) {
  return (
    <>
      {sequenceChapters && sequenceChapters.length > 0 && (
        sequenceChapters
          .filter(chapter => chapter.hotspot) // Only chapters with hotspot data
          .map((chapter) => (
            <Hotspot
              key={`hotspot-${chapter.id}`}
              chapter={chapter}
              onHotspotClick={onHotspotClick}
              selectedHotspot={selectedHotspot}
              currentPosition={currentPosition}
            />
          ))
      )}
    </>
  );
}
