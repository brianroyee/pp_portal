"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: string;
  top: string;
  animation: string;
  animationDelay: string;
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    // Generate particles only on the client side
    const newParticles = Array(6).fill(null).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 2}s`,
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-green-300 rounded-full opacity-30"
          style={{
            left: particle.left,
            top: particle.top,
            animation: particle.animation,
            animationDelay: particle.animationDelay,
          }}
        />
      ))}
    </>
  );
}