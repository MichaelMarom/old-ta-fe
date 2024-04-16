import React from 'react';
import generalAvatar from '../../assets/images/avatar.png'

const Avatar = ({ avatarSrc, online, size = "50", indicSize = "12px", positionInPixle = 0, showOnlineStatus = 1 }) => {
    const containerStyle = {
        position: 'relative',
        display: 'inline-block',
    };

    const onlineIndicatorStyle = {
        position: 'absolute',
        bottom: positionInPixle,
        right: positionInPixle,
        width: indicSize,
        height: indicSize,
        borderRadius: '50%',
        backgroundColor: online ? '#28a745' : 'red', // Green for online, gray for offline
        border: '2px solid #ffffff',
    };

    return (
        <div className="avatar-container m-2" style={containerStyle}>
            <img
                src={avatarSrc || generalAvatar}
                alt="Avatar"
                className=" rounded-circle border "
                width={size}
                height={size}
            />
            {showOnlineStatus && <div className="online-indicator" style={onlineIndicatorStyle}></div>}
        </div >
    );
};

export default Avatar;
