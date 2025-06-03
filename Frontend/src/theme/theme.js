import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light', // Can be dynamically changed to 'dark'
    primary: {
      main: '#bc4037',
      light: '#f47061',
      dark: '#9a342d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2C3E50',
      light: '#546E7A',
      dark: '#1A2530',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      dashboard: '#f7f6f6',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#708492',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    gradients: {
      primary: 'linear-gradient(45deg, #bc4037 30%, #f47061 90%)',
      secondary: 'linear-gradient(45deg, #2C3E50 30%, #546E7A 90%)',
      background: 'linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(154, 52, 45, 0.095) 100%)',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#708492',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.1),0px 1px 1px 0px rgba(0,0,0,0.07),0px 1px 3px 0px rgba(0,0,0,0.06)',
    '0px 3px 3px -2px rgba(0,0,0,0.1),0px 2px 4px -1px rgba(0,0,0,0.07),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 3px 4px -2px rgba(0,0,0,0.1),0px 3px 5px -1px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.06)',
    '0px 4px 5px -2px rgba(0,0,0,0.1),0px 4px 6px -2px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.06)',
    '0px 6px 10px -3px rgba(0,0,0,0.1),0px 4px 12px -2px rgba(0,0,0,0.05)',
    '0px 8px 14px -4px rgba(0,0,0,0.1),0px 6px 16px -2px rgba(0,0,0,0.05)',
    '0px 10px 15px -3px rgba(0,0,0,0.1),0px 4px 6px -2px rgba(0,0,0,0.05)',
    '0px 12px 22px -5px rgba(0,0,0,0.1),0px 8px 16px -4px rgba(0,0,0,0.05)',
    '0px 14px 28px -6px rgba(0,0,0,0.1),0px 10px 20px -4px rgba(0,0,0,0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #bc4037 30%, #f47061 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #9a342d 30%, #bd5c55 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #2C3E50 30%, #546E7A 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1A2530 30%, #3B5966 90%)',
          },
        },
        outlinedPrimary: {
          borderColor: '#bc4037',
          '&:hover': {
            borderColor: '#f47061',
            backgroundColor: 'rgba(188, 64, 55, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        '::-webkit-scrollbar': {
          width: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: '#ffffff',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#bc4037',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#bd5c55',
        },
        body: {
          fontFamily: '"Roboto", "Poppins", sans-serif',
          transition: 'all 0.3s ease',
        },
        a: {
          textDecoration: 'none',
          color: '#bc4037',
          transition: 'all 0.3s ease',
        },
        'a:hover': {
          color: '#f47061',
        },
      },
    },
  },
});

// Create a dark theme version
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    primary: {
      main: '#9a342d',
      light: '#f47061',
      dark: '#773e3a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1e1c1c',
      paper: '#1e1c1c',
      dashboard: '#1b16168f',
    },
    text: {
      primary: '#e0e0e0', 
      secondary: '#E5E3E6',
    },
    gradients: {
      primary: 'linear-gradient(45deg, #9a342d 30%, #f47061 90%)',
      secondary: 'linear-gradient(45deg, #1A2530 30%, #3B5966 90%)',
      background: 'linear-gradient(0deg, rgba(30, 28, 28, 1) 0%, rgba(154, 52, 45, 0.095) 100%)',
    },
  },
  components: {
    ...theme.components,
    MuiCssBaseline: {
      styleOverrides: {
        ...theme.components.MuiCssBaseline.styleOverrides,
        '::-webkit-scrollbar-track': {
          background: '#1e1c1c',
        },
        body: {
          backgroundColor: '#1e1c1c',
          color: '#e0e0e0',
        },
      },
    },
  },
});

export default theme;