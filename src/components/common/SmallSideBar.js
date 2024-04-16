import React, { useState } from 'react';
import { BiSolidChevronsRight } from "react-icons/bi";

const SmallSideBar = ({ message = '', inMins }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const sidebarWidth = isOpen ? '25%' : '50px';
    const sidebarAnimation = isOpen ? 'slideInRight' : 'slideOutRight';

    return (
        <div>
            <div
                style={{
                    width: sidebarWidth,
                    transition: 'width 0.5s ease',
                    position: 'fixed',
                    top: '50px',
                    right: 0,
                    zIndex: 1006,
                    height: "90px",
                    overflow: 'hidden',
                }}
            >
                <div
                    className={`animated ${sidebarAnimation}`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                >
                    <div style={{ display: 'flex', marginTop: '20px' }}>
                        <div className=' border p-2 rounded bg-dark m-0 cursor-pointer'
                            style={{ width: '50px', height: "50px" }}
                            onClick={toggleSidebar}
                        >
                            <BiSolidChevronsRight
                                style={{ animation: inMins ? 'blinking 1s infinite' : 'none' }}
                                color={inMins ? 'limegreen' : 'white'} size={32} /></div>
                        {<div className='p-2 text-bg-secondary w-100 h-100 rounded border'>
                            {message.length ? message : 'No Upcoming Events for the next 24 hours!'}
                        </div>}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SmallSideBar;
