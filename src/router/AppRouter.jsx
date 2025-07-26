import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeContext';
import Homepage from '../pages/Homepage';
import CompareSystem from '../pages/CompareSystem';
import App from '../App'; // 3D Experience

const AppRouter = () => {
  const [isChatFocused, setIsChatFocused] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function(d, t) {
        var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
        v.onload = function() {
          window.voiceflow.chat.load({
            verify: { projectID: '681b3d6dda61d6d332c798a0' },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production',
            voice: {
              url: "https://runtime-api.voiceflow.com"
            }
          });
        }
        v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
      })(document, 'script');
    `;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Homepage Route */}
          <Route path="/" element={<Homepage />} />

          {/* Compare System Route */}
          <Route path="/compare" element={<CompareSystem />} />

          {/* 3D Experience Route */}
          <Route path="/experience" element={<App isChatFocused={isChatFocused} />} />

          {/* Fallback to Homepage */}
          <Route path="*" element={<Homepage />} />
        </Routes>
        {/* Đã nhúng Voiceflow widget bằng useEffect, không cần FloatingChatButton nữa */}
      </Router>
    </ThemeProvider>
  );
};

export default AppRouter;
