import React, { useState } from 'react';
import BottomModal from '../BottomModal';
import Button from '../Button';

export const PostponeModal = ({ isOpen, onClose }) => {
    const [selectedDateTime, setSelectedDateTime] = useState('');

    const handleDateTimeChange = (e) => {
        // Extracting the date and hours part, then appending ':00'
        const newDateTime = e.target.value.split('T')[0] + 'T' + e.target.value.split('T')[1].split(':')[0] + ':00';
        setSelectedDateTime(newDateTime);
        console.log(newDateTime);
    };

    return (
        <BottomModal isOpen={isOpen} onClose={onClose}>
            <div className='w-100 d-flex justify-content-center align-items-center h-100'>
                <div className='w-25 d-flex h-25'>
                    <input
                        type="datetime-local"
                        className='form-control m-2'
                        value={selectedDateTime}
                        onChange={handleDateTimeChange}
                    />
                    <Button className='btn-success btn-sm'>Submit</Button>
                </div>
            </div>
        </BottomModal>
    );
};
