import { Suspense, useState, useEffect, useRef } from "react";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { Model } from "./Model";
import { sequenceChapters } from "../data/sequenceChapters";


export function Scene({ isExploring, onTourEnd }) {
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const { gl } = useThree();
  
  const lastScrollTimeRef = useRef(0);
  const animationRef = useRef(null);

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
    }
  }, [isExploring]);

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

  // Xử lý scroll (tiến và lùi)
  useEffect(() => {
    if (!isExploring) return;

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
        <Model />
      </Suspense>

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
                  key={activeChapter.videoSrc} // Key giúp React re-render video khi src thay đổi
                  src={activeChapter.videoSrc}
                  width={280}
                  height={158}
                  controls={false} // Tắt controls để giống màn hình TV
                  autoPlay
                  muted // Autoplay thường yêu cầu muted
                  loop
                  style={{ display: "block", background: "#000" }}
                >
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              </div>
            )}

            {/* Hotspot button - hiển thị nếu chapter có hotspotLink */}
            {activeChapter.hotspotLink && (
              <div style={{ marginTop: "4px" }}>
                <button
                  onClick={() => window.open(activeChapter.hotspotLink, '_blank')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 16px',
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
                  Xem thông số kỹ thuật
                </button>
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
                  ← Trước
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
                  Hoàn thành
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
                  Tiếp theo →
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

      {/* Loading indicator */}
      {isAnimating && (
        <Html center>
          <div style={{
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "16px 24px",
            borderRadius: "12px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <div style={{
              width: "20px",
              height: "20px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderTop: "2px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            Đang di chuyển camera...
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        </Html>
      )}

      {/* Progress bar */}
      {isExploring && (
        <Html position={[0, -12, 0]} center>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0, 0, 0, 0.6)",
            padding: "8px 16px",
            borderRadius: "20px",
            backdropFilter: "blur(5px)"
          }}>
            <div style={{ 
              color: "white", 
              fontSize: "12px",
              minWidth: "40px"
            }}>
              {currentChapterIndex + 1}/{sequenceChapters.length}
            </div>
            <div style={{
              width: "120px",
              height: "4px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "2px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${((currentChapterIndex + 1) / sequenceChapters.length) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #007BFF, #00D4FF)",
                borderRadius: "2px",
                transition: "width 0.3s ease"
              }}></div>
            </div>
          </div>
        </Html>
      )}

      {/* Scroll hint */}
      {isExploring && !isAnimating && !activeChapter && (
        <Html position={[0, -8, 0]} center>
          <div style={{
            color: "white",
            fontSize: "14px",
            textAlign: "center",
            opacity: 0.8,
            background: "rgba(0, 0, 0, 0.6)",
            padding: "12px 20px",
            borderRadius: "8px",
            backdropFilter: "blur(5px)",
            animation: "pulse 2s infinite"
          }}>
            <div style={{ marginBottom: "4px" }}>🎯 Sẵn sàng khám phá!</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              Cuộn chuột hoặc dùng phím mũi tên để bắt đầu
            </div>
            <style>
              {`
                @keyframes pulse {
                  0%, 100% { opacity: 0.8; }
                  50% { opacity: 1; }
                }
              `}
            </style>
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