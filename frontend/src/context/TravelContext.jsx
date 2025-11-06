import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const TravelContext = createContext();

export const useTravelContext = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravelContext must be used within TravelProvider');
  }
  return context;
};

export const TravelProvider = ({ children }) => {
  const [tripData, setTripData] = useState({
    departure: null,
    destination: null,
    departureTime: new Date().toISOString(),
    duration: 8,
    mood: 'adventurous',
  });

  const [routeData, setRouteData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [weather, setWeather] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  // Load cities on mount
  useEffect(() => {
    loadCities();
    loadFromCache();
  }, []);

  // Save to cache whenever trip data changes
  useEffect(() => {
    if (routeData || recommendations) {
      saveToCache();
    }
  }, [routeData, recommendations, tripData]);

  const loadCities = async () => {
    try {
      const data = await apiService.getCities();
      setCities(data.cities);
    } catch (err) {
      console.error('Failed to load cities:', err);
      setError('Failed to load cities. Using offline mode.');
      setOfflineMode(true);
    }
  };

  const calculateRoute = async (tripInfo) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.calculateRoute(tripInfo);
      setRouteData(data);
      setTripData(tripInfo);
      return data;
    } catch (err) {
      console.error('Failed to calculate route:', err);
      setError('Failed to calculate route. Check your connection.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async (cityId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getRecommendations({
        cityId,
        mood: tripData.mood,
        duration: tripData.duration,
        departureTime: tripData.departureTime,
      });
      setRecommendations(data);
      return data;
    } catch (err) {
      console.error('Failed to get recommendations:', err);
      setError('Failed to get recommendations. Check your connection.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getWeatherInfo = async (cityId) => {
    try {
      const data = await apiService.getWeather(cityId);
      setWeather(data);
      return data;
    } catch (err) {
      console.error('Failed to get weather:', err);
      return null;
    }
  };

  const saveToCache = () => {
    try {
      const cacheData = {
        tripData,
        routeData,
        recommendations,
        weather,
        selectedTransport,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('travelPlannerCache', JSON.stringify(cacheData));
    } catch (err) {
      console.error('Failed to save to cache:', err);
    }
  };

  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem('travelPlannerCache');
      if (cached) {
        const data = JSON.parse(cached);
        // Only load if less than 24 hours old
        const cacheAge = Date.now() - new Date(data.timestamp).getTime();
        if (cacheAge < 24 * 60 * 60 * 1000) {
          setTripData(data.tripData || tripData);
          setRouteData(data.routeData);
          setRecommendations(data.recommendations);
          setWeather(data.weather);
          setSelectedTransport(data.selectedTransport);
        }
      }
    } catch (err) {
      console.error('Failed to load from cache:', err);
    }
  };

  const clearCache = () => {
    localStorage.removeItem('travelPlannerCache');
    setRouteData(null);
    setRecommendations(null);
    setWeather(null);
    setSelectedTransport(null);
  };

  const resetTrip = () => {
    setTripData({
      departure: null,
      destination: null,
      departureTime: new Date().toISOString(),
      duration: 8,
      mood: 'adventurous',
    });
    setRouteData(null);
    setRecommendations(null);
    setWeather(null);
    setSelectedTransport(null);
  };

  const value = {
    tripData,
    setTripData,
    routeData,
    setRouteData,
    recommendations,
    setRecommendations,
    weather,
    setWeather,
    selectedTransport,
    setSelectedTransport,
    cities,
    loading,
    error,
    darkMode,
    setDarkMode,
    offlineMode,
    calculateRoute,
    getRecommendations,
    getWeatherInfo,
    resetTrip,
    clearCache,
  };

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
};
