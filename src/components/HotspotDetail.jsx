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
            padding: "7px",
            borderRadius: "8px",
            minWidth: "200px", // Minimum width
            maxWidth: "250px", // Maximum width
            width: "auto", // Auto width based on content
            height: "auto", // Auto height based on content
            minHeight: "80px", // Minimum height
            maxHeight: "180px", // Maximum height
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            position: "relative",
            zIndex: 1000,
            overflow: "hidden",
            wordWrap: "break-word", // Break long words
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={handleClose}
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              width: mobile.isMobile ? "32px" : "14px", // Larger button on mobile for easier tap
              height: mobile.isMobile ? "32px" : "14px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: mobile.isMobile ? "18px" : "9px", // Larger font on mobile
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000, // Ensure button is always on top
              touchAction: "manipulation", // Improve touch responsiveness
            }}
          >
            ×
          </button>

          {/* Title */}
          <h3 style={{
            margin: "0 0 6px 0",
            fontSize: mobile.isMobile ? "14px" : "11px", // Keep original desktop font
            fontWeight: "bold",
            color: "#fff"
          }}>
            {selectedHotspot.hotspot.title}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: mobile.isMobile ? "12px" : "8px", // Keep original desktop font
            lineHeight: "1.4",
            margin: "0 0 12px 0",
            opacity: 0.9,
            wordWrap: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto"
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
                  gap: '4px', // Even smaller gap
                  width: '100%',
                  padding: mobile.isMobile ? '10px 12px' : '3px 5px', // Very small padding on desktop
                  fontSize: mobile.isMobile ? '14px' : '8px', // Very small font on desktop
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: mobile.isMobile ? '6px' : '3px', // Very small border radius on desktop
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
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
