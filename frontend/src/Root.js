import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import App from './App';
import RevShare from './components/RevShare';
import Socials from './components/Socials';
import HowItWorks from './components/HowItWorks';

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app/*" element={<App />} />
        <Route path="/revshare" element={<RevShare />} />
        <Route path="/socials" element={<Socials />} />
        <Route path="/howitworks" element={<HowItWorks />} />
      </Routes>
    </Router>
  );
}

export default Root; 