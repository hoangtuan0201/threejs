import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { useMobile } from "../hooks/useMobile";

export function VideoScreen({
  position,
  rotation = [0, Math.PI / 1.8, 0],
  videoId,
  title = "Video Demo",
  size = { width: 80, height: 45 },
  mobilePosition,
  mobileRotation,
  mobileSize,
  fallbackVideoId = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Default fallback
}) {
  const mobile = useMobile();
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState(videoId);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setHasError(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if we're offline on mount
    if (!navigator.onLine) {
      setHasError(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Reset loading state when video changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setCurrentVideoId(videoId);
  }, [videoId]);

  // Auto-fallback when error occurs
  useEffect(() => {
    if (hasError && currentVideoId === videoId && fallbackVideoId !== videoId) {
      console.log('Switching to fallback video:', fallbackVideoId);
      setCurrentVideoId(fallbackVideoId);
      setHasError(false);
      setIsLoading(true);
    }
  }, [hasError, currentVideoId, videoId, fallbackVideoId]);

  // Extract video ID and type (YouTube or Vimeo)
  const extractVideoInfo = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      return { type: 'youtube', id: url.split('v=')[1].split('&')[0] };
    } else if (url.includes('youtu.be/')) {
      return { type: 'youtube', id: url.split('youtu.be/')[1].split('?')[0] };
    } else if (url.includes('vimeo.com/')) {
      // Vimeo URL: https://vimeo.com/912200130
      const match = url.match(/vimeo.com\/(\d+)/);
      if (match) {
        return { type: 'vimeo', id: match[1] };
      }
    }
    // Default: assume YouTube video ID
    return { type: 'youtube', id: url };
  };

  const { type: videoType, id: finalVideoId } = extractVideoInfo(currentVideoId);

  // Embed URL for YouTube or Vimeo with better parameters
  const embedUrl = videoType === 'youtube'
    ? `https://www.youtube.com/embed/${finalVideoId}?autoplay=1&loop=1&playlist=${finalVideoId}&mute=0&controls=1&rel=0&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`
    : `https://player.vimeo.com/video/${finalVideoId}?autoplay=1&loop=1&title=0&byline=0&portrait=0&muted=0&controls=1&background=0`;

  // Use mobile-specific values if available and on mobile
  const finalPosition = mobile.isMobile && mobilePosition ? mobilePosition : position;
  const finalRotation = mobile.isMobile && mobileRotation ? mobileRotation : rotation;
  const finalSize = mobile.isMobile && mobileSize ? mobileSize : size;

  return (
    <group position={finalPosition} rotation={finalRotation}>
      {/* TV screen as HTML plane */}
      <Html distanceFactor={mobile.isMobile ? 1.5 : 2} position={[0, 0, 0]} transform occlude>
        <div
          style={{
            width: finalSize.width,
            height: finalSize.height,
            background: '#111',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => {
            if (videoType === 'youtube') {
              window.open(`https://www.youtube.com/watch?v=${finalVideoId}`, '_blank');
            } else if (videoType === 'vimeo') {
              window.open(`https://vimeo.com/${finalVideoId}`, '_blank');
            } else {
              window.open(`#`, '_blank');
            }
          }}
          title="Xem video lớn"
        >
          {hasError || !isOnline ? (
            <div
              style={{
                width: finalSize.width,
                height: finalSize.height,
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: mobile.isMobile ? '12px' : '14px',
                textAlign: 'center',
                padding: mobile.isMobile ? '15px' : '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid #333'
              }}
              onClick={() => {
                const { type: vType, id: vId } = extractVideoInfo(videoId);
                if (vType === 'youtube') {
                  window.open(`https://www.youtube.com/watch?v=${vId}`, '_blank');
                } else if (vType === 'vimeo') {
                  window.open(`https://vimeo.com/${vId}`, '_blank');
                } else {
                  window.open(`#`, '_blank');
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.borderColor = '#555';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.borderColor = '#333';
              }}
            >
              <div>
                <div style={{ marginBottom: '10px', fontSize: '18px' }}>📺</div>
                <div>Video không khả dụng</div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                  {!isOnline ? 'Không có kết nối internet' : 'Lỗi tải video'}
                </div>
                <div style={{ fontSize: mobile.isMobile ? '10px' : '11px', opacity: 0.6, marginTop: '8px', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                  Click để xem trên {videoType === 'youtube' ? 'YouTube' : 'Vimeo'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ position: 'relative', width: finalSize.width, height: finalSize.height }}>
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title={title}
                style={{
                  display: 'block',
                  borderRadius: '8px',
                  border: 'none',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                allow={videoType === 'youtube'
                  ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  : 'autoplay; fullscreen; picture-in-picture'}
                allowFullScreen
                onError={() => {
                  console.error('Video failed to load:', embedUrl);
                  setHasError(true);
                  setIsLoading(false);
                }}
                onLoad={() => {
                  console.log('Video loaded successfully:', embedUrl);
                  setHasError(false);
                  setIsLoading(false);
                }}
                loading="lazy"
              />
              {/* Loading overlay */}
              {isLoading && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: mobile.isMobile ? '11px' : '12px',
                    borderRadius: '8px',
                    pointerEvents: 'none',
                    transition: 'opacity 0.3s ease',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #fff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <div>Đang tải video...</div>
                  <style>
                    {`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                </div>
              )}
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 0,
              width: '100%',
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 16,
              textShadow: '0 2px 8px #000',
              pointerEvents: 'none',
            }}
          >
            {title}
          </div>
        </div>
      </Html>
    </group>
  );
}
