import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery, Box } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TopicModeling from './pages/TopicModeling';
import RiskIdentification from './pages/RiskIdentification';
import RiskQuantification from './pages/RiskQuantification';
import Reports from './pages/Reports';
import About from './pages/About';
import Contact from './pages/Contact';

// Professional color palette
const colors = {
  primary: {
    main: '#4F46E5', // Indigo 600
    light: '#6366F1',
    dark: '#3730A3',
    contrastText: '#fff',
  },
  secondary: {
    main: '#06B6D4', // Cyan 500
    light: '#67E8F9',
    dark: '#0E7490',
    contrastText: '#fff',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#B91C1C',
  },
  warning: {
    main: '#F59E42',
    light: '#FBBF24',
    dark: '#B45309',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#1D4ED8',
  },
  success: {
    main: '#22C55E',
    light: '#4ADE80',
    dark: '#15803D',
  },
};

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', mode === 'dark');
    document.body.classList.toggle('light-mode', mode === 'light');
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...colors,
          background: {
            default: mode === 'light' ? '#F9FAFB' : '#18181B',
            paper: mode === 'light' ? '#fff' : '#232946',
          },
          text: {
            primary: mode === 'light' ? '#1E293B' : '#F3F4F6',
            secondary: mode === 'light' ? '#64748B' : '#A1A1AA',
          },
          primary: {
            main: mode === 'light' ? '#4F46E5' : '#6366F1',
            light: mode === 'light' ? '#6366F1' : '#818CF8',
            dark: mode === 'light' ? '#3730A3' : '#312E81',
            contrastText: '#fff',
          },
          secondary: {
            main: mode === 'light' ? '#06B6D4' : '#22D3EE',
            light: mode === 'light' ? '#67E8F9' : '#67E8F9',
            dark: mode === 'light' ? '#0E7490' : '#0E7490',
            contrastText: '#fff',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 500,
          },
          h2: {
            fontWeight: 500,
          },
          h3: {
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
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
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar onToggleColorMode={toggleColorMode} mode={mode} />
        <Box sx={{ pt: { xs: 8, sm: 9 } }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/topic-modeling" element={<TopicModeling />} />
            <Route path="/risk-identification" element={<RiskIdentification />} />
            <Route path="/risk-quantification" element={<RiskQuantification />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
