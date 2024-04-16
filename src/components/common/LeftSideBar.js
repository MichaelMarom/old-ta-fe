import React from 'react';
import { FaTimes } from 'react-icons/fa';

const LeftSideBar = ({ isOpen, onClose, children, top = '0' }) => {
  return (
    <div
      className={`sidebar ${isOpen ? 'open' : ''} border-end`}
      style={{
        background: '#e6ffe6',
        width: '25%',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        position: 'fixed',
        top,
        left: '0',
        height: '100%',
        zIndex: '1000',
        overflowY: "auto"
      }}
    >
      <button
        className="btn btn-link"
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
        }}
        onClick={onClose}
      >
        <FaTimes size={32} />
      </button>
      {children}
    </div>
  );
};

export default LeftSideBar;
