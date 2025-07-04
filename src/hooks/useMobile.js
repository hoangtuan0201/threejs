import { useState, useEffect } from 'react';

/**
 * Custom hook for mobile detection and responsive behavior
 * @returns {Object} Mobile detection and utility functions
 */
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  // Enhanced mobile detection
  const detectMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const width = window.innerWidth;
    
    // Check for mobile devices
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileDevice = mobileRegex.test(userAgent) || width < 768;
    
    // Check for tablets
    const tabletRegex = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*\bTablet\b)/i;
    const isTabletDevice = tabletRegex.test(userAgent) || (width >= 768 && width < 1024);
    
    return { isMobileDevice, isTabletDevice };
  };

  // Get device orientation
  const getOrientation = () => {
    if (screen.orientation) {
      return screen.orientation.angle === 0 || screen.orientation.angle === 180 
        ? 'portrait' : 'landscape';
    }
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  };

  // Update screen information
  const updateScreenInfo = () => {
    const { isMobileDevice, isTabletDevice } = detectMobile();
    setIsMobile(isMobileDevice);
    setIsTablet(isTabletDevice);
    setOrientation(getOrientation());
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    // Initial detection
    updateScreenInfo();

    // Event listeners
    const handleResize = () => updateScreenInfo();
    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(updateScreenInfo, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Modern orientation API
    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', handleOrientationChange);
      }
    };
  }, []);

  // Utility functions
  const getResponsiveValue = (mobile, tablet, desktop) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  const getTouchSensitivity = () => {
    if (isMobile) return 0.008;
    if (isTablet) return 0.006;
    return 0.005;
  };

  const getCameraFOV = () => {
    if (isMobile) return 110; // Moderate wide FOV for mobile
    if (isTablet) return 70;
    return 60;
  };

  const getPixelRatio = () => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    if (isMobile) return Math.min(devicePixelRatio, 2);
    return devicePixelRatio;
  };

  const getCameraPosition = () => {
    if (isMobile) return [0, 0, 5]; // Moderate zoom for mobile
    if (isTablet) return [0, 0, 8];
    return [0, 0, 10];
  };

  const isLandscape = orientation === 'landscape';
  const isPortrait = orientation === 'portrait';
  const isSmallScreen = screenSize.width < 480;
  const isMediumScreen = screenSize.width >= 480 && screenSize.width < 768;
  const isLargeScreen = screenSize.width >= 768;

  return {
    // Device detection
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    
    // Orientation
    orientation,
    isLandscape,
    isPortrait,
    
    // Screen size
    screenSize,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    
    // Utility functions
    getResponsiveValue,
    getTouchSensitivity,
    getCameraFOV,
    getPixelRatio,
    getCameraPosition,
    
    // Breakpoint helpers
    breakpoints: {
      xs: screenSize.width < 480,
      sm: screenSize.width >= 480 && screenSize.width < 768,
      md: screenSize.width >= 768 && screenSize.width < 1024,
      lg: screenSize.width >= 1024 && screenSize.width < 1440,
      xl: screenSize.width >= 1440
    }
  };
};

export default useMobile;
