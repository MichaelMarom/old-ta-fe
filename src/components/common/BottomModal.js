import React from 'react';
import { FaTimes } from 'react-icons/fa';

const BottomModal = ({ isOpen, onClose, children, left = '0' }) => {
    return (
        <div
            className={`sidebar ${isOpen ? 'open' : ''} border-end`}
            style={{
                background: '#e6ffe6',
                height: '25%',
                transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.3s ease-in-out',
                position: 'fixed',
                left,
                bottom: '0',
                width: '100%',
                zIndex: '1000',
                overflowX: "auto"
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

export default BottomModal;
