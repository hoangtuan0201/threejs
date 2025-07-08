import { Html } from "@react-three/drei";
import { useMobile } from "../hooks/useMobile";

export function Hotspot({ chapter, onHotspotClick, selectedHotspot, currentPosition }) {
  const mobile = useMobile();

  if (!chapter || !chapter.hotspot) {
    return null;
  }

  const isSelected = selectedHotspot && selectedHotspot.id === chapter.id;

  // Hide labels at very beginning of scene to prevent see-through walls
  const shouldHideAtStart = currentPosition < 0.2;
  
  // Calculate relative label position from hotspot position
  const hotspotPosition = chapter.hotspot.position || [0, 0, 0];

  // Get absolute label position from data
  const absoluteLabelPosition = mobile.isMobile
    ? (chapter.hotspot.mobileLabelPosition || chapter.hotspot.labelPosition)
    : (chapter.hotspot.labelPosition);

  // Convert to relative position if absolute position is provided, otherwise use default
  const labelPosition = absoluteLabelPosition
    ? [
        absoluteLabelPosition[0] - hotspotPosition[0],
        absoluteLabelPosition[1] - hotspotPosition[1],
        absoluteLabelPosition[2] - hotspotPosition[2]
      ]
    : [0, 0.3, 0.1]; // Default relative position

  const labelRotation = mobile.isMobile
    ? (chapter.hotspot.mobileLabelRotation || chapter.hotspot.labelRotation || [0, 0, 0])
    : (chapter.hotspot.labelRotation || [0, 0, 0]);

  return (
    <group
      position={chapter.hotspot.position || [0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onHotspotClick(chapter.id);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHotspotClick(chapter.id);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
      }}
    >
      {/* 3D "i" shape for hotspot - created with simple geometry */}
      <group>
        {/* Dot of "i" */}
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>

        {/* Stem of "i" */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>

      {/* HTML label attached to the 3D "i" - show hotspot title only when not selected and not at start */}
      {!isSelected && !shouldHideAtStart && (
        <Html
          distanceFactor={10}
          position={labelPosition}
          rotation={labelRotation}
          occlude={true}
        >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: mobile.isMobile ? '6px 12px' : '4px 8px',
              borderRadius: mobile.isMobile ? '8px' : '6px',
              fontSize: mobile.isMobile ? '16px' : '12px',
              fontWeight: '600',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              pointerEvents: 'auto',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.3)',
              opacity: 1,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onHotspotClick(chapter.id);
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.95)';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.9)';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
            }}
          >
            {chapter.hotspot.title || chapter.title || `H${chapter.id}`}
          </div>
        </Html>
      )}
    </group>
  );
}

// HotspotsRenderer component - renders all hotspots
export function HotspotsRenderer({ sequenceChapters, onHotspotClick, selectedHotspot, currentPosition }) {
  return (
    <>
      {sequenceChapters && sequenceChapters.length > 0 && (
        sequenceChapters
          .filter(chapter => chapter.hotspot) // Only chapters with hotspot data
          .map((chapter) => (
            <Hotspot
              key={`hotspot-${chapter.id}`}
              chapter={chapter}
              onHotspotClick={onHotspotClick}
              selectedHotspot={selectedHotspot}
              currentPosition={currentPosition}
            />
          ))
      )}
    </>
  );
}
