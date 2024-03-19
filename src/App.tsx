import React from 'react';
import logo from './logo.svg';
import './App.css';
import SelfieComponent from './components/selfie/Selfie';
import HairComponent from './components/hair/Hair';
import TutorialComponent from './components/tutorial/Tutorial';

import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import {
  createTheme,
  ThemeProvider,
  alpha,
  getContrastRatio,
} from '@mui/material/styles';

function App() {
  const theme = createTheme({
    palette: {
      secondary: {
        main: '#ED1848;',
        dark: '#A29415',
        contrastText: '#242105',
      },
      warning: {
        main: '#ffffff'
      }
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Routes >
            <Route path="/" element={ <TutorialComponent /> } />
            <Route path="selfie" element={ <SelfieComponent /> } />
            <Route path="hair" element={ <HairComponent /> } />
          </Routes >
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
