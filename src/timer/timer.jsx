import React, { useState, useEffect, useRef } from "react";
import "./timer.css";

const Timer = ({ active, onStop }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    // setIterations(iterations+1)
    // setMarkTimes([...markTimes,{id:iterations, time:seconds}])
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    if (onStop) {
      onStop(seconds);
    }
  };
  const resetTimer = () => {
    setSeconds(0);
  };
  useEffect(() => {
    if (active) {
      resetTimer();
      startTimer();
    } else if (isRunning) {
      stopTimer();
    }
  }, [active]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div className={isRunning ? "timer activeTimer" : "timer inactiveTimer"}>
        {formatTime(seconds)}
      </div>
    </div>
  );
};

export default Timer;
export function formatTime() {}
