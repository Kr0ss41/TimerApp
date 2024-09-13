import React from 'react';
import './Modal.css'

const Modal = ({ active, setActive }: { active: boolean, setActive: React.Dispatch<React.SetStateAction<boolean>> ) => {
    return (
        <div className='modal'>
            <div className="modal__content">
                <p>Hello gays</p>
            </div>
        </div>
    )
}

export default Modal;