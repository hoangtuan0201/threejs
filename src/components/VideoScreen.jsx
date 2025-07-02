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
    <group position={position}>
      {/* 3D Sphere to replace video screen */}
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={() => {
          // Open video in new tab when sphere is clicked
          window.open(`https://www.youtube.com/watch?v=${finalVideoId}`, '_blank');
        }}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color={isHovered ? "#ff6b6b" : "#4dabf7"}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* HTML label for the sphere */}
      <Html distanceFactor={10} position={[0, 0.5, 0]}>
        <div
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.3s ease",
          }}
        >
          🎥 {title}
        </div>
      </Html>
    </group>
  );
}
