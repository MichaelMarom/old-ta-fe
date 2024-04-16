import React from 'react';
import Avatar from '../common/Avatar';

function DiscussionItem({ fetchingMessages, screenName, online, setSelectedChat, selectedChat, datetime, message, avatarSrc, unread, groupAmount, id }) {
    return (
        <li className={`ks-item w-100 ${unread ? 'ks-unread' : ''}`}
            style={{
                borderLeft: id === selectedChat.id ? '5px solid lightGreen' : "none",

            }}
            onClick={() => !fetchingMessages && setSelectedChat({ id, screenName, datetime, message, avatarSrc, unread, groupAmount })}
        >
            <div className="ks-body w-100 ">
                <div className="ks-name d-flex justify-content-start align-items-center"
                >
                    <Avatar avatarSrc={avatarSrc}
                        online={online}
                    />
                    <h6 className='text-start'>  {screenName}</h6>
                    <span className="ks-datetime">{datetime}</span>
                </div>
            </div>
        </li>
    );
}

function DiscussionList({ selectedChat, fetchingMessages, discussions, setSelectedChat }) {
    return (
        <div className="ks-body jspScrollable" data-auto-height=""
            style={{ overflowY: 'auto', overflowX: "hidden", padding: '0px', width: '339px' }} tabIndex="0">
            <div className="jspContainer" style={{ width: '339px', height: '550px' }}>
                <div className="jspPane" style={{ padding: '0px', top: '0px', width: '329px' }}>
                    <ul className="ks-items d-flex flex-column">
                        {discussions.map((discussion, index) => (
                            <DiscussionItem
                                fetchingMessages={fetchingMessages}
                                setSelectedChat={setSelectedChat}
                                key={index}
                                datetime={discussion.datetime}
                                message={discussion.message}
                                avatarSrc={discussion.avatarSrc}
                                unread={discussion.unread}
                                groupAmount={discussion.groupAmount}
                                online={discussion.online}
                                id={discussion.id}
                                screenName={discussion.screenName}
                                selectedChat={selectedChat}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function SearchBar() {
    return (
        <div className='border-bottom' >
            <input type="search" className="form-control border-0 m-0" placeholder="Search" style={{ height: "60px" }} />
        </div>
    );
}

export default function Chats({ isLoading, fetchingMessages, setSelectedChat, selectedChat, discussionData }) {
    return (
        <div className="ks-discussions">
            <SearchBar />
            {(!!discussionData.length) ? <DiscussionList
                setSelectedChat={setSelectedChat}
                discussions={discussionData}
                fetchingMessages={fetchingMessages}
                selectedChat={selectedChat}
            /> :
                <div className='border rounded-pill shadow px-4 m-2'>
                    Students will contact you. Then Chat will apear here.
                </div>

            }
        </div>
    );
}
