import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeContext';
import FloatingChatButton from '../components/FloatingChatButton';
import Homepage from '../pages/Homepage';
import CompareSystem from '../pages/CompareSystem';
import App from '../App'; // 3D Experience

const AppRouter = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Homepage Route */}
          <Route path="/" element={<Homepage />} />

          {/* Compare System Route */}
          <Route path="/compare" element={<CompareSystem />} />

          {/* 3D Experience Route */}
          <Route path="/experience" element={<App />} />

          {/* Fallback to Homepage */}
          <Route path="*" element={<Homepage />} />
        </Routes>

        {/* Global FloatingChatButton - visible on all pages */}
        <FloatingChatButton />
      </Router>
    </ThemeProvider>
  );
};

export default AppRouter;
