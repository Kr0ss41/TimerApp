import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { ChartsIcon } from "./icons/ChartsIcon";

const Header = () => {
  return (
    <header>
      <nav>
        <ul className='headerL'>
          <li>
            <Link className='logo' to='/'>
              <h1>NAME</h1>
            </Link>
          </li>
          <li>
            <Link className='chartsButton' to='/charts'>
              <ChartsIcon
                styles={{ width: "70px", height: "70px", color: "white" }}
              />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
