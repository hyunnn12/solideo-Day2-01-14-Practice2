import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaForward } from 'react-icons/fa';
import Confetti from 'react-confetti';

const StoryMode = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const scenes = [
    {
      title: "Welcome to Your Journey",
      description: "Imagine waking up in New York City, ready for an adventure...",
      icon: "🌆",
      background: "from-blue-400 to-purple-500",
      duration: 3000,
    },
    {
      title: "AI Understands You",
      description: "You're feeling adventurous today. Our AI knows exactly what you need.",
      icon: "🤖",
      background: "from-purple-500 to-pink-500",
      duration: 3000,
    },
    {
      title: "Smart Route Planning",
      description: "From Empire State Building to Times Square - optimized for your mood.",
      icon: "🗺️",
      background: "from-pink-500 to-red-500",
      duration: 3000,
    },
    {
      title: "Real-Time Transportation",
      description: "Multiple options analyzed: speed, cost, environmental impact.",
      icon: "🚆",
      background: "from-red-500 to-orange-500",
      duration: 3000,
    },
    {
      title: "Hidden Gems Discovered",
      description: "A secret rooftop cafe only locals know about...",
      icon: "✨",
      background: "from-orange-500 to-yellow-500",
      duration: 3000,
    },
    {
      title: "Culinary Adventure",
      description: "From street food to Michelin stars - perfectly curated for you.",
      icon: "🍜",
      background: "from-yellow-500 to-green-500",
      duration: 3000,
    },
    {
      title: "Cultural Immersion",
      description: "Museums, galleries, and local experiences await.",
      icon: "🏛️",
      background: "from-green-500 to-teal-500",
      duration: 3000,
    },
    {
      title: "Your Journey, Reimagined",
      description: "AI-powered travel planning that truly understands you.",
      icon: "🎉",
      background: "from-teal-500 to-blue-500",
      duration: 4000,
    },
  ];

  useEffect(() => {
    let timer;
    if (isPlaying && currentScene < scenes.length - 1) {
      timer = setTimeout(() => {
        setCurrentScene(currentScene + 1);
        if (currentScene === scenes.length - 2) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }, scenes[currentScene].duration);
    } else if (currentScene === scenes.length - 1) {
      setIsPlaying(false);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentScene, scenes]);

  const handlePlay = () => {
    if (currentScene === scenes.length - 1) {
      setCurrentScene(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const handleSkip = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-20 px-6"
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold gradient-text mb-3">
            Travel Story Mode
          </h1>
          <p className="text-xl text-gray-600">
            Experience a cinematic journey through our AI-powered travel planner
          </p>
        </motion.div>

        {/* Story Display */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              transition={{ duration: 0.6 }}
              className={`glass-effect rounded-3xl p-12 min-h-[500px] flex flex-col items-center justify-center text-center bg-gradient-to-br ${scenes[currentScene].background} relative overflow-hidden`}
            >
              {/* Animated background circles */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
              />

              {/* Content */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-9xl mb-8"
                >
                  {scenes[currentScene].icon}
                </motion.div>

                <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
                  {scenes[currentScene].title}
                </h2>

                <p className="text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                  {scenes[currentScene].description}
                </p>
              </motion.div>

              {/* Progress dots */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
                {scenes.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentScene(index)}
                    whileHover={{ scale: 1.2 }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentScene
                        ? 'bg-white w-8'
                        : index < currentScene
                        ? 'bg-white/70'
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRestart}
            className="glass-effect rounded-full w-14 h-14 flex items-center justify-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <FaRedo className="text-xl" />
          </motion.button>

          {isPlaying ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePause}
              className="glass-effect rounded-full w-20 h-20 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl"
            >
              <FaPause className="text-3xl" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
              className="glass-effect rounded-full w-20 h-20 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl"
            >
              <FaPlay className="text-3xl ml-1" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSkip}
            disabled={currentScene === scenes.length - 1}
            className={`glass-effect rounded-full w-14 h-14 flex items-center justify-center transition-colors ${
              currentScene === scenes.length - 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            <FaForward className="text-xl" />
          </motion.button>
        </motion.div>

        {/* Scene Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600">
            Scene {currentScene + 1} of {scenes.length}
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 grid md:grid-cols-4 gap-6"
        >
          {[
            { icon: '🎨', title: 'Immersive', desc: 'Stunning visuals' },
            { icon: '⚡', title: 'Real-time', desc: 'Live updates' },
            { icon: '🧠', title: 'Smart AI', desc: 'Mood-based' },
            { icon: '🌍', title: 'Global', desc: 'Worldwide data' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="glass-effect rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StoryMode;
