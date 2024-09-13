import { useState } from 'react';
import './App.css'
import Modal from './modal/Modal.js'

const App: React.FC = () => {
  const [modalActive, setModalActive] = useState(true)
  return (
    <div className='mainBody'>
      <main>
        <button className='testbtn'>Открыть окно</button>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla hic dicta dignissimos vero necessitatibus? Aliquam earum corporis deserunt doloremque totam minus sunt a quibusdam neque recusandae molestias cum, explicabo tempore.</p>
      </main>
      <Modal active={modalActive} setActive={setModalActive} />
    </div>
  );
};

export default App
