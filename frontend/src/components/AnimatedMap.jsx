import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedMap = ({ departure, destination, routePoints, selectedTransport }) => {
  const canvasRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Calculate bounds and scale
    const minLat = Math.min(departure.lat, destination.lat) - 0.5;
    const maxLat = Math.max(departure.lat, destination.lat) + 0.5;
    const minLng = Math.min(departure.lng, destination.lng) - 0.5;
    const maxLng = Math.max(departure.lng, destination.lng) + 0.5;

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    const scaleX = (lng) => ((lng - minLng) / lngRange) * width * 0.9 + width * 0.05;
    const scaleY = (lat) => height - ((lat - minLat) / latRange) * height * 0.9 - height * 0.05;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#f0f9ff');
    gradient.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo((width / 10) * i, 0);
      ctx.lineTo((width / 10) * i, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, (height / 10) * i);
      ctx.lineTo(width, (height / 10) * i);
      ctx.stroke();
    }

    // Draw route line
    if (routePoints && routePoints.length > 0) {
      const pointsToDraw = Math.floor(routePoints.length * animationProgress);

      ctx.strokeStyle = selectedTransport?.color || '#8b5cf6';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Add glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = selectedTransport?.color || '#8b5cf6';

      ctx.beginPath();
      for (let i = 0; i < pointsToDraw; i++) {
        const point = routePoints[i];
        const x = scaleX(point.lng);
        const y = scaleY(point.lat);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw animated dots along the route
      for (let i = 0; i < 3; i++) {
        const offset = (animationProgress + i * 0.3) % 1;
        const pointIndex = Math.floor(routePoints.length * offset);
        if (pointIndex < routePoints.length) {
          const point = routePoints[pointIndex];
          const x = scaleX(point.lng);
          const y = scaleY(point.lat);

          ctx.shadowBlur = 20;
          ctx.fillStyle = selectedTransport?.color || '#8b5cf6';
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0;
    }

    // Draw markers
    const drawMarker = (location, color, label, pulse = false) => {
      const x = scaleX(location.lng);
      const y = scaleY(location.lat);

      // Pulse effect
      if (pulse) {
        const pulseSize = 30 + Math.sin(Date.now() / 300) * 5;
        ctx.fillStyle = `${color}40`;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Marker pin
      ctx.fillStyle = color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Label
      if (hoveredMarker === label || true) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        const text = location.name;
        ctx.font = 'bold 14px sans-serif';
        const textWidth = ctx.measureText(text).width;

        const labelX = x - textWidth / 2 - 10;
        const labelY = y - 30;

        ctx.fillRect(labelX, labelY, textWidth + 20, 30);
        ctx.strokeRect(labelX, labelY, textWidth + 20, 30);

        ctx.fillStyle = '#1f2937';
        ctx.fillText(text, x - textWidth / 2, y - 10);
      }
    };

    drawMarker(departure, '#3b82f6', 'departure', true);
    drawMarker(destination, '#8b5cf6', 'destination', true);

  }, [departure, destination, routePoints, selectedTransport, animationProgress, hoveredMarker]);

  // Animate route drawing
  useEffect(() => {
    let frame = 0;
    const animate = () => {
      setAnimationProgress((prev) => {
        if (prev >= 1) return 0;
        return prev + 0.005;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full h-full"
      />

      {/* Legend */}
      <div className="absolute top-4 right-4 glass-effect rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium">Departure</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-sm font-medium">Destination</span>
        </div>
        {selectedTransport && (
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedTransport.color }}
            ></div>
            <span className="text-sm font-medium capitalize">
              {selectedTransport.type} Route
            </span>
          </div>
        )}
      </div>

      {/* Distance info */}
      <div className="absolute bottom-4 left-4 glass-effect rounded-xl px-4 py-2">
        <p className="text-sm font-medium">
          Distance: <span className="font-bold text-purple-600">
            {routePoints ? Math.round(
              Math.sqrt(
                Math.pow(destination.lat - departure.lat, 2) +
                Math.pow(destination.lng - departure.lng, 2)
              ) * 111
            ) : 0} km
          </span>
        </p>
      </div>
    </div>
  );
};

export default AnimatedMap;
