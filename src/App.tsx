import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './header.jsx'
import Content from './content';
import Charts from './charts/charts';

const App: React.FC = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [timers, setTimers] = useState(() => {
    const savedTimers = localStorage.getItem('timers');
    return savedTimers ? JSON.parse(savedTimers) : [];
  });
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);
  return(
    <Router>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Content tasks={tasks} setTasks={setTasks} timers={timers} setTimers={setTimers} />} />
        <Route path="/charts" element={<Charts tasks={tasks} />} />
      </Routes>
    </Router>
  )
}

export default App;


