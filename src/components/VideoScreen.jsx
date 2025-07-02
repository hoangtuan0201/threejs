import { useState } from "react";
import { Html } from "@react-three/drei";

export function VideoScreen({ position, videoId, title = "Video Demo", size = { width: 320, height: 180 } }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Extract video ID from YouTube URL if full URL is provided
  const extractVideoId = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    return url; // Assume it's already a video ID
  };

  const finalVideoId = extractVideoId(videoId);
  
  // YouTube embed URL with autoplay, loop, and audio enabled
  const embedUrl = `https://www.youtube.com/embed/${finalVideoId}?autoplay=1&loop=1&playlist=${finalVideoId}&mute=0&controls=1&rel=0&modestbranding=1`;

  return (
    <Html position={position} center>
      <div
        style={{
          position: "relative",
          background: "rgba(0, 0, 0, 0.9)",
          borderRadius: "12px",
          padding: "8px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Screen frame */}
        <div
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            background: "#000",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
            border: "3px solid #333",
          }}
        >
          {/* Video iframe */}
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              border: "none",
              borderRadius: "4px",
            }}
          />
          
          {/* Overlay with title */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              background: "linear-gradient(transparent, rgba(0, 0, 0, 0.8))",
              color: "white",
              padding: "5px 8px",
              fontSize: "12px",
              fontWeight: "500",
              opacity: isHovered ? 1 : 0.7,
              transition: "opacity 0.3s ease",
            }}
          >
            {title}
          </div>
        </div>

        

        {/* CSS for animations */}
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
