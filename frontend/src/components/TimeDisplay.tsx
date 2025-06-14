"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

export default function TimeDisplay() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 border border-purple-200">
      <div className="flex items-center justify-center space-x-3 mb-3">
        <Calendar className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-800">
          Current Time
        </h3>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-purple-900 font-mono">
          {formatTime(time)}
        </p>
        <p className="text-purple-700">{formatDate(time)}</p>
      </div>
    </div>
  );
}