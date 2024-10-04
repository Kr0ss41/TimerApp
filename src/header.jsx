import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css'
import ChartIcon from './icons/charts.svg'
import Modal from './modal/Modal.jsx'
import ChartsIcon from './icons/chartsIcon.jsx'

const Header = () => {
  const [modalActive, setModalActive] = useState(false)
  return (
    <header>
      <Modal active={modalActive} setActive={setModalActive}>
        <div className='modalStats'>
          <div className='modalStatsL'><Link onClick={()=>setModalActive(false)} to="/stats" className='fontClass'>СТАТИСТИКА</Link></div>
          <div className='modalStatsL'><Link onClick={()=>setModalActive(false)} to="/charts" className='fontClass'>ГРАФИКИ (ЧАРТЫ)</Link></div>
        </div>

      </Modal>
      <nav>
        <ul className='headerL'>
          <li><Link className='logo' to="/"><h1>TIMORA</h1></Link></li>
          <li><button className='infobutton' onClick={() => setModalActive(true)}>
            <ChartsIcon/>
          </button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
{/* <Link className='chartsButton' to="/charts"><img src={ChartIcon} width='70px' height='70px' alt="" /></Link> */ }