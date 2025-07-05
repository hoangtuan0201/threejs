// No imports needed for this simple component

const ChapterNavigation = ({ currentPosition, onNavigate, mobile, isVisible, isLocked }) => {
  if (!isVisible) return null;

  const chapters = [
    { position: 1, label: "Thermostat" },
    { position: 2, label: "Linear Grille" },
    { position: 4, label: "Air Purification" },
    { position: 6.5, label: "Outdoor Unit" }
  ];

  const currentIndex = chapters.findIndex(chapter =>
    Math.abs(currentPosition - chapter.position) < 0.3
  );

  const canGoBack = currentIndex > 0 && !isLocked;
  const canGoForward = currentIndex < chapters.length - 1 && !isLocked;

  const handlePrevious = () => {
    if (canGoBack) {
      const targetPosition = chapters[currentIndex - 1].position;
      onNavigate(targetPosition);
    }
  };

  const handleNext = () => {
    if (canGoForward) {
      const targetPosition = chapters[currentIndex + 1].position;
      onNavigate(targetPosition);
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

  return (
    <>
      {/* Left Arrow - Previous Chapter */}
      <button
        onClick={handlePrevious}
        style={{
          ...buttonStyle,
          left: mobile.isMobile ? '15px' : '20px',
          ...(isLocked ? lockedStyle : canGoBack ? {} : disabledStyle),
        }}
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
      >
        ←
      </button>

      {/* Right Arrow - Next Chapter */}
      <button
        onClick={handleNext}
        style={{
          ...buttonStyle,
          right: mobile.isMobile ? '15px' : '20px',
          ...(isLocked ? lockedStyle : canGoForward ? {} : disabledStyle),
        }}
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
      >
        →
      </button>

      {/* Chapter Indicator */}
      {currentIndex >= 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: mobile.isMobile ? '20px' : '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: isLocked ? 'rgba(255, 165, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: mobile.isMobile ? '8px 16px' : '6px 12px',
            borderRadius: '20px',
            fontSize: mobile.isMobile ? '14px' : '12px',
            fontWeight: 'bold',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          {isLocked ? 'Scene Locked - Observing...' : chapters[currentIndex].label}
        </div>
      )}
    </>
  );
};

export default ChapterNavigation;
