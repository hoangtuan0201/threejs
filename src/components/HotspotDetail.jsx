import { Html } from "@react-three/drei";
import { useMobile } from "../hooks/useMobile";

export function HotspotDetail({ selectedHotspot, onClose }) {
  const mobile = useMobile();

  if (!selectedHotspot || !selectedHotspot.hotspot) {
    return null;
  }

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <group
      position={
        mobile.isMobile
          ? (selectedHotspot.hotspot.mobileDetailPosition || selectedHotspot.hotspot.detailPosition || selectedHotspot.hotspot.position)
          : (selectedHotspot.hotspot.detailPosition || selectedHotspot.hotspot.position)
      }
      rotation={
        mobile.isMobile
          ? (selectedHotspot.hotspot.mobileDetailRotation || selectedHotspot.hotspot.detailRotation || selectedHotspot.hotspot.rotation || [0, Math.PI / 1.8, 0])
          : (selectedHotspot.hotspot.detailRotation || selectedHotspot.hotspot.rotation || [0, Math.PI / 1.8, 0])
      }
    >
      <Html
        position={[0, 0, 0]}
        center
        distanceFactor={2}
        transform
        occlude
      >
        <div
          style={{
            background: "rgba(0, 0, 0, 0.95)",
            color: "white",
            padding: mobile.isMobile ? "12px" : "10px",
            borderRadius: mobile.isMobile ? "12px" : "10px",
            minWidth: mobile.isMobile ? "280px" : "270px",
            maxWidth: mobile.isMobile ? "350px" : "330px",
            width: "auto",
            height: "auto",
            minHeight: mobile.isMobile ? "100px" : "90px",
            maxHeight: mobile.isMobile ? "220px" : "200px",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            position: "relative",
            zIndex: 1000,
            overflow: "hidden",
            wordWrap: "break-word",
            backdropFilter: "blur(8px)",
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={handleClose}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.4)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.25)';
              e.target.style.transform = 'scale(1)';
            }}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "rgba(255, 255, 255, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              width: mobile.isMobile ? "32px" : "20px", // Larger button on desktop for better usability
              height: mobile.isMobile ? "32px" : "20px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: mobile.isMobile ? "18px" : "12px", // Larger font on desktop
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000, // Ensure button is always on top
              touchAction: "manipulation", // Improve touch responsiveness
              transition: "all 0.2s ease", // Smooth hover animation
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", // Add subtle shadow
            }}
          >
            ×
          </button>

          {/* Title */}
          <h3 style={{
            margin: "0 0 8px 0",
            fontSize: mobile.isMobile ? "18px" : "15px",
            fontWeight: "700",
            color: "#fff",
            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
            letterSpacing: "0.3px"
          }}>
            {selectedHotspot.hotspot.title}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: mobile.isMobile ? "15px" : "12px",
            lineHeight: "1.5",
            margin: "0 0 14px 0",
            opacity: 0.95,
            wordWrap: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
            textShadow: "0 1px 1px rgba(0,0,0,0.6)",
            letterSpacing: "0.2px"
          }}>
            {selectedHotspot.hotspot.description}
          </p>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "6px",
            flexDirection: "column",
            marginTop: "8px" // Natural flow instead of absolute positioning
          }}>
            {/* Technical Specifications Link */}
            {selectedHotspot.hotspot.link && (
              <button
                onClick={() => {
                  window.open(selectedHotspot.hotspot.link, '_blank');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  padding: mobile.isMobile ? '12px 16px' : '8px 12px',
                  fontSize: mobile.isMobile ? '15px' : '12px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: mobile.isMobile ? '8px' : '6px',
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
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "0",
              height: "0",
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid rgba(0, 0, 0, 0.95)",
            }}
          />
        </div>
      </Html>
    </group>
  );
}
