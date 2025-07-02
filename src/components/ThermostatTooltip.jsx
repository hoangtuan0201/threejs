import { Html } from "@react-three/drei";

export function ThermostatTooltip({
  position,
  chapterData,
  onClose,
  isVisible
}) {
  console.log("ThermostatTooltip - isVisible:", isVisible, "chapterData:", chapterData);

  if (!isVisible || !chapterData) {
    console.log("ThermostatTooltip not rendering");
    return null;
  }

  const { hotspot, videoScreen } = chapterData;
  console.log("ThermostatTooltip rendering - hotspot:", hotspot, "videoScreen:", videoScreen);
  console.log("ThermostatTooltip position:", position);

  return (
    <Html
      position={position}
      center={false}
      style={{
        pointerEvents: 'auto'
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "50%",
          right: "20px",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.95)",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          fontSize: "14px",
          width: "350px",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          zIndex: 10000,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            color: "white",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>

        {/* Title */}
        <div style={{ 
          marginBottom: "12px", 
          fontWeight: "bold", 
          fontSize: "18px",
          color: "#fff",
          paddingRight: "30px"
        }}>
          {hotspot?.title || "Smart Thermostat"}
        </div>
        
        {/* Description */}
        {hotspot?.description && (
          <div style={{ 
            fontSize: "13px", 
            opacity: 0.9, 
            marginBottom: "16px",
            lineHeight: "1.5"
          }}>
            {hotspot.description}
          </div>
        )}

        {/* Video Section */}
        {(hotspot?.videoId || videoScreen?.videoId) && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ 
              fontSize: "14px", 
              color: "#ff4444", 
              marginBottom: "8px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              📺 Video Demo
            </div>
            <div
              style={{
                width: "100%",
                height: "180px",
                background: "#000",
                borderRadius: "8px",
                overflow: "hidden",
                border: "2px solid #333",
                cursor: "pointer",
                position: "relative"
              }}
              onClick={(e) => {
                e.stopPropagation();
                const videoId = hotspot?.videoId || videoScreen?.videoId;
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
              }}
            >
              <img
                src={`https://img.youtube.com/vi/${hotspot?.videoId || videoScreen?.videoId}/mqdefault.jpg`}
                alt="Video thumbnail"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Play button overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",
                  height: "60px",
                  background: "rgba(255, 0, 0, 0.9)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "24px",
                  pointerEvents: "none",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)"
                }}
              >
                ▶
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: "flex", 
          gap: "10px", 
          flexDirection: "column" 
        }}>
          {/* YouTube Link Button */}
          {(hotspot?.videoId || videoScreen?.videoId) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const videoId = hotspot?.videoId || videoScreen?.videoId;
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 16px',
                fontSize: '13px',
                background: 'rgba(255, 0, 0, 0.8)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 0, 0, 1)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 0, 0, 0.8)'}
            >
              📺 Watch YouTube Video
            </button>
          )}
          
          {/* Specs Link Button */}
          {hotspot?.link && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(hotspot.link, '_blank');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 16px',
                fontSize: '13px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
            >
              <span style={{
                display: 'inline-block', 
                width: '18px', 
                height: '18px',
                borderRadius: '50%', 
                border: '2px solid white',
                textAlign: 'center', 
                lineHeight: '14px',
                fontWeight: 'bold', 
                fontSize: '12px'
              }}>i</span>
              View Technical Specifications
            </button>
          )}
        </div>

        {/* Arrow pointer */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "-8px",
            transform: "translateY(-50%)",
            width: "0",
            height: "0",
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderRight: "8px solid rgba(0, 0, 0, 0.95)",
          }}
        />
      </div>
    </Html>
  );
}
