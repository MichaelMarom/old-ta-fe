
import React, { useState } from 'react';
import { BsPlus, BsX } from 'react-icons/bs';

const GradePills = ({ grade, editable, setGrades, grades, hasIcon = true }) => {
    const [selected, setSelected] = useState(false);
    const handleToggle = () => {
        setSelected(!selected);
        const filteredGrades = grades.filter(item => item !== grade)
        if (filteredGrades.length !== grades.length) {
            setGrades(filteredGrades)
        } else
            setGrades([...grades, grade])
    };

    return (
        <div style={{
            gap: "10px", height: "20px", cursor: 'pointer',
            transition: 'background-color 0.3s, box-shadow 0.3s',
            pointerEvents: editable ? "auto" : "none"
        }}
            className={` m-2 rounded-pill p-2 d-flex align-items-center justify-content-between border shadow 
            ${!grades.find(item => item === grade) ? 'text-bg-primary' : 'text-bg-success'}`}
            onClick={handleToggle}
        >
            <p className='m-0' style={{ fontSize: "14px", whiteSpace: 'nowrap' }}> {grade}</p>
            {hasIcon && (grades.find(item => item === grade) ? <BsX /> : <BsPlus />)}
        </div>
    );
};

export default GradePills;
