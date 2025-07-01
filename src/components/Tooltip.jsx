import React from "react";
import { Html } from "@react-three/drei";

export function Tooltip({ chapter, isPinned, onClose }) {
  if (!chapter) return null;

  return (
    <Html
      position={chapter.position}
      transform // Giúp tooltip dính vào mô hình và di chuyển theo camera
      occlude // Ẩn nếu bị che
      distanceFactor={10} // Giảm/ tăng độ to nhỏ khi camera zoom
    >
      <div
        style={{
          position: "relative",
          background: "rgba(0, 0, 0, 0.85)",
          color: "white",
          padding: "14px 20px",
          borderRadius: "10px",
          maxWidth: "320px",
          border: "1px solid white",
        }}
      >
        {isPinned && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        )}
        <b style={{ fontSize: "17px" }}>{chapter.title}</b>
        <p style={{ fontSize: "14px", marginTop: "6px" }}>
          {chapter.description}
        </p>
      </div>
    </Html>
  );
}
