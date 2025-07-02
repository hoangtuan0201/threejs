import { Suspense, useState, useEffect, useRef } from "react";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { Html } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";

import { Model } from "./Model";
import { ThermostatTooltip } from "./ThermostatTooltip";
import { VideoScreen } from "./VideoScreen";
import { sequenceChapters } from "../data/sequenceChapters";


export function Scene({ isExploring, onTourEnd, onHideControlPanel, onShowControlPanel }) {
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetPosition, setTargetPosition] = useState(0); // Target position for smooth scrolling
  const [scrollDebug, setScrollDebug] = useState(""); // Debug scroll events
  const [showThermostatTooltip, setShowThermostatTooltip] = useState(false); // Show tooltip when mesh is clicked

  // Debug log for state changes
  useEffect(() => {
    console.log("showThermostatTooltip state changed to:", showThermostatTooltip);
  }, [showThermostatTooltip]);


  const { gl } = useThree();

  const lastScrollTimeRef = useRef(0);
  const animationRef = useRef(null);

  // Smooth scrolling với useFrame - DISABLED FOR SEQUENCE CREATION
  useFrame(() => {
    if (!isExploring && targetPosition !== sheet.sequence.position) {
      const diff = targetPosition - sheet.sequence.position;
      const speed = 0.05; // Tốc độ smooth scrolling

      if (Math.abs(diff) > 0.001) {
        sheet.sequence.position += diff * speed;
      } else {
        sheet.sequence.position = targetPosition;
      }
    }
  });

  // Effect để bắt đầu và reset tour
  useEffect(() => {
    if (isExploring) {
      setCurrentChapterIndex(0);
      setActiveChapter(null);
      // Di chuyển đến chapter đầu tiên
      moveToChapter(0);
    } else {
      // Reset trạng thái khi tour kết thúc
      setCurrentChapterIndex(-1);
      setActiveChapter(null);
      setIsAnimating(false);

      // Cancel animation nếu đang chạy
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      // Reset camera về vị trí ban đầu
      sheet.sequence.position = 0;
      setTargetPosition(0);
      // Hiển thị lại ControlPanel khi thoát explore mode
      if (onShowControlPanel) {
        onShowControlPanel();
      }
    }
  }, [isExploring]);

  // Khởi tạo targetPosition
  useEffect(() => {
    const currentPos = sheet.sequence.position;
    console.log('Initializing targetPosition - sheet.sequence.position:', currentPos, 'type:', typeof currentPos);

    if (isNaN(currentPos) || currentPos === undefined) {
      console.log('Setting targetPosition to 0 (fallback)');
      setTargetPosition(0);
    } else {
      console.log('Setting targetPosition to:', currentPos);
      setTargetPosition(currentPos);
    }
  }, [sheet.sequence]);

  // Hàm di chuyển camera đến chapter (tiến và lùi)
  const moveToChapter = async (chapterIndex) => {
    if (chapterIndex < 0 || chapterIndex >= sequenceChapters.length) return;

    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    setIsAnimating(true);
    setActiveChapter(null);


    const chapter = sequenceChapters[chapterIndex];
    const currentPos = sheet.sequence.position;
    const targetPos = chapter.range[1]; // The end of the target chapter's range

    // Determine animation range and direction
    const range = [Math.min(currentPos, targetPos), Math.max(currentPos, targetPos)];
    const direction = currentPos < targetPos ? 'normal' : 'reverse';

    console.log(`Moving to chapter ${chapterIndex}: from ${currentPos} to ${targetPos}`);

    try {
      animationRef.current = sheet.sequence.play({
        range: range,
        rate: 1.5,
        direction: direction
      });

      await animationRef.current;

      // Animation hoàn thành, hiển thị tooltip
      setActiveChapter(chapter);
      console.log(`Successfully moved to chapter ${chapterIndex}`);

    } catch (error) {
      console.warn("Animation interrupted:", error);
      // On interruption, snap to the target position and show the chapter
      sheet.sequence.position = targetPos;
      setActiveChapter(chapter);
    } finally {
      setIsAnimating(false);
      animationRef.current = null;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isExploring) return;

    const handleKeyDown = (event) => {
      if (isAnimating) return;

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onTourEnd();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExploring, currentChapterIndex, isAnimating, onTourEnd]);

  // Xử lý scroll cho chế độ preview (trước khi explore)
  useEffect(() => {
    if (isExploring) return; // Chỉ hoạt động khi KHÔNG explore

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      console.log('Preview scroll detected:', event.deltaY, 'targetPosition:', targetPosition); // Debug log
      setScrollDebug(`Scroll: ${event.deltaY} at ${Date.now()}`);

      // Ẩn ControlPanel khi bắt đầu scroll trong preview mode
      if (onHideControlPanel) {
        onHideControlPanel();
      }

      const deltaY = event.deltaY;
      const scrollSensitivity = 0.003; // Giảm độ nhạy scroll để phù hợp với speed mới

      // Sử dụng functional update để đảm bảo có giá trị mới nhất
      setTargetPosition(prevTarget => {
        // Kiểm tra targetPosition trước khi tính toán
        if (isNaN(prevTarget)) {
          console.warn('prevTarget is NaN, resetting to 0');
          return 0;
        }

        // Tính toán vị trí mới dựa trên targetPosition hiện tại
        let newPosition = prevTarget + (deltaY * scrollSensitivity);

        // Giới hạn trong khoảng [0, 6] (toàn bộ sequence)
        newPosition = Math.max(0, Math.min(6, newPosition));

        console.log('Setting target position from', prevTarget, 'to:', newPosition); // Debug log

        // Hiển thị lại ControlPanel nếu scroll về vị trí ban đầu
        if (newPosition === 0 && onShowControlPanel) {
          onShowControlPanel();
        }

        return newPosition;
      });
    };

    // Thêm listener cho cả document và canvas để đảm bảo capture được scroll
    const canvas = gl.domElement;
    console.log('Adding preview scroll listener'); // Debug log

    // Thử cả document và canvas
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    canvas.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      console.log('Removing preview scroll listener'); // Debug log
      document.removeEventListener('wheel', handleWheel, { capture: true });
      canvas.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [isExploring, gl.domElement]);

  // Xử lý scroll cho chế độ explore (step-by-step)
  useEffect(() => {
    if (!isExploring) return; // Chỉ hoạt động khi explore

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (isAnimating) {
        console.log('Ignoring scroll - currently animating');
        return;
      }

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTimeRef.current;

      // Throttle scroll events
      if (timeSinceLastScroll < 300) {
        return;
      }

      lastScrollTimeRef.current = now;

      const deltaY = event.deltaY;

      if (deltaY > 20) { // Scroll down
        handleNext();
      } else if (deltaY < -20) { // Scroll up
        handlePrevious();
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [isExploring, currentChapterIndex, isAnimating, gl.domElement]);

  const isLastChapter = currentChapterIndex === sequenceChapters.length - 1;
  const isFirstChapter = currentChapterIndex === 0;

  const handleNext = async () => {
    if (isAnimating) return;
    if (currentChapterIndex < sequenceChapters.length - 1) {
      const newIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(newIndex);
      await moveToChapter(newIndex);
    }
  };

  const handlePrevious = async () => {
    if (isAnimating) return;
    if (currentChapterIndex > 0) {
      const newIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(newIndex);
      await moveToChapter(newIndex);
    }
  };

  const handleFinish = () => {
    onTourEnd();
  };

  return (
    <>
      <color attach="background" args={["#84a4f4"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />
      <fog attach="fog" color="#84a4f4" near={0} far={40} />

      <Suspense fallback={null}>
        <Model
          sequenceChapters={sequenceChapters}
          onChapterClick={(chapterId) => {
            console.log(`Model chapter clicked: ${chapterId}`);
            // Find the chapter and activate it
            const chapterIndex = sequenceChapters.findIndex(ch => ch.id === chapterId);
            if (chapterIndex !== -1) {
              setCurrentChapterIndex(chapterIndex);
              moveToChapter(chapterIndex);
            }
          }}
          onMeshClick={(meshName) => {
            console.log(`Mesh clicked: ${meshName}, current tooltip state:`, showThermostatTooltip);
            // Toggle tooltip when Geom3D_393 is clicked
            if (meshName === "Geom3D_393") {
              console.log("Toggling tooltip from", showThermostatTooltip, "to", !showThermostatTooltip);
              setShowThermostatTooltip(!showThermostatTooltip);
            }
          }}

        />
      </Suspense>

      {/* Info Button - show when in Geom3D_393 chapter and tooltip is not visible */}
      {activeChapter && activeChapter.id === "Geom3D_393" && !showThermostatTooltip && (

        <Html position={activeChapter.hotspot.position} center>
          <button
            onClick={() => {
              console.log("Info button clicked - current state:", showThermostatTooltip);
              setShowThermostatTooltip(true);
              console.log("Setting tooltip to true");
            }}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.9)",
              border: "2px solid white",
              color: "#007BFF",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              animation: "pulse 2s infinite",
            }}
            title="Click for information"
          >
            i
          </button>
          <style jsx>{`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
          `}</style>
        </Html>
      )}

      {/* Thermostat Tooltip - show when mesh is clicked and in Geom3D_393 chapter */}
      {activeChapter && activeChapter.id === "Geom3D_393" && (
        console.log("Rendering ThermostatTooltip component - activeChapter:", activeChapter.id, "showThermostatTooltip:", showThermostatTooltip),
        <ThermostatTooltip
          position={[
             activeChapter.hotspot.position[0] , // Offset to the right
            activeChapter.hotspot.position[1] + 1, // Slightly higher
            activeChapter.hotspot.position[2] -1.25    // Slightly forward
          ]}
          chapterData={activeChapter}
          isVisible={showThermostatTooltip}
          onClose={() => setShowThermostatTooltip(false)}
        />
      )}



      {/* Video Screen - show automatically when in Geom3D_393 chapter */}
      {activeChapter && activeChapter.id === "Geom3D_393" && activeChapter.videoScreen && (
        <VideoScreen
          position={activeChapter.videoScreen.position}
          videoId={activeChapter.videoScreen.videoId}
          title={activeChapter.videoScreen.title}
          size={activeChapter.videoScreen.size}
        />
      )}



      {/* Hiển thị tooltip khi có chapter active */}
      {activeChapter && !isAnimating && (
        <Html position={activeChapter.position} center>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.85)",
              color: "white",
              padding: "20px 24px",
              borderRadius: "12px",
              maxWidth: "350px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3 style={{ 
              margin: 0, 
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              {activeChapter.title}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: "14px",
              lineHeight: "1.5",
              opacity: 0.9
            }}>
              {activeChapter.description}
            </p>
            
            {/* Floating video - hiển thị nếu chapter có videoSrc */}
            {activeChapter.videoSrc && (
              <div style={{
                margin: "8px 0",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.25)"
              }}>
                <video
                  key={activeChapter.videoSrc} // Key helps React re-render video when src changes
                  src={activeChapter.videoSrc}
                  width={280}
                  height={158}
                  controls={true} // Enable controls for sound adjustment
                  autoPlay
                  loop
                  style={{ display: "block", background: "#000" }}
                >
                  Your browser does not support video playback.
                </video>
              </div>
            )}

            

            {/* Navigation buttons */}
            <div style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px"
            }}>
              {!isFirstChapter && (
                <button 
                  onClick={handlePrevious}
                  disabled={isAnimating}
                  style={{
                    padding: "8px 16px",
                    fontSize: "12px",
                    background: isAnimating ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)",
                    color: isAnimating ? "rgba(255, 255, 255, 0.5)" : "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "6px",
                    cursor: isAnimating ? "not-allowed" : "pointer",
                    flex: 1
                  }}
                >
                  ← Previous
                </button>
              )}
              
              {isLastChapter ? (
                <button 
                  onClick={handleFinish}
                  style={{
                    padding: "8px 16px",
                    fontSize: "12px",
                    background: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  Finish
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  disabled={isAnimating}
                  style={{
                    padding: "8px 16px",
                    fontSize: "12px",
                    background: isAnimating ? "#555" : "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: isAnimating ? "not-allowed" : "pointer",
                    flex: 1
                  }}
                >
                  Next →
                </button>
              )}
            </div>
            
            {/* Progress indicator */}
            <div style={{
              fontSize: "11px",
              opacity: 0.7,
              textAlign: "center",
              marginTop: "4px"
            }}>
              {currentChapterIndex + 1} / {sequenceChapters.length}
            </div>
          </div>
        </Html>
      )}

      
      

      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[0, 0, 10]}
        fov={60}
      />
    </>
  );
}
