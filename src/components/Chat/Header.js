import React from 'react'
import Avatar from '../common/Avatar'

export const Header = ({ selectedChat }) => {
    return (
        <div className="ks-header d-flex justify-content-start">
            <Avatar online={selectedChat.online} avatarSrc={selectedChat.avatarSrc} />
            <div className="ks-description">
                <div className="ks-name">{selectedChat.screenName}</div>
                <div className="ks-amount">{selectedChat.online ? 'Online' : 'Offline'}</div>
            </div>
        </div>
    )
}
