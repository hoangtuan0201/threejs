import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeContext';
import Homepage from '../pages/Homepage';
import CompareSystem from '../pages/CompareSystem';
import XRayMode from '../pages/X-ray';
import Test from '../pages/Test';
import App from '../App'; // 3D Experience

const AppRouter = () => {
  const [isChatFocused, setIsChatFocused] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {
      window.voiceflow.chat.load({
        verify: { projectID: '6933ce37ed72408e2affe876' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        voice: {
          url: "https://runtime-api.voiceflow.com"
        }
      });
    };
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
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


          {/* X-Ray Mode Route */}
          {/* <Route path="/x-ray" element={<XRayMode />} /> */}

          {/* Test/Debug Route */}
          <Route path="/test" element={<Test />} />

          {/* Fallback to Homepage */}
          <Route path="*" element={<Homepage />} />
        </Routes>
        {/* Đã nhúng Voiceflow widget bằng useEffect, không cần FloatingChatButton nữa */}
      </Router>
    </ThemeProvider>
  );
};

export default AppRouter;
