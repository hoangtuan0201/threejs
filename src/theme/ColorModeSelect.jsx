import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function ColorModeSelect(props) {
  const { isDark, toggleTheme } = useTheme();

  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('airsmart-theme');
    if (saved !== null) {
      return JSON.parse(saved) ? 'dark' : 'light';
    }
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemDark ? 'dark' : 'light';
  });

  useEffect(() => {
    const saved = localStorage.getItem('airsmart-theme');
    if (saved === null) {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark !== isDark) toggleTheme();
    }
    // eslint-disable-next-line
  }, []);

  const handleToggle = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    const shouldBeDark = newMode === 'dark';
    if (shouldBeDark !== isDark) toggleTheme();
    localStorage.setItem('airsmart-theme', JSON.stringify(shouldBeDark));
  };

  const Icon = mode === 'dark' ? LightModeIcon : DarkModeIcon;
  const tooltip = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={handleToggle} {...props}>
        <Icon />
      </IconButton>
    </Tooltip>
  );
}
