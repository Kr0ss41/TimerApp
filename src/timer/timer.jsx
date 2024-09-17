import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ active, onStop }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const [markTimes,setMarkTimes] = useState([{id:0, time:0}])
  const [iterations,setIterations] = useState(0) 

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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

  useEffect(() => {
    if (active) {
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
      <div style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        {formatTime(seconds)}
      </div>
      <div>{markTimes.id} {markTimes.time}</div>
    </div>
  );
};

export default Timer;
export function formatTime(){
  
}