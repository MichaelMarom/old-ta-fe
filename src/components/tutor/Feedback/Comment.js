import React, { useState } from 'react';
import { FaComment, FaRegComment } from 'react-icons/fa';

const commentContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
};
const commentIconStyle = {
    fontSize: '24px', // Adjust the size as needed
};

const Comment = ({ comment }) => {
    const [isHovered, setIsHovered] = useState(false);
    const commentTextStyle = {
        display: isHovered ? 'block' : 'none',
        minWidth: '17rem',
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '5px',
        borderRadius: '5px',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    };

    return (
        <div
            style={commentContainerStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {comment ?
                <>
                    {<FaComment style={commentIconStyle} color={`green`} />}
                    <div style={commentTextStyle}>{comment}</div>
                </>
                : <FaRegComment size={20} />
            }
        </div>
    );
};

export default Comment;
