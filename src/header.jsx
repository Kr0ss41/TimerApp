import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'
import ChartIcon from './icons/charts.svg'

const Header = () => {
  return (
    <header>
      <nav>
        <ul className='headerL'>
          <li><Link className='logo' to="/"><h1>NAME</h1></Link></li>
          <li><Link className='chartsButton' to="/charts"><img src={ChartIcon} width='70px' height='70px' alt="" /></Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;