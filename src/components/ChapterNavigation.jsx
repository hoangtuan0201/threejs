// No imports needed for this simple component

const ChapterNavigation = ({ currentPosition, onNavigate, mobile, isVisible, isLocked }) => {
  if (!isVisible) return null;

  const chapters = [
    { position: 0.1, label: "Start" }, // Vị trí ban đầu
    { position: 1.5, label: "Smart Thermostat" },
    { position: 2.5, label: "Linear Grille" },
    { position: 4.5, label: "study room" },
    { position: 6, label: "living room2" },
    { position: 6.7, label: "kitchen" },
    { position: 8.4, label: "Air Purification" },
    { position: 12.4, label: "Outdoor Unit" },
    { position: 13.9, label: "bedroom" },
    { position: 16.4, label: "media" },
    { position: 17.3, label: "road to the gym" },
    { position: 18.1, label: "Gym" },
  ];

  const currentIndex = chapters.findIndex(
    (chapter) => Math.abs(currentPosition - chapter.position) < 0.3
  );

  // Chỉ hiện nút back khi đã tới chapter 1 (Smart Thermostat) trở lên
  const canGoBack = currentIndex >= 1; // Index 1 là Smart Thermostat
  const canGoForward = currentIndex < chapters.length - 1;

  const handlePrevious = () => {
    if (canGoBack && !isLocked) {
      const targetPosition = chapters[currentIndex - 1].position;
      const navigationTime = targetPosition > 8 ? 5000 : 3000;
      onNavigate(targetPosition, { smooth: true, stepSize: 0.3, duration: navigationTime });
    }
  };

  const handleNext = () => {
    if (canGoForward && !isLocked) {
      const targetPosition = chapters[currentIndex + 1].position;
      const navigationTime = targetPosition > 8 ? 5000 : 3000;
      onNavigate(targetPosition, { smooth: true, stepSize: 0.3, duration: navigationTime });
    }
  };

  const ChevronLeft = () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  );

  const ChevronRight = () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  );

  const buttonStyle = {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    width: "80px",
    height: "75px",
    borderRadius: "50%",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(0, 0, 0, 0.6)",
    color: "white",
    fontSize: mobile.isMobile ? "20px" : "16px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  };

  const disabledStyle = {
    display: "none",
  };

  const lockedStyle = {
    opacity: 0.6,
    cursor: "wait",
    pointerEvents: "none",
    background: "rgba(255, 165, 0, 0.6)", // Orange when locked
  };

  return (
    <>
      {/* Left Arrow - Previous Chapter */}
      <button
        onClick={handlePrevious}
        style={{
          ...buttonStyle,
          left: mobile.isMobile ? "15px" : "20px",
          ...(canGoBack ? (isLocked ? lockedStyle : {}) : disabledStyle),
        }}
      >
        <ChevronLeft />
      </button>

      {/* Right Arrow - Next Chapter */}
      <button
        onClick={handleNext}
        style={{
          ...buttonStyle,
          right: mobile.isMobile ? "15px" : "20px",
          ...(canGoForward ? (isLocked ? lockedStyle : {}) : disabledStyle),
        }}
      >
        <ChevronRight />
      </button>
    </>
  );
};

export default ChapterNavigation;
