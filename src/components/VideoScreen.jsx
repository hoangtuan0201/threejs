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
  mobileSize
}) {
  const mobile = useMobile();
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  // Extract video ID from YouTube URL if full URL is provided
  const extractVideoId = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    return url; // Assume it's already a video ID
  };

  const finalVideoId = extractVideoId(videoId);

  // YouTube embed URL with autoplay, loop, and audio enabled
  const embedUrl = `https://www.youtube.com/embed/${finalVideoId}?autoplay=1&loop=1&playlist=${finalVideoId}&mute=0&controls=1&rel=0&modestbranding=1`;

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
            border: '3px solid #444',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => window.open(`https://www.youtube.com/watch?v=${finalVideoId}`, '_blank')}
          title="Xem video lớn"
        >
          {hasError || !isOnline ? (
            <div
              style={{
                width: size.width,
                height: size.height,
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                textAlign: 'center',
                padding: '20px',
                border: '2px solid #333',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                const finalVideoId = videoId.includes('youtube.com')
                  ? videoId.split('v=')[1]?.split('&')[0]
                  : videoId;
                window.open(`https://www.youtube.com/watch?v=${finalVideoId}`, '_blank');
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
                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                  Click để xem trên YouTube
                </div>
              </div>
            </div>
          ) : (
            <iframe
              width={size.width}
              height={size.height}
              src={embedUrl}
              title={title}
              style={{ display: 'block', borderRadius: '8px', border: 'none', transform: 'scale(0.8)' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setHasError(true)}
              onLoad={() => setHasError(false)}
            />
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
