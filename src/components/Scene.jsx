import { Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { val } from "@theatre/core";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { useScroll } from "@react-three/drei";
import { Model } from "./Model";

export function Scene() {
  const sheet = useCurrentSheet();
  const scroll = useScroll();

  // Callback này sẽ chạy trên mỗi frame
  useFrame(() => {
    // Lấy độ dài của sequence animation
    const sequenceLength = val(sheet.sequence.pointer.length);

    // Gán vị trí của animation với tiến trình scroll
    // scroll.offset là giá trị từ 0 (đầu trang) đến 1 (cuối trang)
    sheet.sequence.position = scroll.offset * sequenceLength;
  });

  const bgColor = "#84a4f4";

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" color={bgColor} near={0} far={40} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        position={[0, 0, 0]}
        fov={90}
        near={0.1}
        far={70}
      />
    </>
  );
}
