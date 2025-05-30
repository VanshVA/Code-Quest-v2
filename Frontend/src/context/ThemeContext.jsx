import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { theme, darkTheme } from '../theme/theme';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ThemeProvider = ({ children }) => {
  // Check if dark mode is stored in local storage or use system preference
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedMode = localStorage.getItem('themeMode');
  const initialMode = storedMode ? storedMode === 'dark' : prefersDarkMode;
  
  const [mode, setMode] = useState(initialMode ? 'dark' : 'light');
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
    }),
    [],
  );
  
  // Update document body class for CSS variables
  useEffect(() => {
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [mode]);
  
  const currentTheme = useMemo(() => {
    return mode === 'dark' ? darkTheme : theme;
  }, [mode]);
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={currentTheme}>
        {children}
      </MUIThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);