import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FaTimes } from 'react-icons/fa';

const TransportComparison = ({ options, onClose }) => {
  // Prepare data for charts
  const barChartData = options.map(opt => ({
    name: opt.type.charAt(0).toUpperCase() + opt.type.slice(1),
    'Time (min)': opt.duration,
    'Cost ($)': opt.cost,
    'CO₂ (kg)': opt.carbonFootprint * 10, // Scale for visibility
  }));

  const radarChartData = options.map(opt => {
    // Normalize values to 0-100 scale for radar chart
    const maxTime = Math.max(...options.map(o => o.duration));
    const maxCost = Math.max(...options.map(o => o.cost));
    const maxCarbon = Math.max(...options.map(o => o.carbonFootprint));

    return {
      transport: opt.type.charAt(0).toUpperCase() + opt.type.slice(1),
      Speed: 100 - (opt.duration / maxTime) * 100, // Inverse (faster is better)
      Affordability: 100 - (opt.cost / maxCost) * 100, // Inverse (cheaper is better)
      'Eco-Friendly': 100 - (opt.carbonFootprint / maxCarbon) * 100, // Inverse (less CO2 is better)
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="glass-effect rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold gradient-text">
            Transport Comparison
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">⚡ Fastest</h3>
            <p className="text-3xl font-bold">
              {options.reduce((prev, curr) =>
                prev.duration < curr.duration ? prev : curr
              ).type.toUpperCase()}
            </p>
            <p className="text-sm opacity-80 mt-2">
              {Math.min(...options.map(o => o.duration))} minutes
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">💰 Cheapest</h3>
            <p className="text-3xl font-bold">
              {options.reduce((prev, curr) =>
                prev.cost < curr.cost ? prev : curr
              ).type.toUpperCase()}
            </p>
            <p className="text-sm opacity-80 mt-2">
              ${Math.min(...options.map(o => o.cost)).toFixed(2)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">🌱 Greenest</h3>
            <p className="text-3xl font-bold">
              {options.reduce((prev, curr) =>
                prev.carbonFootprint < curr.carbonFootprint ? prev : curr
              ).type.toUpperCase()}
            </p>
            <p className="text-sm opacity-80 mt-2">
              {Math.min(...options.map(o => o.carbonFootprint)).toFixed(2)} kg CO₂
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Side-by-Side Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Time (min)" fill="#3b82f6" />
                <Bar dataKey="Cost ($)" fill="#10b981" />
                <Bar dataKey="CO₂ (kg)" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Performance Radar
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="transport" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="Speed"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Affordability"
                  dataKey="Affordability"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Eco-Friendly"
                  dataKey="Eco-Friendly"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg overflow-x-auto">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Detailed Breakdown
          </h3>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4">Transport</th>
                <th className="text-center py-3 px-4">Duration</th>
                <th className="text-center py-3 px-4">Cost</th>
                <th className="text-center py-3 px-4">Carbon</th>
                <th className="text-center py-3 px-4">Distance</th>
              </tr>
            </thead>
            <tbody>
              {options.map((opt, index) => (
                <tr
                  key={opt.type}
                  className={`border-b border-gray-100 ${
                    index % 2 === 0 ? 'bg-gray-50' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: opt.color }}
                      ></div>
                      <span className="font-semibold capitalize">{opt.type}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    {opt.duration} min
                    {opt.delay > 0 && (
                      <span className="text-xs text-red-500 block">
                        +{opt.delay}m delay
                      </span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4 font-semibold text-green-600">
                    ${opt.cost.toFixed(2)}
                  </td>
                  <td className="text-center py-4 px-4 font-semibold text-green-700">
                    {opt.carbonFootprint.toFixed(2)} kg
                  </td>
                  <td className="text-center py-4 px-4">
                    {opt.distance} km
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Environmental Impact */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            🌍 Environmental Impact
          </h3>
          <p className="text-gray-700 mb-4">
            Choosing greener transport options can significantly reduce your carbon footprint.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600">Total if everyone chose bicycle:</p>
              <p className="text-2xl font-bold text-green-600">0 kg CO₂</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600">Average across all options:</p>
              <p className="text-2xl font-bold text-yellow-600">
                {(options.reduce((sum, opt) => sum + opt.carbonFootprint, 0) / options.length).toFixed(2)} kg CO₂
              </p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600">Trees needed to offset avg:</p>
              <p className="text-2xl font-bold text-green-700">
                {Math.ceil(options.reduce((sum, opt) => sum + opt.carbonFootprint, 0) / options.length / 21)} 🌳
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TransportComparison;
