import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">NAME</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;