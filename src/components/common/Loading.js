import React from 'react';
import Loading_Icon from '../../assets/images/button__icon.png'

const Loading = ({ height = "100vh", iconSize = "100px", loadingText = null }) => {
    return (
        <div className="d-flex justify-content-center align-items-center gap-2" style={{ height }}>
            {/* <div className="spinner-border" role="status" style={{ width: iconSize, height: iconSize }}>
            </div> */}
            <img src={Loading_Icon} alt='loading icon'
                style={{
                    height: iconSize,
                    animation: "spin 2s linear infinite",
                }} />
            {loadingText && <span className="sr-only">{loadingText}</span>}
        </div>
    );
};

export default Loading;
