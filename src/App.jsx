import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SheetProvider } from "@theatre/r3f";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import theatreState from "./theatreState.json";
import { Scene } from "./components/Scene";
import ControlPanel from "./components/ControlPanel";

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

  return (
    <>
      {!isExploring && <ControlPanel onExplore={startTour} />}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        shadows
      >
        <SheetProvider sheet={sheet}>
          <Scene isExploring={isExploring} onTourEnd={endTour} />
        </SheetProvider>
      </Canvas>
    </>
  );
}
