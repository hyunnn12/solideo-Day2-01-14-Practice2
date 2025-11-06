import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBus, FaTrain, FaPlane, FaCar, FaBicycle, FaClock, FaDollarSign, FaLeaf, FaChartLine } from 'react-icons/fa';
import { useTravelContext } from '../context/TravelContext';
import { useNavigate } from 'react-router-dom';
import TransportComparison from '../components/TransportComparison';
import AnimatedMap from '../components/AnimatedMap';
import Chatbot from '../components/Chatbot';

const MapView = () => {
  const { routeData, selectedTransport, setSelectedTransport, tripData } = useTravelContext();
  const navigate = useNavigate();
  const [showComparison, setShowComparison] = useState(false);
  const [trafficData, setTrafficData] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    if (!routeData) {
      navigate('/');
      return;
    }

    // Select first transport option by default
    if (!selectedTransport && routeData.transportOptions.length > 0) {
      setSelectedTransport(routeData.transportOptions[0]);
    }

    // Simulate traffic updates every 5 seconds
    const trafficInterval = setInterval(() => {
      setTrafficData({
        level: Math.random() > 0.7 ? 'heavy' : Math.random() > 0.4 ? 'moderate' : 'light',
        delay: Math.floor(Math.random() * 15),
        lastUpdate: new Date().toLocaleTimeString(),
      });
    }, 5000);

    return () => clearInterval(trafficInterval);
  }, [routeData, navigate, selectedTransport, setSelectedTransport]);

  if (!routeData) {
    return null;
  }

  const getTransportIcon = (type) => {
    switch (type) {
      case 'bus': return <FaBus />;
      case 'train': return <FaTrain />;
      case 'flight': return <FaPlane />;
      case 'car': return <FaCar />;
      case 'bicycle': return <FaBicycle />;
      default: return <FaCar />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Your Journey Awaits
          </h1>
          <p className="text-gray-600">
            {routeData.departure.name} → {routeData.destination.name}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect rounded-3xl p-6 h-[600px]">
              <AnimatedMap
                departure={routeData.departure}
                destination={routeData.destination}
                routePoints={routeData.routePoints}
                selectedTransport={selectedTransport}
              />

              {/* Traffic Alert */}
              <AnimatePresence>
                {trafficData && trafficData.level === 'heavy' && (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="absolute bottom-8 left-8 right-8 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">⚠️ Heavy Traffic Detected</p>
                        <p className="text-sm">+{trafficData.delay} min delay</p>
                      </div>
                      <p className="text-xs">{trafficData.lastUpdate}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Transport Options */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="glass-effect rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Transport</h2>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  <FaChartLine className="inline mr-1" />
                  Compare
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {routeData.transportOptions.map((transport) => (
                  <motion.button
                    key={transport.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTransport(transport)}
                    className={`w-full transport-card ${
                      selectedTransport?.type === transport.type
                        ? 'ring-2 ring-purple-500 shadow-xl scale-105'
                        : ''
                    }`}
                    style={{ borderLeftColor: transport.color }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="text-3xl p-3 rounded-xl"
                          style={{ backgroundColor: `${transport.color}20` }}
                        >
                          {getTransportIcon(transport.type)}
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg capitalize">
                            {transport.type}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {transport.distance} km
                          </p>
                        </div>
                      </div>
                      {transport.recommended && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Best
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="text-center">
                        <FaClock className="inline text-blue-500 mb-1" />
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-semibold">{transport.duration}m</p>
                      </div>
                      <div className="text-center">
                        <FaDollarSign className="inline text-green-500 mb-1" />
                        <p className="text-xs text-gray-500">Cost</p>
                        <p className="font-semibold">${transport.cost}</p>
                      </div>
                      <div className="text-center">
                        <FaLeaf className="inline text-green-600 mb-1" />
                        <p className="text-xs text-gray-500">CO₂</p>
                        <p className="font-semibold">{transport.carbonFootprint}kg</p>
                      </div>
                    </div>

                    {transport.delay > 0 && (
                      <div className="mt-3 bg-yellow-100 text-yellow-800 text-xs px-3 py-2 rounded-lg">
                        ⏰ {transport.delay} min delay expected
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate('/recommendations')}
                  className="btn-primary w-full"
                >
                  View Recommendations
                </button>
                <button
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="btn-secondary w-full"
                >
                  💬 Ask AI Assistant
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transport Comparison Modal */}
        <AnimatePresence>
          {showComparison && (
            <TransportComparison
              options={routeData.transportOptions}
              onClose={() => setShowComparison(false)}
            />
          )}
        </AnimatePresence>

        {/* Chatbot */}
        <AnimatePresence>
          {showChatbot && (
            <Chatbot onClose={() => setShowChatbot(false)} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MapView;
