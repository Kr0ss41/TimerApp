import React, { useState, useEffect, useRef } from 'react';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Форматирование секунд в HH:MM:SS
  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Запуск таймера
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
  };

  // Остановка таймера
  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  // Сброс таймера
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setSeconds(0);
    setIsRunning(false);
  };

  // Очищаем таймер при размонтировании компонента
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div>
      <div style={{ fontSize: '2em', marginBottom: '20px' }}>
        {formatTime(seconds)}
      </div>
      <button onClick={startTimer} disabled={isRunning}>
        Старт
      </button>
      <button onClick={stopTimer} disabled={!isRunning}>
        Пауза
      </button>
      <button onClick={resetTimer}>Сброс</button>
    </div>
  );
};

export default Timer;
