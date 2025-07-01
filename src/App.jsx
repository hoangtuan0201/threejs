import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import theatreState from "./theatreState.json";
import { Scene } from "./components/Scene";
import ControlPanel from "./components/ControlPanel";
import { Scroll, ScrollControls } from "@react-three/drei";

const sheet = getProject("Fly Through", { state: theatreState }).sheet("Scene");

if (import.meta.env.DEV && !window.__THEATRE_ALREADY_INIT__) {
  studio.initialize();
  studio.extend(extension);
  window.__THEATRE_ALREADY_INIT__ = true;
}

export default function App() {
  const [isExploring, setIsExploring] = useState(false);

  const startTour = () => {
    setIsExploring(true);
  };

  const endTour = () => {
    setIsExploring(false);
  };

  // Ngăn chặn scroll mặc định của trang khi đang explore
  useEffect(() => {
    if (isExploring) {
      // Vô hiệu hóa scroll của body
      document.body.style.overflow = 'hidden';
      
      console.log('Exploring mode activated - body scroll disabled');
      
      return () => {
        // Khôi phục scroll khi kết thúc tour
        document.body.style.overflow = 'auto';
        console.log('Exploring mode deactivated - body scroll restored');
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isExploring]);

  return (
    <>
      {!isExploring && <ControlPanel onExplore={startTour} />}
      
      {/* Instructions overlay when exploring */}
      {isExploring && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 100,
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            maxWidth: "300px",
            backdropFilter: "blur(5px)"
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            🎯 Hướng dẫn điều hướng
          </div>
          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
            • <strong>Cuộn chuột</strong> lên/xuống để di chuyển giữa các điểm<br/>
            • <strong>Phím mũi tên</strong> ←→↑↓ để điều hướng<br/>
            • <strong>ESC</strong> để thoát tour<br/>
            • Sử dụng nút "Tiếp theo" / "Trước" trong tooltip
          </div>
        </div>
      )}

      {/* Exit button when exploring */}
      {isExploring && (
        <button
          onClick={endTour}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 100,
            background: "rgba(255, 0, 0, 0.8)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(5px)"
          }}
          title="Thoát tour"
        >
          ×
        </button>
      )}
    
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100vw",
          height: "100vh"
        }}
        shadows
        camera={{ position: [0, 0, 10], fov: 60 }}
      >
        <SheetProvider sheet={sheet}>
          <Scene isExploring={isExploring} onTourEnd={endTour} />
        </SheetProvider>
      </Canvas>
    </>
  );
}