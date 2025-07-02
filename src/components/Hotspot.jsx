import { useState } from "react";
import { Html } from "@react-three/drei";

export function Hotspot({
  position,
  label = "Hotspot 1",
  onClick
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <group position={position}>
      {/* 3D Sphere hotspot */}
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color={isHovered ? "#ff6b6b" : "#ff4444"}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* HTML label for the sphere */}
      <Html distanceFactor={10} position={[0, 0.2, 0]}>
        <div style={{ position: "relative" }}>
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
              pointerEvents: "none",
            }}
          >
            {label}
          </div>


        </div>
      </Html>
    </group>
  );
}
