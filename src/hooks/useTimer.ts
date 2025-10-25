import { useState, useEffect, useCallback } from 'react';

interface UseTimerProps {
  initialMinutes: number;
  onComplete: () => void;
}

export function useTimer({ initialMinutes, onComplete }: UseTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsActive(false);
            onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeRemaining, onComplete]);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback((minutes: number) => {
    setIsActive(false);
    setTimeRemaining(minutes * 60);
  }, []);

  return {
    timeRemaining,
    isActive,
    start,
    pause,
    reset,
  };
}
