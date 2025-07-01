import { Suspense, useState, useEffect } from "react";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { Html } from "@react-three/drei";

import { Model } from "./Model";

const sequenceChapters = [
  {
    id: "geom393",
    range: [0.1, 1],
    position: [29.5, 5, -22],
    title: "Thiết bị Điều hòa Thông minh",
    description:
      "Tự động điều chỉnh nhiệt độ và luồng gió để tối ưu hóa sự thoái mái.",
  },
  {
    id: "indoor",
    range: [1, 2],
    position: [35, 5, -18],
    title: "Indoor Unit",
    description: "Thiết bị nội bộ cấp khí mát cho phòng.",
  },
];

export function Scene({ isExploring, onTourEnd }) {
  const sheet = useCurrentSheet();
  const [activeChapter, setActiveChapter] = useState(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);

  // Effect để bắt đầu và reset tour
  useEffect(() => {
    if (isExploring) {
      setCurrentChapterIndex(0); // Bắt đầu với chương đầu tiên
    } else {
      // Reset trạng thái khi tour kết thúc
      setCurrentChapterIndex(-1);
      setActiveChapter(null);
      // Reset camera về vị trí ban đầu
      sheet.sequence.position = 0;
    }
  }, [isExploring, sheet.sequence]);

  // Effect để phát animation cho chương hiện tại
  useEffect(() => {
    const playChapter = async () => {
      if (currentChapterIndex > -1 && currentChapterIndex < sequenceChapters.length) {
        setActiveChapter(null); // Ẩn tooltip cũ trước khi phát
        const chapter = sequenceChapters[currentChapterIndex];
        await sheet.sequence.play({ range: chapter.range });
        // Khi animation kết thúc, hiển thị tooltip cho chương hiện tại
        setActiveChapter(chapter);
      }
    };

    playChapter();
  }, [currentChapterIndex, sheet.sequence]);

  const isLastChapter =
    currentChapterIndex !== -1 &&
    currentChapterIndex === sequenceChapters.length - 1;

  const handleNext = () => {
    if (currentChapterIndex < sequenceChapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
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

      {activeChapter && (
        <Html position={activeChapter.position} center>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "16px 20px",
              borderRadius: "10px",
              maxWidth: "320px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              border: "1px solid white",
            }}
          >
            <h3 style={{ margin: 0 }}>{activeChapter.title}</h3>
            <p style={{ margin: 0 }}>{activeChapter.description}</p>
            {isLastChapter ? (
              <button onClick={handleFinish} style={{ marginTop: 8 }}>
                Hoàn thành
              </button>
            ) : (
              <button onClick={handleNext} style={{ marginTop: 8 }}>Tiếp theo</button>
            )}
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