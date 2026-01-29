import { useMemo } from 'react';
import { useMobile } from './useMobile';

/**
 * Custom hook for responsive HDR configuration
 * Provides optimized settings based on device capabilities
 */
export function useHDRConfig() {
  const mobile = useMobile();

  const config = useMemo(() => {
    // Detect device performance level
    const getPerformanceLevel = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return 'low';
      
      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);
      
      // High-end mobile devices
      if (mobile.isMobile) {
        if (renderer.includes('Adreno 6') || 
            renderer.includes('Mali-G7') || 
            renderer.includes('Apple A1') ||
            renderer.includes('Apple M')) {
          return 'medium';
        }
        return 'low';
      }
      
      // Desktop performance detection
      if (renderer.includes('RTX') || 
          renderer.includes('GTX 1060') ||
          renderer.includes('RX 5') ||
          renderer.includes('Intel Iris')) {
        return 'high';
      }
      
      return 'medium';
    };

    const performanceLevel = getPerformanceLevel();
    
    // Base configuration for different performance levels
    const configs = {
      low: {
        // Mobile/low-end settings
        hdr: {
          enabled: true,
          intensity: 0.7,
          toneMappingExposure: 0.8,
          backgroundIntensity: 0.1,
        },
        shadows: {
          enabled: true,
          type: 'basic', // PCFShadowMap
          mapSize: 512,
          autoUpdate: false,
          bias: -0.001,
        },
        rendering: {
          pixelRatio: Math.min(window.devicePixelRatio, 1.5),
          antialias: false,
          powerPreference: 'high-performance',
        },
        materials: {
          envMapIntensity: 0.6,
          roughnessCorrection: 0.1,
        }
      },
      
      medium: {
        // Mid-range settings
        hdr: {
          enabled: true,
          intensity: 0.9,
          toneMappingExposure: 0.9,
          backgroundIntensity: 0.2,
        },
        shadows: {
          enabled: true,
          type: 'soft', // PCFSoftShadowMap
          mapSize: 1024,
          autoUpdate: true,
          bias: -0.0005,
        },
        rendering: {
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          antialias: true,
          powerPreference: 'high-performance',
        },
        materials: {
          envMapIntensity: 0.8,
          roughnessCorrection: 0.05,
        }
      },
      
      high: {
        // High-end desktop settings
        hdr: {
          enabled: true,
          intensity: 1.0,
          toneMappingExposure: 1.0,
          backgroundIntensity: 0.3,
        },
        shadows: {
          enabled: true,
          type: 'soft', // PCFSoftShadowMap
          mapSize: 2048,
          autoUpdate: true,
          bias: -0.0002,
        },
        rendering: {
          pixelRatio: window.devicePixelRatio,
          antialias: true,
          powerPreference: 'high-performance',
        },
        materials: {
          envMapIntensity: 1.0,
          roughnessCorrection: 0,
        }
      }
    };

    return {
      ...configs[performanceLevel],
      performanceLevel,
      isMobile: mobile.isMobile,
      isTablet: mobile.isTablet,
    };
  }, [mobile.isMobile, mobile.isTablet]);

  return config;
}

/**
 * Hook for adaptive quality settings
 * Automatically adjusts quality based on performance
 */
export function useAdaptiveQuality() {
  const config = useHDRConfig();
  
  const adjustQualityForPerformance = (frameTime) => {
    // If frame time is too high (> 33ms = 30fps), reduce quality
    if (frameTime > 40) {
      return {
        ...config,
        hdr: {
          ...config.hdr,
          intensity: config.hdr.intensity * 0.8,
        },
        shadows: {
          ...config.shadows,
          mapSize: Math.max(config.shadows.mapSize / 2, 256),
        },
        materials: {
          ...config.materials,
          envMapIntensity: config.materials.envMapIntensity * 0.8,
        }
      };
    }
    
    return config;
  };
  
  return {
    config,
    adjustQualityForPerformance,
  };
}
