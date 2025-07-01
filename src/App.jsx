import { Canvas } from "@react-three/fiber";
import { getProject } from "@theatre/core";
import theatreState from "./states/Fly Through.theatre-project-state2.json";
import studio from "@theatre/studio";
import { SheetProvider } from "@theatre/r3f";
import { ScrollControls } from "@react-three/drei";
import { Scene } from "./components/Scene"; 

export default function App() {
  // Bạn có thể đổi theatreState tại đây để dùng animation khác
  const sheet = getProject("Fly Through", { state: theatreState }).sheet(
    "Scene"
  );

  // if (import.meta.env.DEV) {
  //   studio.initialize();
  // }

  return (
    <Canvas gl={{ preserveDrawingBuffer: true }} style={{ height: "100vh" }}>
      <ScrollControls pages={5} damping={0.3}>
        <SheetProvider sheet={sheet}>
          <Scene />
        </SheetProvider>
      </ScrollControls>
    </Canvas>
  );
}
