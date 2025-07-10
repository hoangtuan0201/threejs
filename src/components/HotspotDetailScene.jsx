import { Suspense, useEffect } from "react";
import { PerspectiveCamera } from "@theatre/r3f";
import { Html } from "@react-three/drei";
import { Model } from "./Model";
import { useMobile } from "../hooks/useMobile";
import { VideoScreen } from "./VideoScreen";

export function HotspotDetailScene({ chapter, onReturnToMain, onModelLoaded, savedMainSceneState }) {
  const mobile = useMobile();

  // Handle escape key to return to main scene
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onReturnToMain();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onReturnToMain]);

  if (!chapter) return null;

  return (
    <>
      <color attach="background" args={["#84a4f4"]} />

      {/* Enhanced lighting for detail scene */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.6} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      <Suspense fallback={null}>
        <Model onModelLoaded={onModelLoaded} />
      </Suspense>



      {/* Hotspot Details Panel - Same design as HotspotDetail.jsx */}
      <group
        position={mobile.isMobile ? [27.8, 4.8, -22.1] : [27.8, 4.55, -22.9]}
        rotation={[0, Math.PI / 1.8, 0]}
      >
        <Html
          position={[0, 0, 0]}
          center
          distanceFactor={1} // Tăng distanceFactor để panel nhỏ lại, rõ nét hơn
          transform
          occlude
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.95)",
              color: "white",
              padding: mobile.isMobile ? "14px" : "12px", // Tăng padding
              borderRadius: mobile.isMobile ? "10px" : "8px",
              minWidth: mobile.isMobile ? "220px" : "200px", // Tăng minWidth
              maxWidth: mobile.isMobile ? "320px" : "260px", // Tăng maxWidth
              width: "auto",
              height: "auto",
              minHeight: mobile.isMobile ? "60px" : "55px",
              maxHeight: mobile.isMobile ? "180px" : "180px",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              position: "relative",
              zIndex: 1000,
              overflow: "hidden",
              wordWrap: "break-word",
              // backdropFilter: "blur(8px)", // Tạm thời bỏ blur để chữ rõ hơn
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
          

            {/* Title */}
            <h3 style={{
              margin: "0 0 10px 0",
              fontSize: mobile.isMobile ? "25px" : "20px", // Tăng font-size
              fontWeight: "700",
              color: "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0)",
              letterSpacing: "0.3px"
            }}>
              {chapter.hotspot.title || chapter.title}
            </h3>

            {/* {savedMainSceneState && (
              <div style={{
                fontSize: mobile.isMobile ? "11px" : "9px", // Tăng font-size
                color: '#888',
                marginBottom: '8px',
                fontStyle: 'italic'
              }}>
                Click X to return
              </div>
            )} */}

            {/* Description */}
            <p style={{
              // distanceFactor={0.95}, // Tăng distanceFactor để panel nhỏ lại, rõ nét hơn
              fontSize: mobile.isMobile ? "13px" : "11.5px", // Tăng font-size
              lineHeight: "1.4",
              margin: "0 0 14px 0",
              opacity: 0.97,
              wordWrap: "break-word",
              overflowWrap: "break-word",
              hyphens: "auto",
              textShadow: "0 1px 1px rgba(0,0,0,0)",
              letterSpacing: "0.2px",
              // fontWeight: 500, // Thêm dòng này
            }}>
              {chapter.hotspot.description || 'Detailed information about this component.'}
            </p>

            {/* Close button in top-right corner */}
            <button
              onClick={() => {
                onReturnToMain();
              }}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
                e.target.style.color = 'white';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.color = 'white';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ✕
            </button>

            {/* Action Buttons */}
            {/* <div style={{
              display: "flex",
              gap: "8px",
              flexDirection: "column",
              marginTop: "10px"
            }}> */}
              {/* Technical Specifications Link */}
              {/* {chapter.hotspot.link && (
                <button
                  onClick={() => {
                    window.open(chapter.hotspot.link, '_blank');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: mobile.isMobile ? '12px 16px' : '10px 14px', // Tăng padding
                    fontSize: mobile.isMobile ? '15px' : '13px', // Tăng font-size
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: mobile.isMobile ? '10px' : '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    letterSpacing: '0.3px',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Specification
                </button>
              )}
            </div>

            {/* Arrow pointer */}
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "0",
                height: "0",
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid rgba(0, 0, 0, 0.95)",
              }}
            />
          </div>
        </Html>
      </group>
      
      {/* Floating Video Screen - positioned below hotspot detail, same size as detail panel */}
      
      <VideoScreen
        position={mobile.isMobile ? [28, 4.1, -22.1] : [27.75, 4.22, -21.32]} // Positioned below detail panel
        rotation={[0, Math.PI / 1.8, 0]}
        videoId="https://vimeo.com/912200130" // YouTube backup video - replace with actual AirSmart video
        title="Thermostat"
        size={mobile.isMobile ? { width: 220, height: 124 } : { width: 340, height: 200  }}
        mobilePosition={[28, 4.1, -22.1]}
        mobileRotation={[0, Math.PI / 1.8, 0]}
        mobileSize={{ width: 220, height: 124 }}
      />

      {/* Camera for detail scene - positioned close to Smart Thermostat */}
      <PerspectiveCamera
        theatreKey="DetailCamera"
        makeDefault
        fov={mobile.isMobile ? 100 : 100} // PC: 70, Mobile: responsive
        position={mobile.isMobile ? [29.446, 4.3, -23.8] : [29.446, 4.494, -23.5]} // Mobile camera positioning
      />
    </>
  );
}
