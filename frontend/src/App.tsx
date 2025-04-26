import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import CampaignDashboard from './pages/CampaignDashboard.tsx';
import LandingPage from './pages/LandingPage.tsx';
import LinkedInLeadsPage from './pages/LinkedInLeadsPage.tsx';
import Header from './components/layout/Header.tsx';
import Footer from './components/layout/Footer.tsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4361ee', // Modern blue
      light: '#6888ff',
      dark: '#2f3eb9',
    },
    secondary: {
      main: '#7209b7', // Deep purple for accents
      light: '#9d4edd',
      dark: '#560090',
    },
    background: {
      default: '#f8f9fd',
      paper: '#ffffff',
    },
    success: {
      main: '#31c48d',
    },
    error: {
      main: '#e53e3e',
    },
    warning: {
      main: '#f6ad55',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<CampaignDashboard />} />
          <Route path="/leads" element={<LinkedInLeadsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
