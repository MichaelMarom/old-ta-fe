import React, { useState } from 'react';
import Avatar from '../common/Avatar';

function DiscussionItem({ fetchingMessages, screenName, online, setSelectedChat, selectedChat, datetime, message, avatarSrc, unread, groupAmount, id }) {
    return (
        <li className={`ks-item w-100 ${unread ? 'ks-unread' : ''}`}
            style={{
                borderLeft: id === selectedChat.id ? '5px solid lightGreen' : "none",
            }}
            onClick={() => !fetchingMessages && setSelectedChat({ id, screenName, datetime, message, avatarSrc, unread, groupAmount })}
        >
            <div className="ks-body w-100">
                <div className="ks-name d-flex justify-content-start align-items-center">
                    <Avatar avatarSrc={avatarSrc} online={online} />
                    <h6 className='text-start'> {screenName}</h6>
                    <span className="ks-datetime">{datetime}</span>
                </div>
            </div>
        </li>
    );
}

function DiscussionList({ selectedChat, fetchingMessages, discussions, setSelectedChat }) {
    return (
        <div className="ks-body jspScrollable" data-auto-height=""
            style={{ overflowY: 'auto', overflowX: "hidden", padding: '0px', height: "calc(100% - 60px)" }} tabIndex="0">
            <div className="jspContainer">
                <div className="jspPane" style={{ padding: '0px', top: '0px' }}>
                    <ul className="ks-items d-flex flex-column p-0">
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

function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <div className='border-bottom'>
            <input
                type="search"
                className="form-control border-0 m-0"
                placeholder="Search"
                style={{ height: "60px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query when user types
            />
        </div>
    );
}

export default function Chats({ isLoading, fetchingMessages, setSelectedChat, selectedChat, discussionData }) {
    const [searchQuery, setSearchQuery] = useState(""); // State to store the search input
    // Filter discussions based on the search query (case-insensitive)
    const filteredDiscussions = discussionData?.filter(discussion => {
        return discussion?.screenName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || // Search by screenName
            discussion?.message?.toLowerCase()?.includes(searchQuery?.toLowerCase())      // Optional: Search by message
    }
    );

    return (
        <div className="ks-discussions w-25">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {(!!filteredDiscussions?.length) ? (
                <DiscussionList
                    setSelectedChat={setSelectedChat}
                    discussions={filteredDiscussions}  // Use filtered discussions
                    fetchingMessages={fetchingMessages}
                    selectedChat={selectedChat}
                />
            ) : (
                <div className='border rounded-pill shadow px-4 m-2'>
                    No results found for your search.
                </div>
            )}
        </div>
    );
}
