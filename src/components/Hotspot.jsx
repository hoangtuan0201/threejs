import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { useMobile } from "../hooks/useMobile";
import * as THREE from "three";

// Animated Chevron Down Icon Component with Scroll Hint
function ChevronDownIcon() {
  const groupRef = useRef();
  const chevron1LeftRef = useRef();
  const chevron1RightRef = useRef();
  const chevron2LeftRef = useRef();
  const chevron2RightRef = useRef();
  const chevron3LeftRef = useRef();
  const chevron3RightRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Main floating animation
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.03;
    }

    // Cascading scroll-down animation for chevron 1
    const wave1 = Math.sin(time * 3) * 0.5 + 0.5; // 0 to 1
    if (chevron1LeftRef.current && chevron1RightRef.current) {
      chevron1LeftRef.current.material.opacity = wave1;
      chevron1RightRef.current.material.opacity = wave1;
    }

    // Cascading scroll-down animation for chevron 2
    const wave2 = Math.sin(time * 3 - 0.5) * 0.5 + 0.5; // Delayed
    if (chevron2LeftRef.current && chevron2RightRef.current) {
      chevron2LeftRef.current.material.opacity = wave2;
      chevron2RightRef.current.material.opacity = wave2;
    }

    // Cascading scroll-down animation for chevron 3
    const wave3 = Math.sin(time * 3 - 1) * 0.5 + 0.5; // More delayed
    if (chevron3LeftRef.current && chevron3RightRef.current) {
      chevron3LeftRef.current.material.opacity = wave3;
      chevron3RightRef.current.material.opacity = wave3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* First chevron (main) */}
      <group position={[0, 0.05, 0]}>
        <mesh position={[-0.025, 0.025, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.08, 0.012, 0.012]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.025, 0.02, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.08, 0.012, 0.012]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Second chevron (animated) */}
      <group position={[0, -0.03, 0]}>
        <mesh ref={chevron1LeftRef} position={[-0.025, 0.025, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.07, 0.01, 0.01]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} transparent />
        </mesh>
        <mesh ref={chevron1RightRef} position={[0.025, 0.025, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.07, 0.01, 0.01]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} transparent />
        </mesh>
      </group>

      {/* Third chevron (animated) */}
      <group position={[0, -0.08, 0]}>
        <mesh ref={chevron2LeftRef} position={[-0.02, 0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.06, 0.008, 0.008]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.15} transparent />
        </mesh>
        <mesh ref={chevron2RightRef} position={[0.02, 0.02, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.06, 0.008, 0.008]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.15} transparent />
        </mesh>
      </group>

      
    </group>
  );
}

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
        {/* 3D Chevron Down Icon with Animation */}
        <ChevronDownIcon />
      </group>

      {/* HTML label - separate from rotated group to maintain correct position */}
      {!isSelected && !shouldHideAtStart && (
        <Html
          distanceFactor={10}
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
                font-size: ${mobile.isMobile ? '16px' : '12px'};
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
                width: 20px;
                height: 20px;
                border-radius: 50px;
                border: 1px solid rgba(255, 255, 255, 0.87);
                z-index: 10;
                background-color: rgba(0, 0, 0, 0.9);
                pointer-events: all;
                transition: all 0.2s ease;
              }
              
              .hotspotHTML .hotspot-annotation:hover:before {
                width: 100%;
                box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.4);
                pointer-events: none;
                -webkit-backdrop-filter: blur(6px);
                backdrop-filter: blur(6px);
                background: rgba(0, 0, 0, 0.95);
                border-radius: ${mobile.isMobile ? '8px' : '6px'};
              }
              
              .hotspotHTML .hotspot-annotation:hover .hotspot-box .hotspot-title {
                animation: hotspot-text-wipe .9s ease-in-out forwards;
                pointer-events: none;
              }
              
              .hotspotHTML .hotspot-annotation:hover .hotspot-statusCircle {
                background-color: rgba(0, 0, 0, 0.95);
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0,0,0,0.6);
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
