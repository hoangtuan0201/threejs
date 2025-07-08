// AirSmart Theme Configuration with Dark/Light Mode Support

export const lightTheme = {
  colors: {
    primary: {
      50: '#fafbfc',
      100: '#f1f3f4',
      200: '#e8eaed',
      300: '#dadce0',
      400: '#bdc1c6',
      500: '#9aa0a6',
      600: '#5f6368',
      700: '#3c4043',
      800: '#202124',
      900: '#1a1a1a'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#e9ecef',
      paper: '#ffffff',
      overlay: 'rgba(255, 255, 255, 0.95)'
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
      tertiary: '#6c757d',
      inverse: '#ffffff'
    },
    border: {
      light: 'rgba(26, 26, 26, 0.08)',
      medium: 'rgba(26, 26, 26, 0.15)',
      dark: 'rgba(26, 26, 26, 0.25)'
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
    secondary: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #e9ecef 100%)',
    accent: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 50%, #404040 100%)',
    overlay: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)'
  }
};

export const darkTheme = {
  colors: {
    primary: {
      50: '#0d1117',
      100: '#161b22',
      200: '#21262d',
      300: '#30363d',
      400: '#484f58',
      500: '#6e7681',
      600: '#8b949e',
      700: '#c9d1d9',
      800: '#e6edf3',
      900: '#f0f6fc'
    },
    background: {
      primary: '#0d1117',
      secondary: '#161b22',
      tertiary: '#21262d',
      paper: '#161b22',
      overlay: 'rgba(13, 17, 23, 0.8)'
    },
    text: {
      primary: '#e6edf3',
      secondary: '#8b949e',
      tertiary: '#6e7681',
      inverse: '#0d1117'
    },
    border: {
      light: 'rgba(240, 246, 252, 0.1)',
      medium: 'rgba(240, 246, 252, 0.16)',
      dark: 'rgba(240, 246, 252, 0.24)'
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
    secondary: 'linear-gradient(135deg, #161b22 0%, #0d1117 50%, #21262d 100%)',
    accent: 'linear-gradient(135deg, #f0f6fc 0%, #c9d1d9 50%, #8b949e 100%)',
    overlay: 'linear-gradient(135deg, rgba(13,17,23,0.95) 0%, rgba(22,27,34,0.9) 100%)'
  }
};

export const commonTheme = {
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
    md: '0 8px 25px rgba(0, 0, 0, 0.08)',
    lg: '0 15px 35px rgba(0, 0, 0, 0.12)'
  },
  transitions: {
    fast: 'all 0.2s ease',
    normal: 'all 0.3s ease'
  },
  zIndex: {
    tooltip: 3000
  }
};

export const getTheme = (isDark = false) => ({
  ...(isDark ? darkTheme : lightTheme),
  ...commonTheme,
  isDark
});
