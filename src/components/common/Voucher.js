import React, { useState } from 'react';
import { FaShareAlt } from 'react-icons/fa';

const Voucher = ({ code, subject, VoucherStatus, sharedVoucher, setSharedVoucher }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isShared, setIsShared] = useState(false);

    const handleMouseEnter = () => {
        if (VoucherStatus !== 'used') {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleShare = () => {
        setIsShared(true);
        setSharedVoucher({ code, subject }); // Store code and subject in state
        // Additional code for sharing functionality can go here
    };

    return (
        <div
            className="my-1 position-relative"
            style={{
                maxWidth: '300px',
                width: '48%',
                minWidth: '48%',
                border: '1px solid #ced4da',
                borderRadius: '8px',
                overflow: 'hidden',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                style={{ fontWeight: '500' }}
                className={`position-absolute p-1 small ${VoucherStatus === 'used' ? 'text-danger' : 'text-success'}`}
            >
                {VoucherStatus === 'used' ? 'expired' : 'active'}
            </div>
            <div className="p-2 text-center mt-3">
                <h5 className="m-0" style={{ fontWeight: 'bold', fontSize: '0.9em', color: '#007bff' }}>
                    Voucher Code
                </h5>
                <p className="card-text" style={{ fontSize: '0.8em', fontWeight: '500', color: '#343a40', letterSpacing: '1px' }}>
                    {code}
                </p>
                <p className="card-subtitle mb-2 text-muted" style={{ fontSize: '0.8em', color: '#6c757d' }}>
                    {subject}
                </p>
                {isShared && <p className="small text-info mt-2">Voucher shared!</p>}
            </div>

            {isHovered && VoucherStatus !== 'used' && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        cursor: 'pointer',
                    }}
                    onClick={handleShare}
                >
                    <FaShareAlt size={30} />
                </div>
            )}
        </div>
    );
};

export default Voucher;
