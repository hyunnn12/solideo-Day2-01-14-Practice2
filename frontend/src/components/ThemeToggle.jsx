import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTravelContext } from '../context/TravelContext';

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useTravelContext();

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-24 right-6 z-50 glass-effect w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? (
          <FaMoon className="text-xl text-purple-600" />
        ) : (
          <FaSun className="text-xl text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
