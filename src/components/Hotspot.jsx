import { useState } from "react";
import { Html } from "@react-three/drei";

export function Hotspot({
  position,
  label = "Hotspot 1",
  description,
  link,
  videoId,
  onClick
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
    if (onClick) {
      onClick();
    }
  };

  // Extract video ID from YouTube URL if full URL is provided
  const extractVideoId = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    return url; // Assume it's already a video ID
  };

  const finalVideoId = extractVideoId(videoId);
  const youtubeUrl = finalVideoId ? `https://www.youtube.com/watch?v=${finalVideoId}` : null;

  return (
    <Html position={position} center>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Red dot hotspot */}
        <div
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: "#ff4444",
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
            transform: isHovered ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.2s ease",
            animation: "pulse 2s infinite",
          }}
        />
        
        {/* Label */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
            opacity: isHovered ? 1 : 0.9,
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
        >
          {label}
        </div>

        {/* Enhanced Tooltip when clicked */}
        {isClicked && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: "8px",
              background: "rgba(0, 0, 0, 0.95)",
              color: "white",
              padding: "16px",
              borderRadius: "12px",
              fontSize: "14px",
              maxWidth: "320px",
              minWidth: "280px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              zIndex: 1000,
            }}
          >
            {/* Title */}
            <div style={{
              marginBottom: "8px",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#fff"
            }}>
              {label}
            </div>

            {/* Description */}
            {description && (
              <div style={{
                fontSize: "13px",
                opacity: 0.9,
                marginBottom: "12px",
                lineHeight: "1.4"
              }}>
                {description}
              </div>
            )}

            {/* YouTube Video Preview */}
            {finalVideoId && (
              <div style={{ marginBottom: "12px" }}>
                <div style={{
                  fontSize: "12px",
                  color: "#ff4444",
                  marginBottom: "6px",
                  fontWeight: "500"
                }}>
                  📺 Video Demo
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "140px",
                    background: "#000",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "2px solid #333",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.youtube.com/watch?v=${finalVideoId}`, '_blank');
                  }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${finalVideoId}/mqdefault.jpg`}
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
                      width: "48px",
                      height: "48px",
                      background: "rgba(255, 0, 0, 0.8)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "20px",
                      pointerEvents: "none",
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
              gap: "8px",
              flexDirection: "column"
            }}>
              {/* YouTube Link Button */}
              {finalVideoId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.youtube.com/watch?v=${finalVideoId}`, '_blank');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12px',
                    background: 'rgba(255, 0, 0, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  📺 Watch Youtube Video
                </button>
              )}

              {/* Specs Link Button */}
              {link && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(link, '_blank');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{
                    display: 'inline-block', width: '16px', height: '16px',
                    borderRadius: '50%', border: '1.5px solid white',
                    textAlign: 'center', lineHeight: '14px',
                    fontWeight: 'bold', fontFamily: 'monospace'
                  }}>i</span>
                  View Technical Specifications
                </button>
              )}
            </div>

            {/* Arrow pointer */}
            <div
              style={{
                position: "absolute",
                top: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "0",
                height: "0",
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: "6px solid rgba(0, 0, 0, 0.95)",
              }}
            />
          </div>
        )}

        {/* CSS for pulse animation */}
        <style>
          {`
            @keyframes pulse {
              0%, 100% {
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(255, 68, 68, 0.7);
              }
              50% {
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 8px rgba(255, 68, 68, 0);
              }
            }
          `}
        </style>
      </div>
    </Html>
  );
}
