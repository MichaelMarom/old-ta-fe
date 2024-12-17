import React, { useEffect, useState } from "react";
import { IoClose, IoReloadCircle } from "react-icons/io5";

const FloatingMessage = ({ message, setIncomingNotificationMessage }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() =>{
            setIncomingNotificationMessage({})
            setIsVisible(false)}, 5000); // Automatically hide after 5 seconds

        return () => clearTimeout(timeout); // Cleanup on unmount
    }, []);

    const handleClose = () => {
        setIsVisible(false); // Trigger fade-out animation
    };

    if (!isVisible) return null;

    return (
        <div
            className="alert alert-warning mt-2 p-0 p-2"
            role="alert"
            style={{ width: "400px", position: "fixed", top: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 1050 }}
        >
            <div className="d-flex justify-content-between w-100 align-items-center">
                <div className="d-flex flex-column">
                    <strong>{message.title}</strong>
                    <p>{message.message}</p>
                </div>
                <IoClose size={20} className="cursor-pointer" onClick={handleClose} />
            </div>
        </div>
    );
};


export default FloatingMessage;

