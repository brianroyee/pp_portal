"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function StarryBackground() {
  const [stars, setStars] = useState<Array<{id: number, left: string, top: string, delay: string, duration: string}>>([]);
  const [particles, setParticles] = useState<Array<{id: number, left: string, top: string, delay: string, duration: string}>>([]);
  
  useEffect(() => {
    // Generate stars
    const newStars = Array(8).fill(null).map((_, i) => ({
      id: i,
      left: `${15 + Math.random() * 70}%`,
      top: `${15 + Math.random() * 70}%`,
      duration: `${2 + Math.random() * 2}s`,
      delay: `${Math.random() * 2}s`
    }));
    
    // Generate particles
    const newParticles = Array(12).fill(null).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${4 + Math.random() * 3}s`,
      delay: `${Math.random() * 3}s`
    }));
    
    setStars(newStars);
    setParticles(newParticles);
  }, []);

  return (
    <>
      {/* Floating stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute opacity-30"
          style={{
            left: star.left,
            top: star.top,
            animation: `twinkle ${star.duration} ease-in-out infinite`,
            animationDelay: star.delay,
          }}
        >
          <Star className="w-4 h-4 text-yellow-300" />
        </div>
      ))}

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-purple-300 rounded-full opacity-40"
          style={{
            left: particle.left,
            top: particle.top,
            animation: `float ${particle.duration} ease-in-out infinite`,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </>
  );
}