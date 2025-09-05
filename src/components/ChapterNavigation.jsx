const ChapterNavigation = ({ currentPosition, onNavigate, mobile, isVisible, isLocked, selectedHotspot }) => {
  if (!isVisible) return null;

  const chapters = [
    { position: 1.5, label: "Smart Thermostat" },
    { position: 2.5, label: "Linear Grille" },
    { position: 4.5, label: "study room" },
    { position: 6, label: "living room2" },
    { position: 6.5, label: "kitchen" },
    { position: 8.3, label: "Air Purification" },
    { position: 12.4, label: "Outdoor Unit" },
    { position: 13.8, label: "bedroom" },
    { position: 16.5, label: "media" },

  ];

  const currentIndex = chapters.findIndex(chapter =>
    Math.abs(currentPosition - chapter.position) < 0.3
  );

  const canGoBack = currentIndex > 0 && !isLocked;
  const canGoForward = currentIndex < chapters.length - 1 && !isLocked;
  
  // Check if locked due to hotspot
  const isLockedByHotspot = selectedHotspot !== null;
  const isLockedByNavigation = isLocked && !isLockedByHotspot;

  const handlePrevious = () => {
    if (canGoBack) {
      const targetPosition = chapters[currentIndex - 1].position;
      // Navigation time: 7s for chapters after 2.5s, default for others
      const navigationTime = targetPosition > 8.5 ? 7000 : 3000;
      onNavigate(targetPosition, { smooth: true, stepSize: 0.3, duration: navigationTime });
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      const targetPosition = chapters[currentIndex + 1].position;
      // Navigation time: 7s for chapters after 2.5s, default for others
      const navigationTime = targetPosition > 8.5 ? 7000 : 3000;
      onNavigate(targetPosition, { smooth: true, stepSize: 0.3, duration: navigationTime });
    }
  };

  const buttonStyle = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    width: mobile.isMobile ? '50px' : '40px',
    height: mobile.isMobile ? '50px' : '40px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    fontSize: mobile.isMobile ? '20px' : '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  };

  const disabledStyle = {
    opacity: 0.3,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  };

  const lockedStyle = {
    opacity: 0.6,
    cursor: 'wait',
    pointerEvents: 'none',
    background: 'rgba(255, 165, 0, 0.6)', // Orange when locked
  };
  
  const hotspotLockedStyle = {
    opacity: 0.6,
    cursor: 'not-allowed',
    background: 'rgba(255, 0, 0, 0.6)', // Red when locked by hotspot
  };



  return (
    <>
      {/* Left Arrow - Previous Chapter */}
      <button
        onClick={handlePrevious}
        disabled={!canGoBack}
        onMouseEnter={(e) => {
          if (canGoBack) {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (canGoBack) {
            e.target.style.background = 'rgba(0, 0, 0, 0.6)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }
        }}
        style={{
          ...buttonStyle,
          left: mobile.isMobile ? '15px' : '20px',
          ...(isLockedByHotspot ? hotspotLockedStyle : isLocked ? lockedStyle : canGoBack ? {} : disabledStyle),
        }}
      >
        ←
      </button>

      {/* Right Arrow - Next Chapter */}
      <button
        onClick={handleNext}
        disabled={!canGoForward}
        onMouseEnter={(e) => {
          if (canGoForward) {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (canGoForward) {
            e.target.style.background = 'rgba(0, 0, 0, 0.6)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }
        }}
        style={{
          ...buttonStyle,
          right: mobile.isMobile ? '15px' : '20px',
          ...(isLockedByHotspot ? hotspotLockedStyle : isLocked ? lockedStyle : canGoForward ? {} : disabledStyle),
        }}
      >
        →
      </button>

     
    </>
  );
};

export default ChapterNavigation;
