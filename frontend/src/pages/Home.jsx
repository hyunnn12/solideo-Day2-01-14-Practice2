import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaHeart, FaRocket, FaUtensils, FaPalette, FaUsers, FaBook } from 'react-icons/fa';
import { useTravelContext } from '../context/TravelContext';

const Home = () => {
  const navigate = useNavigate();
  const { tripData, setTripData, cities, calculateRoute, getRecommendations } = useTravelContext();

  const [formData, setFormData] = useState({
    departure: '',
    destination: '',
    departureTime: new Date().toISOString().slice(0, 16),
    duration: 8,
    mood: 'adventurous',
  });

  const [buildings, setBuildings] = useState({
    departure: [],
    destination: [],
  });

  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const moods = [
    { id: 'relaxing', label: 'Relaxing', icon: '🧘', color: 'from-green-400 to-blue-400', description: 'Take it slow' },
    { id: 'adventurous', label: 'Adventurous', icon: '🏔️', color: 'from-orange-400 to-red-500', description: 'Seek thrills' },
    { id: 'foodie', label: 'Foodie', icon: '🍜', color: 'from-yellow-400 to-orange-500', description: 'Taste everything' },
    { id: 'romantic', label: 'Romantic', icon: '💕', color: 'from-pink-400 to-purple-500', description: 'Love & charm' },
    { id: 'cultural', label: 'Cultural', icon: '🏛️', color: 'from-indigo-400 to-purple-500', description: 'Deep immersion' },
    { id: 'social', label: 'Social', icon: '🎉', color: 'from-purple-400 to-pink-500', description: 'Meet & mingle' },
  ];

  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation not available:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      // Get buildings for first city as default
      const defaultCity = cities[0];
      setBuildings({
        departure: defaultCity.buildings,
        destination: defaultCity.buildings,
      });
    }
  }, [cities]);

  const handleCityChange = (type, cityId) => {
    const city = cities.find(c => c.id === cityId);
    if (city) {
      setBuildings(prev => ({
        ...prev,
        [type]: city.buildings,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.departure || !formData.destination) {
      alert('Please select both departure and destination buildings');
      return;
    }

    setLoading(true);

    try {
      // Calculate route
      const route = await calculateRoute(formData);

      if (route) {
        // Get destination city
        const destBuilding = cities
          .flatMap(c => c.buildings.map(b => ({ ...b, cityId: c.id })))
          .find(b => b.id === formData.destination);

        if (destBuilding) {
          await getRecommendations(destBuilding.cityId);
        }

        // Navigate to map view
        navigate('/map');
      }
    } catch (error) {
      console.error('Error planning trip:', error);
      alert('Failed to plan trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="gradient-text">Your Journey,</span>
            <br />
            <span className="gradient-text">Reimagined</span>
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered travel planning that understands your mood, optimizes your route, and discovers hidden gems.
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-3xl p-8 md:p-12 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Location Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Departure */}
              <div>
                <label className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  From
                </label>
                <div className="space-y-3">
                  <select
                    className="input-field"
                    onChange={(e) => handleCityChange('departure', e.target.value)}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}, {city.country}
                      </option>
                    ))}
                  </select>
                  <select
                    className="input-field"
                    value={formData.departure}
                    onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                  >
                    <option value="">Select Building</option>
                    {buildings.departure.map(building => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-purple-500" />
                  To
                </label>
                <div className="space-y-3">
                  <select
                    className="input-field"
                    onChange={(e) => handleCityChange('destination', e.target.value)}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}, {city.country}
                      </option>
                    ))}
                  </select>
                  <select
                    className="input-field"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  >
                    <option value="">Select Building</option>
                    {buildings.destination.map(building => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Time and Duration */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Departure Time */}
              <div>
                <label className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                  <FaClock className="mr-2 text-green-500" />
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                  <FaClock className="mr-2 text-orange-500" />
                  Trip Duration: {formData.duration} hours
                </label>
                <input
                  type="range"
                  min="1"
                  max="48"
                  step="1"
                  className="w-full"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1h</span>
                  <span>24h</span>
                  <span>48h</span>
                </div>
              </div>
            </div>

            {/* Mood Selector */}
            <div>
              <label className="flex items-center text-lg font-semibold mb-4 text-gray-700">
                <FaHeart className="mr-2 text-red-500" />
                I feel like...
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.id}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, mood: mood.id })}
                    className={`mood-button ${
                      formData.mood === mood.id ? 'mood-button-active' : ''
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{mood.icon}</div>
                      <div className="font-semibold text-gray-800">{mood.label}</div>
                      <div className="text-sm text-gray-500">{mood.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`btn-primary w-full py-5 text-xl ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-3"
                  >
                    ⚡
                  </motion.div>
                  Planning Your Journey...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaRocket className="mr-3" />
                  Start Your Adventure
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            { icon: '🤖', title: 'AI-Powered', desc: 'Smart recommendations based on your mood' },
            { icon: '🗺️', title: 'Real-Time Routes', desc: 'Live transportation and traffic updates' },
            { icon: '✨', title: 'Hidden Gems', desc: 'Discover places others miss' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="glass-effect rounded-2xl p-6 text-center"
            >
              <div className="text-5xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
