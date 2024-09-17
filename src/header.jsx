import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'
import setActive from './modal/Modal'

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link className='logo' to="/">NAME</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;