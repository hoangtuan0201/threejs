import { useRef, useEffect } from 'react';

// Individual Spotlight component for better target control
function HotspotSpotlight({ lightingConfig, hotspotPos, intensityMultiplier, lightColor }) {
  const spotlightRef = useRef();

  useEffect(() => {
    if (spotlightRef.current) {
      // Set the target position for the spotlight
      spotlightRef.current.target.position.set(hotspotPos[0], hotspotPos[1], hotspotPos[2]);
      spotlightRef.current.target.updateMatrixWorld();
    }
  }, [hotspotPos]);

  return (
    <spotLight
      ref={spotlightRef}
      position={lightingConfig.position || [hotspotPos[0], hotspotPos[1] + 2.5, hotspotPos[2]]}
      angle={lightingConfig.angle || Math.PI / 5}
      penumbra={lightingConfig.penumbra || 0.4}
      intensity={(lightingConfig.intensity || 0.6) * intensityMultiplier}
      color={lightColor}
      distance={lightingConfig.distance || 12}
      decay={lightingConfig.decay || 2}
      castShadow={lightingConfig.castShadow !== false}
    />
  );
}

// Hotspot Lighting component - adds spotlights above each hotspot
export function HotspotLighting({ sequenceChapters, selectedHotspot }) {
  return (
    <>
      {sequenceChapters && sequenceChapters.length > 0 && (
        sequenceChapters
          .filter(chapter => chapter.hotspot && chapter.lighting) // Only chapters with hotspot and lighting data
          .map((chapter) => {
            const hotspotPos = chapter.hotspot.position || [0, 0, 0];
            const lightingConfig = chapter.lighting.mainSpotlight;

            // Enhanced lighting when hotspot is selected
            const isSelected = selectedHotspot && selectedHotspot.id === chapter.id;
            const intensityMultiplier = isSelected ? 1.5 : 1;
            const lightColor = isSelected ? "#ffeee1" : (lightingConfig.color || "#ffffff");

            return (
              <group key={`hotspot-light-${chapter.id}`}>
                {/* Main spotlight using data from sequenceChapters */}
                <HotspotSpotlight
                  lightingConfig={lightingConfig}
                  hotspotPos={hotspotPos}
                  intensityMultiplier={intensityMultiplier}
                  lightColor={lightColor}
                />
              </group>
            );
          })
      )}
    </>
  );
}
