import React from 'react';
import BTN_ICON from '../../assets/images/button__icon.png'

function Button({ loading = false, type = "button", handleClick = () => { },
    buttonText, className = '', ...otherProps }) {
    return (
        <button
            style={{ cursor: "poniter", ...otherProps.style }}
            className={`action-btn btn save-btn ${className}`}
            disabled={loading || otherProps.disabled}
            type={type}
            onClick={handleClick}
            {...otherProps}
        >
            <div className="button__content">
                <div className="button__icon">
                    <img src={BTN_ICON} alt={"btn__icon"} style={{
                        animation: loading ? "spin 2s linear infinite" : 'none',
                    }} />
                </div>
                <p className="button__text">{buttonText}</p>
            </div>
        </button>
    );
}

export default Button;
