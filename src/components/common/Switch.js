import React from 'react';
import { toast } from 'react-toastify';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './ToggleSwitch.css'; // Assuming you have a CSS file named ToggleSwitch.css for styling

const ToggleSwitch = ({ isChecked, setIsChecked, authorized = true }) => {

    const handleToggle = () => {
        authorized ?
            setIsChecked(!isChecked)
            : toast.warning('You do not have access to modify collaborators!')
    };

    return (
        <div className="text-center">
            <input
                disabled={!authorized}
                type="checkbox"
                id="switch"
                className="checkbox"
                checked={isChecked}
                onChange={handleToggle}
            />

            <label
                htmlFor="switch"
                className={isChecked ? "toggle-collab checked" : "toggle-collab "}
            >
                <div className={`p-1 w-100 h-100 d-flex ${isChecked ? 'justify-content-start' : 'justify-content-end'} align-items-center`}>
                    {isChecked ? <p className='m-0 '>Student</p>
                        : <p className="m-0 text-light">Student</p>}
                </div>
            </label>
        </div>
    );
};

export default ToggleSwitch;


