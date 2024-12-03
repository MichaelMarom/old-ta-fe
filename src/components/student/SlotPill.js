import React from 'react';
import { showDate } from '../../utils/moment';
import { slotPillDateFormat } from '../../constants/constants';

const SlotPill = ({ selectedSlots, handleRemoveSlot, selectedType }) => {
    const bookedPillColor = { border: 'orange', backgroundColor: '#ffff404f' };
    const introPillColor = { border: 'rgb(71 180 255)', backgroundColor: 'rgb(15 121 187 / 22%)' };

    return (
        <div className='d-flex flex-wrap' style={{ width: '100%' }}>
            {selectedSlots.map((item, index) => (
                <button
                    key={index}
                    className={`text-xs p-1 m-1 pill d-flex justify-content-center btn align-item-center gap-2 rounded-pill ${item.type}`}
                    style={{
                        border: `1px solid ${selectedType ? selectedType === 'intro' ?
                            introPillColor.border : selectedType === 'booked' ?
                                bookedPillColor.border : 'orange ' : 'black'}`,

                        backgroundColor: `${selectedType ? selectedType === 'intro' ?
                            introPillColor.backgroundColor : selectedType === 'booked' ?
                                bookedPillColor.backgroundColor : '#ffff404f' : ' #e1e1e1'}`,

                        fontSize: "12px",
                        color: `${selectedType ? selectedType === 'intro' ? introPillColor.border : selectedType === 'booked' ?
                            bookedPillColor.border : 'orange' : 'black'}`
                    }}
                >
                    {showDate(item.start, slotPillDateFormat)}
                    <span
                        className="remove-icon ml-2 cursor-pointer"
                        style={{
                            color: ` ${selectedType ? selectedType === 'intro' ?
                                introPillColor.border : selectedType === 'booked' ?
                                    bookedPillColor.border : '#b08d13' : "black"}`
                        }}
                        onClick={() => handleRemoveSlot(item.start)}
                    >
                        &#x2715;
                    </span>
                </button>
            ))}
        </div>
    );
};

export default SlotPill;
