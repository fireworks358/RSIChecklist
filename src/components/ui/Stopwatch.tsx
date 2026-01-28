import React, { useState, useEffect, useRef } from 'react';

export const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
      {/* Time Display */}
      <div className="text-3xl font-mono font-bold text-white min-w-[120px] text-center">
        {formatTime(time)}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        {/* Start/Stop Button */}
        <button
          onClick={handleStartStop}
          className={`px-4 py-2 rounded-lg font-bold text-base transition-all active:scale-95 min-h-touch
                     ${isRunning
                       ? 'bg-red-600 hover:bg-red-700 text-white'
                       : 'bg-green-600 hover:bg-green-700 text-white'
                     }`}
          aria-label={isRunning ? 'Stop timer' : 'Start timer'}
        >
          {isRunning ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold text-base
                     text-white transition-all active:scale-95 min-h-touch"
          aria-label="Reset timer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};
