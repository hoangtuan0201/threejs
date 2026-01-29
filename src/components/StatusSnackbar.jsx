import React, { useState, useEffect } from 'react';

const StatusSnackbar = ({ mode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (mode === 'focusing') {
            setMessage('Is on focusing mode');
            setIsVisible(true);
        } else if (mode === 'navigating') {
            setMessage('Is navigating');
            setIsVisible(true);
        } else {
            setIsVisible(false);
            return;
        }

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 7000);

        return () => clearTimeout(timer);
    }, [mode]);

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 2000, // High z-index to be on top of everything
                padding: '10px',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)', // Glassmorphism effect
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                pointerEvents: 'none', // Allow clicking through container
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                animation: 'fadeIn 0.3s ease-out',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}
        >
            <div
                style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: mode === 'focusing' ? '#4CAF50' : '#2196F3', // Green for focus, Blue for nav
                    boxShadow: `0 0 8px ${mode === 'focusing' ? '#4CAF50' : '#2196F3'}`
                }}
            />
            <span style={{ marginRight: '8px' }}>{message}</span>

            {/* Close Button */}
            <button
                onClick={() => setIsVisible(false)}
                style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.3)', // Circular border
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                    borderRadius: '50%',
                    transition: 'all 0.2s',
                    width: '20px', // Fixed size for perfect circle
                    height: '20px',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default StatusSnackbar;
