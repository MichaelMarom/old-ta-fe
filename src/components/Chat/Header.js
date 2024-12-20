import React from 'react';
import Avatar from '../common/Avatar';

export const Header = ({ selectedChat, isTyping }) => {
  return (
    <div className="ks-header d-flex justify-content-start">
      <Avatar online={selectedChat.online} avatarSrc={selectedChat.avatarSrc} />
      <div className="ks-description">
        <div className="ks-name">{selectedChat.screenName}</div>
        <div className="ks-amount">
          {isTyping ? (
            <span className="typing-indicator">
              Typing
              <span className="dot-animation"></span>
              <span className="dot-animation"></span>
              <span className="dot-animation"></span>
            </span>
          ) : selectedChat.online ? (
            'Online'
          ) : (
            'Offline'
          )}
        </div>
      </div>
    </div>
  );
};
