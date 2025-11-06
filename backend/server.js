const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load data files
const citiesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'cities.json'), 'utf8'));
const placesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'places.json'), 'utf8'));
const transportData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'transportation.json'), 'utf8'));
const aiRecommendations = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'ai-recommendations.json'), 'utf8'));

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate intermediate route points for animation
function generateRoutePoints(start, end, numPoints = 50) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    points.push({
      lat: start.lat + (end.lat - start.lat) * ratio,
      lng: start.lng + (end.lng - start.lng) * ratio
    });
  }
  return points;
}

// API Routes

// Get all cities
app.get('/api/cities', (req, res) => {
  res.json(citiesData);
});

// Get buildings for a specific city
app.get('/api/cities/:cityId/buildings', (req, res) => {
  const city = citiesData.cities.find(c => c.id === req.params.cityId);
  if (city) {
    res.json({ buildings: city.buildings });
  } else {
    res.status(404).json({ error: 'City not found' });
  }
});

// Calculate route with transport options
app.post('/api/calculate-route', (req, res) => {
  const { departure, destination, departureTime, duration, mood } = req.body;

  // Find buildings
  let departureBuilding = null;
  let destinationBuilding = null;

  citiesData.cities.forEach(city => {
    city.buildings.forEach(building => {
      if (building.id === departure) departureBuilding = { ...building, city: city.id };
      if (building.id === destination) destinationBuilding = { ...building, city: city.id };
    });
  });

  if (!departureBuilding || !destinationBuilding) {
    return res.status(404).json({ error: 'Buildings not found' });
  }

  // Calculate distance
  const distance = calculateDistance(
    departureBuilding.lat, departureBuilding.lng,
    destinationBuilding.lat, destinationBuilding.lng
  );

  // Determine route type
  let routeType = 'short';
  if (distance > 1000) routeType = 'intercontinental';
  else if (distance > 300) routeType = 'long';
  else if (distance > 50) routeType = 'medium';

  // Calculate transport options
  const transportOptions = [];
  const routeConfig = transportData.routes[routeType];

  routeConfig.recommended.forEach(transportType => {
    const transport = transportData.transportOptions[transportType];
    const travelTime = (distance / transport.avgSpeed) * 60; // in minutes
    const cost = distance * transport.costPerKm;
    const carbon = distance * transport.carbonFootprint;

    // Add some randomness for realism
    const delay = Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0;

    transportOptions.push({
      type: transportType,
      icon: transport.icon,
      color: transport.color,
      distance: Math.round(distance * 10) / 10,
      duration: Math.round(travelTime + delay),
      cost: Math.round(cost * 100) / 100,
      carbonFootprint: Math.round(carbon * 100) / 100,
      delay: delay,
      recommended: transportType === routeConfig.fastest ||
                   transportType === routeConfig.cheapest ||
                   transportType === routeConfig.greenest
    });
  });

  // Generate route points for animation
  const routePoints = generateRoutePoints(
    { lat: departureBuilding.lat, lng: departureBuilding.lng },
    { lat: destinationBuilding.lat, lng: destinationBuilding.lng }
  );

  res.json({
    departure: departureBuilding,
    destination: destinationBuilding,
    distance: Math.round(distance * 10) / 10,
    transportOptions: transportOptions.sort((a, b) => a.duration - b.duration),
    routePoints,
    routeType
  });
});

// Get AI-powered recommendations
app.post('/api/recommend', (req, res) => {
  const { cityId, mood, duration, departureTime } = req.body;

  // Get places for the city
  const cityPlaces = placesData.places[cityId];
  if (!cityPlaces) {
    return res.status(404).json({ error: 'City not found' });
  }

  // Get mood profile
  const moodProfile = aiRecommendations.moodProfiles[mood] || aiRecommendations.moodProfiles.adventurous;

  // Determine time of day
  const hour = new Date(departureTime).getHours();
  let timeOfDay = 'morning';
  if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else if (hour >= 21 || hour < 6) timeOfDay = 'night';

  const timeRecommendations = aiRecommendations.timeOfDayRecommendations[timeOfDay];

  // Determine duration category
  let durationCategory = 'short';
  if (duration > 12) durationCategory = 'multi-day';
  else if (duration > 8) durationCategory = 'full-day';
  else if (duration > 4) durationCategory = 'half-day';

  const durationConfig = aiRecommendations.durationRecommendations[durationCategory];

  // Filter and score places based on mood
  const scorePlace = (place) => {
    let score = 0;
    if (place.mood && place.mood.includes(mood)) score += 50;
    score += place.rating * 10;
    score += Math.random() * 20; // Add randomness
    return score;
  };

  // Filter restaurants
  const restaurants = cityPlaces.restaurants
    .map(r => ({ ...r, score: scorePlace(r) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(durationConfig.numberOfStops.split('-')[1] || 3, 5));

  // Filter cafes
  const cafes = cityPlaces.cafes
    .map(c => ({ ...c, score: scorePlace(c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  // Filter attractions
  const attractions = cityPlaces.attractions
    .map(a => ({ ...a, score: scorePlace(a) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(durationConfig.numberOfStops.split('-')[1] || 3, 5));

  // Select AI persona based on mood
  let persona = aiRecommendations.aiPersonas[0];
  if (mood === 'romantic' || mood === 'relaxing') {
    persona = aiRecommendations.aiPersonas[1];
  } else if (mood === 'adventurous') {
    persona = aiRecommendations.aiPersonas[2];
  } else if (mood === 'cultural') {
    persona = aiRecommendations.aiPersonas[3];
  }

  // Generate personalized message
  const personalizedMessage = `${persona.greeting} Based on your ${mood} mood and ${durationCategory} ${timeOfDay} trip, I've curated ${restaurants.length + cafes.length + attractions.length} amazing experiences that match your vibe. ${moodProfile.tips[0]}`;

  res.json({
    mood: moodProfile,
    timeOfDay: timeRecommendations,
    duration: durationConfig,
    recommendations: {
      restaurants,
      cafes,
      attractions
    },
    persona,
    personalizedMessage,
    tips: moodProfile.tips
  });
});

// Mock weather endpoint
app.get('/api/weather/:cityId', (req, res) => {
  const weatherConditions = ['sunny', 'rainy', 'cold', 'hot'];
  const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

  const weatherData = {
    condition: randomCondition,
    temperature: Math.floor(Math.random() * 30) + 10,
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    description: aiRecommendations.weatherAdaptations[randomCondition].recommendations[0],
    tips: aiRecommendations.weatherAdaptations[randomCondition].tips
  };

  res.json(weatherData);
});

// Chatbot endpoint
app.post('/api/chat', (req, res) => {
  const { message, context } = req.body;

  const lowerMessage = message.toLowerCase();

  // Simple rule-based chatbot responses
  let response = '';

  if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('restaurant')) {
    response = "Great question! I recommend trying the local specialties. Each destination has unique culinary treasures. Would you like me to suggest restaurants based on your mood?";
  } else if (lowerMessage.includes('weather')) {
    response = "The weather looks good for your trip! I've factored it into your recommendations. Don't forget to check the forecast closer to your departure time.";
  } else if (lowerMessage.includes('transport') || lowerMessage.includes('get there')) {
    response = "I've analyzed multiple transportation options for you. The fastest isn't always the best - consider comfort, cost, and environmental impact too!";
  } else if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('budget')) {
    response = "Budget-conscious? I can help! Mix expensive highlights with affordable local experiences. Street food and free walking tours are often the most memorable.";
  } else if (lowerMessage.includes('time') || lowerMessage.includes('long')) {
    response = "Time management is key! I've optimized your itinerary based on your duration. Remember to leave buffer time for spontaneous discoveries - they're often the best part!";
  } else if (lowerMessage.includes('local') || lowerMessage.includes('authentic')) {
    response = "Seeking authentic experiences? Venture beyond tourist hotspots! Talk to locals, visit neighborhood markets, and try regional dishes you can't find elsewhere.";
  } else if (lowerMessage.includes('tips') || lowerMessage.includes('advice')) {
    response = "Pro tip: Download offline maps, learn a few local phrases, and always carry a portable charger. The best adventures happen when you're prepared!";
  } else {
    response = "That's an interesting question! I'm here to help with recommendations, transportation, local tips, or any travel planning questions. What would you like to know more about?";
  }

  res.json({
    response,
    suggestions: [
      "What's the best local dish?",
      "How do I get around?",
      "Any budget-friendly tips?",
      "What should I not miss?"
    ]
  });
});

// Real-time traffic updates (simulated)
app.get('/api/traffic/:routeId', (req, res) => {
  const trafficLevel = Math.random();

  res.json({
    routeId: req.params.routeId,
    congestionLevel: trafficLevel > 0.7 ? 'heavy' : trafficLevel > 0.4 ? 'moderate' : 'light',
    delay: trafficLevel > 0.7 ? Math.floor(Math.random() * 20) + 10 : 0,
    alternateRoutes: trafficLevel > 0.7 ? 2 : 0,
    lastUpdated: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Travel Planner API running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}/api/health`);
});
