import * as React from 'react';
import { useTheme } from './ThemeContext';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function ColorModeSelect(props) {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
  };

  const Icon = isDark ? LightModeIcon : DarkModeIcon;
  const tooltip = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={handleToggle}
        {...props}
        sx={{
          borderRadius: '10px',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          color: isDark ? '#fff' : '#333',
          width: 44,
          height: 44,
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          '&:hover': {
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          },
          ...props.sx
        }}
      >
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
