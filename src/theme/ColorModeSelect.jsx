import { useState } from 'react';
import { useTheme } from './ThemeContext';
import { MenuItem, Select } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

const modes = [
  { value: 'system', label: 'System', icon: SettingsBrightnessIcon },
  { value: 'light', label: 'Light', icon: LightModeIcon },
  { value: 'dark', label: 'Dark', icon: DarkModeIcon },
];

export default function ColorModeSelect(props) {
  const { isDark, toggleTheme } = useTheme();

  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('airsmart-theme');
    return saved !== null ? (JSON.parse(saved) ? 'dark' : 'light') : 'system';
  });

  const handleChange = (event) => {
    const newMode = event.target.value;
    setMode(newMode);

    if (newMode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark !== isDark) toggleTheme();
      localStorage.removeItem('airsmart-theme');
    } else {
      const shouldBeDark = newMode === 'dark';
      if (shouldBeDark !== isDark) toggleTheme();
    }
  };

  const renderValue = (value) => {
    const modeConfig = modes.find(m => m.value === value);
    const Icon = modeConfig?.icon;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {Icon && <Icon sx={{ fontSize: 16, mr: 1 }} />}
        {modeConfig?.label}
      </div>
    );
  };

  return (
    <Select
      value={mode}
      onChange={handleChange}
      renderValue={renderValue}
      {...props}
    >
      {modes.map(({ value, label, icon: Icon }) => (
        <MenuItem key={value} value={value}>
          <Icon sx={{ fontSize: 16, mr: 1 }} />
          {label}
        </MenuItem>
      ))}
    </Select>
  );
}
