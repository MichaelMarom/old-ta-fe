import React from 'react';

const ThreeDotsLoader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="dot"
        style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '50%',
          backgroundColor: '#343a40', // Darker color
          animation: 'dot-flashing 1s infinite',
          marginRight: '0.25rem'
        }}
      ></div>
      <div
        className="dot"
        style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '50%',
          backgroundColor: '#6c757d', // Lighter color
          animation: 'dot-flashing 1s infinite 0.2s',
          marginRight: '0.25rem'
        }}
      ></div>
      <div
        className="dot"
        style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '50%',
          backgroundColor: '#adb5bd', // Lightest color
          animation: 'dot-flashing 1s infinite 0.4s',
        }}
      ></div>

      <style jsx>{`
        @keyframes dot-flashing {
          0% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default ThreeDotsLoader;
