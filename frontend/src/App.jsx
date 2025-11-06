import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TravelProvider } from './context/TravelContext';

// Pages
import Home from './pages/Home';
import MapView from './pages/MapView';
import Recommendations from './pages/Recommendations';
import StoryMode from './pages/StoryMode';

// Components
import Navigation from './components/Navigation';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <TravelProvider>
      <Router>
        <div className="min-h-screen relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
          </div>

          {/* Main content */}
          <div className="relative z-10">
            <Navigation />
            <ThemeToggle />

            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/story-mode" element={<StoryMode />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </Router>
    </TravelProvider>
  );
}

export default App;
