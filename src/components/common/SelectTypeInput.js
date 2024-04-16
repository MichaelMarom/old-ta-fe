import React, { useState } from 'react';

const TypeAndSelectInput = ({ options, setInputValue, inputValue }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSelectOption = (option) => {
        setInputValue(option);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='mb-2'>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <input
                    type="text"
                    className='form-control m-0'
                    value={inputValue}
                    onChange={handleInputChange}
                />
                {options.length ?
                    <>
                        <button
                            type='button'
                            onClick={toggleDropdown}
                            className='m-0 p-0'
                            style={{
                                position: 'absolute',
                                right: '5px',
                                top: '45%',
                                transform: 'translateY(-50%)',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                            }}
                        >
                            &#9660; {/* Downward arrow character */}
                        </button>
                        {isOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    border: '1px solid #ccc',
                                    zIndex: 1,
                                    backgroundColor: '#fff',
                                    boxShadow: "rgba(0, 0, 0, 0.1) 6px 5px 11px 4px",
                                    maxHeight: "400px",
                                    overflowY: "auto"
                                }}
                            >
                                {options.map((option, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSelectOption(option)}
                                        style={{
                                            width: "150px",
                                            height: "25px",
                                            cursor: 'pointer',
                                            ':hover': {
                                                backgroundColor: '#f0f0f0',
                                            },
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </> : null
                }
            </div>

        </div>
    );
};

export default TypeAndSelectInput;
