import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUtensils, FaCoffee, FaLandmark, FaStar, FaDollarSign, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { useTravelContext } from '../context/TravelContext';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

const Recommendations = () => {
  const { recommendations, tripData, weather } = useTravelContext();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('restaurants');
  const [favorites, setFavorites] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (!recommendations) {
      navigate('/');
      return;
    }

    // Show confetti on mount
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [recommendations, navigate]);

  if (!recommendations) {
    return null;
  }

  const categories = [
    { id: 'restaurants', label: 'Restaurants', icon: FaUtensils, color: 'from-orange-500 to-red-500' },
    { id: 'cafes', label: 'Cafes', icon: FaCoffee, color: 'from-yellow-500 to-orange-500' },
    { id: 'attractions', label: 'Attractions', icon: FaLandmark, color: 'from-blue-500 to-purple-500' },
  ];

  const toggleFavorite = (place) => {
    if (favorites.find(f => f.name === place.name)) {
      setFavorites(favorites.filter(f => f.name !== place.name));
    } else {
      setFavorites([...favorites, place]);
    }
  };

  const isFavorite = (place) => {
    return favorites.find(f => f.name === place.name);
  };

  const renderPriceLevel = (price) => {
    const levels = {
      'Free': 0,
      '$': 1,
      '$$': 2,
      '$$$': 3,
      '$$$$': 4,
    };
    const level = levels[price] || 0;

    return (
      <div className="flex items-center">
        {[...Array(4)].map((_, i) => (
          <FaDollarSign
            key={i}
            className={`${i < level ? 'text-green-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={i} className="text-yellow-500" />
        ))}
        {hasHalfStar && <FaStar className="text-yellow-500 opacity-50" />}
        <span className="ml-2 text-sm font-semibold">{rating}</span>
      </div>
    );
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
          numberOfPieces={200}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold gradient-text mb-3">
            Personalized for You
          </h1>
          <p className="text-xl text-gray-600">
            {recommendations.personalizedMessage}
          </p>
        </motion.div>

        {/* Mood & Weather Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* Mood Profile */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Your {tripData.mood} Vibe
            </h3>
            <p className="text-gray-600 mb-4">{recommendations.mood.description}</p>
            <div className="flex flex-wrap gap-2">
              {recommendations.mood.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Time & Tips */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Pro Tips
            </h3>
            <ul className="space-y-2">
              {recommendations.tips.slice(0, 3).map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">💡</span>
                  <span className="text-gray-600 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex space-x-3 mb-6 overflow-x-auto"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:shadow-md'
                }`}
              >
                <Icon />
                <span>{category.label}</span>
                <span className="bg-white/30 px-2 py-1 rounded-full text-xs">
                  {recommendations.recommendations[category.id]?.length || 0}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Recommendations Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recommendations.recommendations[activeCategory]?.map((place, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="recommendation-card cursor-pointer relative group"
                onClick={() => setSelectedPlace(place)}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(place);
                  }}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <FaHeart
                    className={`${
                      isFavorite(place) ? 'text-red-500' : 'text-gray-300'
                    }`}
                  />
                </button>

                {/* Place Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 pr-8">
                    {place.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{place.type}</p>
                  <p className="text-gray-600 text-sm">{place.description}</p>
                </div>

                {/* Rating & Price */}
                <div className="flex items-center justify-between mb-4">
                  {renderRating(place.rating)}
                  {renderPriceLevel(place.price)}
                </div>

                {/* Mood Tags */}
                {place.mood && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {place.mood.map((mood, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600"
                      >
                        {mood}
                      </span>
                    ))}
                  </div>
                )}

                {/* Location hint */}
                <div className="flex items-center text-xs text-gray-400">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{place.lat.toFixed(4)}, {place.lng.toFixed(4)}</span>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 border-2 border-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Favorites Summary */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 glass-effect rounded-2xl p-6"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              ❤️ Your Favorites ({favorites.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {favorites.map((fav, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl px-4 py-2 shadow-md flex items-center space-x-2"
                >
                  <span className="font-medium">{fav.name}</span>
                  <button
                    onClick={() => toggleFavorite(fav)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaHeart />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Place Detail Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedPlace(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="glass-effect rounded-3xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedPlace.name}</h2>
                  <p className="text-gray-600">{selectedPlace.type}</p>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-700 mb-6">{selectedPlace.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">Rating</p>
                  {renderRating(selectedPlace.rating)}
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">Price Level</p>
                  {renderPriceLevel(selectedPlace.price)}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">📍 Location</p>
                <p className="font-mono text-sm">
                  Lat: {selectedPlace.lat}, Lng: {selectedPlace.lng}
                </p>
              </div>

              <button
                onClick={() => toggleFavorite(selectedPlace)}
                className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all ${
                  isFavorite(selectedPlace)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isFavorite(selectedPlace) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Recommendations;
