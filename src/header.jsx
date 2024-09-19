import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link className='logo' to="/">NAME</Link></li>
          <li><Link className='chartsButton' to="/charts"> CHARTS</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;