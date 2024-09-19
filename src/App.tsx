import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './header.jsx'
import Content from './content';
import Charts from './charts/charts.js';

const App: React.FC = () => {
  return(
    <Router>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Content />}/>
        <Route path='/charts' element={<Charts/>}/>
      </Routes>
    </Router>
  )
}

export default App;


