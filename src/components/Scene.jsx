
import { Suspense, useState, useEffect, useRef } from "react";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { Model } from "./Model";

const sequenceChapters = [
  {
    id: "start",
    range: [0, 0.1],
    position: [0, 5, 8],
    title: "Chào mừng đến với AirSmart",
    description: "Khám phá hệ thống điều hòa thông minh tiên tiến nhất.",
  },
  {
    id: "geom393", 
    range: [0.1, 1],
    position: [29.5, 5, -22],
    title: "Thiết bị Điều hòa Thông minh",
    description:
      "Tự động điều chỉnh nhiệt độ và luồng gió để tối ưu hóa sự thoải mái.",
  },
  {
    id: "indoor",
    range: [1, 2],
    position: [35, 5, -18],
    title: "Indoor Unit",
    description: "Thiết bị nội bộ cấp khí mát cho phòng với công nghệ tiết kiệm năng lượng.",
  },
  // {
  //   id: "outdoor",
  //   range: [2, 3],
  //   position: [25, 8, -30],
  //   title: "Outdoor Unit",
  //   description: "Đơn vị ngoài trời với hiệu suất cao và hoạt động êm ái.",
  // },
  // {
  //   id: "control",
  //   range: [3, 4],
  //   position: [15, 6, -15],
  //   title: "Hệ thống Điều khiển",
  //   description: "Điều khiển thông minh từ xa qua ứng dụng di động.",
  // },
];

export function Scene({ isExploring, onTourEnd }) {
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const { gl } = useThree();
  
  const scrollTimeoutRef = useRef(null);
  const lastScrollTimeRef = useRef(0);

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
      // Reset camera về vị trí ban đầu
      sheet.sequence.position = 0;
    }
  }, [isExploring]);

  // Hàm di chuyển camera đến chapter với hỗ trợ cuộn tới cuộn về
  const moveToChapter = async (chapterIndex, direction = 'forward') => {
    if (chapterIndex < 0 || chapterIndex >= sequenceChapters.length) return;
    
    setIsAnimating(true);
    setActiveChapter(null); // Ẩn tooltip hiện tại
    
    const chapter = sequenceChapters[chapterIndex];
    
    try {
      // Xác định hướng di chuyển cho animation
      const playDirection = direction === 'forward' ? 'normal' : 'reverse';
      const currentPos = sheet.sequence.position;
      const targetRange = chapter.range;
      
      // Nếu cuộn về, di chuyển từ vị trí hiện tại về target
      if (direction === 'reverse' && currentPos > targetRange[1]) {
        await sheet.sequence.play({ 
          range: [currentPos, targetRange[1]],
          rate: 1.2,
          direction: 'normal'
        });
      }
      // Nếu cuộn tới, di chuyển từ vị trí hiện tại đến target  
      else if (direction === 'forward' && currentPos < targetRange[0]) {
        await sheet.sequence.play({ 
          range: [currentPos, targetRange[1]],
          rate: 1.2,
          direction: 'normal'
        });
      }
      // Nếu đã ở gần target, chỉ cần đi đến đúng vị trí
      else {
        await sheet.sequence.play({ 
          range: targetRange,
          rate: 1,
          direction: playDirection
        });
      }
      
      // Hiển thị tooltip sau khi animation hoàn thành
      setActiveChapter(chapter);
    } catch (error) {
      console.warn("Animation interrupted:", error);
    } finally {
      setIsAnimating(false);
    }
  };

  // Thêm keyboard support để test
  useEffect(() => {
    if (!isExploring) return;

    const handleKeyDown = (event) => {
      if (isAnimating) return;
      
      let newIndex = currentChapterIndex;
      let direction = 'forward';
      
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        newIndex = Math.min(currentChapterIndex + 1, sequenceChapters.length - 1);
        direction = 'forward';
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        newIndex = Math.max(currentChapterIndex - 1, 0);
        direction = 'reverse';
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onTourEnd();
        return;
      }
      
      if (newIndex !== currentChapterIndex) {
        console.log(`Keyboard navigation: ${currentChapterIndex} -> ${newIndex} (${direction})`);
        setCurrentChapterIndex(newIndex);
        moveToChapter(newIndex, direction);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExploring, currentChapterIndex, isAnimating, onTourEnd]);

  // Xử lý sự kiện cuộn chuột
  useEffect(() => {
    if (!isExploring) return;

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      console.log('Wheel event detected:', event.deltaY); // Debug log
      
      // Không xử lý nếu đang animate
      if (isAnimating) {
        console.log('Ignoring scroll - currently animating');
        return;
      }
      
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTimeRef.current;
      
      // Throttle scroll events (giảm xuống 50ms để responsive hơn)
      if (timeSinceLastScroll < 50) return;
      
      lastScrollTimeRef.current = now;
      
      const deltaY = event.deltaY;
      let newIndex = currentChapterIndex;
      let direction = 'forward';
      
      if (Math.abs(deltaY) > 10) { // Chỉ xử lý khi scroll đủ mạnh
        if (deltaY > 0 && currentChapterIndex < sequenceChapters.length - 1) {
          // Cuộn xuống - di chuyển đến chapter tiếp theo
          newIndex = currentChapterIndex + 1;
          direction = 'forward';
        } else if (deltaY < 0 && currentChapterIndex > 0) {
          // Cuộn lên - di chuyển đến chapter trước
          newIndex = currentChapterIndex - 1;
          direction = 'reverse';
        }
        
        if (newIndex !== currentChapterIndex) {
          console.log(`Moving from chapter ${currentChapterIndex} to ${newIndex} (${direction})`);
          setCurrentChapterIndex(newIndex);
          moveToChapter(newIndex, direction);
        }
      }
    };

    // Thêm event listener cho nhiều elements
    const canvas = gl.domElement;
    const container = canvas.parentElement;
    
    // Thêm listener cho canvas và container
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    // Thêm listener cho document để đảm bảo capture mọi scroll
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    console.log('Scroll listeners added for exploring mode');
    
    // Cleanup
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      document.removeEventListener('wheel', handleWheel);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      console.log('Scroll listeners removed');
    };
  }, [isExploring, currentChapterIndex, isAnimating, gl.domElement]);

  const isLastChapter = currentChapterIndex === sequenceChapters.length - 1;
  const isFirstChapter = currentChapterIndex === 0;

  const handleNext = () => {
    if (currentChapterIndex < sequenceChapters.length - 1) {
      const newIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(newIndex);
      moveToChapter(newIndex, 'forward');
    }
  };

  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      const newIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(newIndex);
      moveToChapter(newIndex, 'reverse');
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
            
            {/* Navigation buttons */}
            <div style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px"
            }}>
              {!isFirstChapter && (
                <button 
                  onClick={handlePrevious}
                  style={{
                    padding: "8px 16px",
                    fontSize: "12px",
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "6px",
                    cursor: "pointer",
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

      {/* Loading indicator khi đang animate */}
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

      {/* Debug info - có thể xóa sau khi test */}
      {isExploring && (
        <Html
          position={[-15, 8, 0]}
          center
        >
          <div style={{
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "10px",
            fontFamily: "monospace"
          }}>
            <div>Current: {currentChapterIndex + 1}/{sequenceChapters.length}</div>
            <div>Animating: {isAnimating ? 'Yes' : 'No'}</div>
            <div>Active: {activeChapter ? activeChapter.title : 'None'}</div>
          </div>
        </Html>
      )}

      {/* Progress bar */}
      {isExploring && (
        <Html
          position={[0, -12, 0]}
          center
        >
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

      {/* Scroll hint cho người dùng */}
      {isExploring && !isAnimating && !activeChapter && (
        <Html
          position={[0, -8, 0]}
          center
        >
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