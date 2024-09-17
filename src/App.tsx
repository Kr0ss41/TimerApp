import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './header.jsx'
import Content from './content';

const App: React.FC = () => {
  return(
    <Router>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Content />}/>
        <Route path=''/>
        <Route path=''/>
        <Route path=''/>
      </Routes>
    </Router>
  )
}

export default App;


