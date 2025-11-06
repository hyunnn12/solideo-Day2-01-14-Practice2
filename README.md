# 🌍 AI-Powered Personalized Travel Planner

> **Your Journey, Reimagined** - An intelligent, immersive travel planning experience that understands your mood and optimizes your adventure.

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-blue.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16-purple.svg)](https://www.framer.com/motion/)

![Travel Planner Demo](https://via.placeholder.com/1200x600/667eea/ffffff?text=AI+Travel+Planner)

---

## 🎯 What Makes This Special

This isn't just another travel planner. It's a **next-generation experience** that combines:

- 🤖 **AI-Powered Personalization** - Understands your mood and curates perfect recommendations
- 🗺️ **Animated Route Visualization** - Watch your journey come to life with real-time animations
- 📊 **Smart Transport Comparison** - Visual analytics for time, cost, and environmental impact
- ✨ **Hidden Gems Discovery** - Find places others miss, tailored to your vibe
- 🎬 **Travel Story Mode** - Auto-demo with cinematic transitions (the "WOW" feature!)
- 💬 **AI Assistant Chatbot** - Ask anything about your trip
- 🌐 **Offline Mode** - Works even without internet using localStorage cache

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-travel-planner

# Install all dependencies (root, frontend, and backend)
npm run install:all

# Start the development servers
npm start
```

That's it! The app will automatically open at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 📁 Project Structure

```
ai-travel-planner/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── pages/           # Main page components
│   │   │   ├── Home.jsx            # Smart input panel & mood selector
│   │   │   ├── MapView.jsx         # Animated map & transport options
│   │   │   ├── Recommendations.jsx # Curated suggestions
│   │   │   └── StoryMode.jsx       # Auto-demo cinematic mode
│   │   ├── components/      # Reusable components
│   │   │   ├── Navigation.jsx      # Main navigation bar
│   │   │   ├── ThemeToggle.jsx     # Day/night mode toggle
│   │   │   ├── AnimatedMap.jsx     # Canvas-based route animation
│   │   │   ├── TransportComparison.jsx # Charts & analytics
│   │   │   └── Chatbot.jsx         # AI assistant interface
│   │   ├── context/         # State management
│   │   │   └── TravelContext.jsx   # Global app state
│   │   ├── services/        # API integration
│   │   │   └── api.js              # Backend API calls
│   │   ├── index.css        # Tailwind & custom styles
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                  # Express backend server
│   ├── data/                # Mock data files
│   │   ├── cities.json             # City & building coordinates
│   │   ├── places.json             # Restaurants, cafes, attractions
│   │   ├── transportation.json     # Transport options & specs
│   │   └── ai-recommendations.json # AI logic & mood profiles
│   ├── server.js            # Express API server
│   └── package.json
│
├── package.json             # Root package with scripts
└── README.md
```

---

## 🎨 Core Features Explained

### 1. **Smart Input Panel** (Home Page)

The journey starts here with an intelligent form that:
- **Geolocation Detection**: Automatically detects your location
- **City & Building Selection**: Choose from 5 global cities with iconic landmarks
- **Time & Duration Inputs**: Smart scheduling with visual range slider
- **Mood Selector**: 6 unique moods (Relaxing, Adventurous, Foodie, Romantic, Cultural, Social)

```javascript
// Mood affects everything:
// - Restaurant recommendations
// - Activity pace
// - Place curation
// - AI assistant personality
```

### 2. **AI Personalization Engine**

The backend analyzes:
- **Mood Profile**: Keywords, pace, preferences
- **Time of Day**: Morning/afternoon/evening activities
- **Trip Duration**: Short (1-4h), half-day (4-8h), full-day (8-12h), multi-day (12h+)
- **Weather Adaptation**: Dynamic tips based on conditions

### 3. **Immersive Map Visualization**

Custom Canvas-based animation featuring:
- **Animated Route Drawing**: Watch the path draw in real-time
- **Pulsing Markers**: Departure and destination with glow effects
- **Moving Dots**: Transport indicator traveling along the route
- **Color-Coded Paths**: Each transport type has unique styling
- **Interactive Legend**: Real-time distance calculations

### 4. **Transportation Intelligence**

Compare 5 transport modes across:
- ⏱️ **Time**: Fastest route analysis
- 💰 **Cost**: Budget-friendly options
- 🌱 **Carbon Footprint**: Environmental impact
- 🚨 **Real-Time Delays**: Simulated traffic updates every 5 seconds

**Visualization Tools**:
- Bar charts for side-by-side comparison
- Radar charts for performance metrics
- Detailed breakdown tables
- Environmental impact calculator

### 5. **Curated Recommendations**

AI-powered suggestions for:
- **Restaurants**: From street food to Michelin stars
- **Cafes**: Specialty coffee to themed experiences
- **Attractions**: Museums, shows, outdoor activities

Each with:
- ⭐ Ratings & reviews
- 💵 Price levels
- 🏷️ Mood tags
- 📍 Coordinates
- ❤️ Favorites system

### 6. **Travel Story Mode** ⭐ **WOW FEATURE**

An auto-playing cinematic demo that:
- Tells the app's story through 8 animated scenes
- Features 3D transformations and gradient backgrounds
- Includes confetti celebration
- Provides play/pause/skip controls
- Perfect for presentations and demos

### 7. **AI Chatbot Assistant**

Conversational interface with:
- Rule-based response system
- Context-aware suggestions
- Quick question buttons
- Real-time typing indicators
- Chat history

### 8. **Offline Mode**

Automatic caching using localStorage:
- Saves last trip for 24 hours
- Works without internet connection
- Syncs when online
- Clear cache functionality

---

## 🛠️ Technologies Used

### Frontend
- **React 18** - Component-based UI
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Confetti** - Celebration effects

### Backend
- **Express.js** - REST API framework
- **CORS** - Cross-origin support
- **JSON Data Store** - Mock database

### Design System
- **Glassmorphism** - Frosted glass effects
- **Gradient Overlays** - Colorful backgrounds
- **Custom Animations** - Float, pulse, shimmer
- **Responsive Grid** - Mobile-first approach

---

## 🎬 Usage Guide

### Step 1: Plan Your Trip

1. Navigate to the **Home** page
2. Select **departure city** and **building**
3. Select **destination city** and **building**
4. Choose **departure time**
5. Set **trip duration** (1-48 hours)
6. Pick your **mood** (this is crucial!)
7. Click **"Start Your Adventure"**

### Step 2: Review Routes

1. View the **animated map** with your route
2. Compare **transport options**:
   - Bus, Train, Flight, Car, Bicycle
   - See time, cost, and carbon footprint
3. Click **"Compare"** for detailed analytics
4. Select your preferred transport
5. Watch for **real-time traffic updates**

### Step 3: Discover Places

1. Navigate to **Recommendations**
2. Browse **restaurants, cafes, and attractions**
3. Filter by category
4. ❤️ **Favorite** places you love
5. Click any place for detailed info
6. Use **AI tips** for your mood

### Step 4: Get Help

- Click **"Ask AI Assistant"** on any page
- Type questions or use quick suggestions
- Get instant, context-aware answers

### Step 5: Experience Story Mode

1. Go to **Story Mode** page
2. Click **Play** ▶️
3. Sit back and watch the auto-demo
4. Perfect for showcasing the app!

---

## 🔧 Configuration

### Environment Variables (Optional)

Create `.env` files if you want to customize:

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`backend/.env`):
```env
PORT=5000
```

### Adding New Cities

Edit `backend/data/cities.json`:

```json
{
  "id": "your-city",
  "name": "Your City",
  "country": "Your Country",
  "buildings": [
    {
      "id": "landmark-1",
      "name": "Famous Landmark",
      "lat": 12.345678,
      "lng": -98.765432
    }
  ]
}
```

Then add places to `backend/data/places.json` with the same city ID.

---

## 📊 API Endpoints

### Cities
- `GET /api/cities` - Get all cities
- `GET /api/cities/:cityId/buildings` - Get buildings for a city

### Routes
- `POST /api/calculate-route` - Calculate route between two points
  ```json
  {
    "departure": "building-id",
    "destination": "building-id",
    "departureTime": "2024-01-01T12:00:00",
    "duration": 8,
    "mood": "adventurous"
  }
  ```

### Recommendations
- `POST /api/recommend` - Get personalized recommendations
  ```json
  {
    "cityId": "nyc",
    "mood": "foodie",
    "duration": 8,
    "departureTime": "2024-01-01T12:00:00"
  }
  ```

### Weather
- `GET /api/weather/:cityId` - Get weather for a city

### Chat
- `POST /api/chat` - Chat with AI assistant
  ```json
  {
    "message": "What should I eat?",
    "context": {}
  }
  ```

### Traffic
- `GET /api/traffic/:routeId` - Get real-time traffic updates

---

## 🎨 Customization

### Colors

Edit `frontend/tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* Your colors */ },
      accent: { /* Your colors */ }
    }
  }
}
```

### Animations

Modify `frontend/src/index.css` for custom animations:

```css
@keyframes your-animation {
  /* Your keyframes */
}
```

### Moods

Add new moods in `backend/data/ai-recommendations.json`:

```json
{
  "moodProfiles": {
    "your-mood": {
      "description": "Your description",
      "keywords": ["keyword1", "keyword2"],
      "pace": "medium",
      "preferences": { /* ... */ }
    }
  }
}
```

---

## 🚀 Performance Tips

1. **Optimize Images**: Use WebP format for images
2. **Lazy Loading**: Components load as needed
3. **Code Splitting**: Vite handles this automatically
4. **Caching**: localStorage reduces API calls
5. **Canvas Rendering**: Hardware-accelerated animations

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

### API Not Responding

1. Check backend is running on port 5000
2. Verify CORS is enabled
3. Check browser console for errors
4. Try `npm run dev:backend` separately

---

## 🎯 Future Enhancements

- [ ] Google Maps API integration for real maps
- [ ] Real weather API (OpenWeather)
- [ ] User authentication & trip saving
- [ ] Social sharing features
- [ ] Multi-language support
- [ ] Mobile app version (React Native)
- [ ] Real-time collaboration
- [ ] Calendar integration
- [ ] Booking integration (hotels, flights)
- [ ] AR navigation mode

---

## 📝 License

MIT License - Feel free to use this project for learning, portfolios, or commercial purposes.

---

## 👏 Acknowledgments

- **Framer Motion** for incredible animations
- **TailwindCSS** for rapid styling
- **Recharts** for beautiful charts
- **React community** for amazing tools

---

## 📧 Contact & Support

Created with ❤️ by [Your Name]

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

**Star ⭐ this repo if you found it helpful!**

---

## 🎉 Credits

Built as a demonstration of modern web development best practices, combining:
- Advanced React patterns
- AI-driven personalization
- Immersive UX design
- Real-time data visualization
- Performance optimization

**Thank you for checking out this project!** 🚀✈️🌍
