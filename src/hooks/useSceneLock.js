import { useState, useRef } from 'react';

function useSceneLock(sheet, delay = 3000) {
  const [locked, setLocked] = useState(false);
  const [targetPosition, setTargetPosition] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const startPositionRef = useRef(null);
  const startTimeRef = useRef(null);

  const lockScene = (targetPos) => {
    console.log(`Locking scene at position: ${targetPos}`);

    const clampedPos = Math.max(0, Math.min(6.7, targetPos));

    setLocked(true);
    setTargetPosition(clampedPos);
    setIsNavigating(true);

    // Store start position and time for smooth animation
    startPositionRef.current = sheet.sequence.position;
    startTimeRef.current = performance.now();

    console.log(`Starting navigation from ${startPositionRef.current} to ${clampedPos}`);

    // Unlock after delay (but keep navigating until animation completes)
    setTimeout(() => {
      console.log(`Unlocking scene after ${delay}ms`);
      setLocked(false);
    }, delay);
  };

  const completeNavigation = () => {
    console.log('🏁 completeNavigation called');
    console.log('  - Setting isNavigating to false');
    setIsNavigating(false);
    setTargetPosition(null);
    startPositionRef.current = null;
    startTimeRef.current = null;
  };

  return {
    locked,
    targetPosition,
    isNavigating,
    startPosition: startPositionRef.current,
    startTime: startTimeRef.current,
    lockScene,
    completeNavigation
  };
}

export default useSceneLock;
