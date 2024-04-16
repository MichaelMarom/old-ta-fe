import React from 'react';

function Button({ loading = false, type = "button", handleClick = () => { },
    children, className = '', ...otherProps }) {

    return (
        <button
            className={`btn ${className}`}
            disabled={loading}
            type={type}
            onClick={handleClick}
            {...otherProps}
        >
            {loading &&
                <>
                    {/* <img src={Loading_Icon} alt='loading icon'
                style={{
                    height:"100px",
                    animation: "spin 2s linear infinite",
                }} /> */}
                    {/* <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                    ></span> */}
                    {/* {otherProps.loadingText} */}
                </>
            }
            {children}
            {/* {!loading && children} */}
        </button>
    );
}

export default Button;
