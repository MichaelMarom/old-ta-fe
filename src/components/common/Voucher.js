import React from 'react';

const Voucher = ({ code, subject, VoucherStatus }) => {
    console.log(code, subject, VoucherStatus )
    return (
        <div className=" my-1 position-relative"
            style={{ maxWidth: '300px', width: "48%", minWidth: "48%", border: '1px solid #ced4da', borderRadius: '8px' }}>
            <div
                style={{ fontWeight: "500" }}
                className={`position-absolute p-1 small ${VoucherStatus === 'used' ? "text-danger" : "text-success"}`}>
                {VoucherStatus === "used" ? "expired" : "active"}</div>
            <div className="p-2 text-center mt-3" >
                <h5 className="m-0" style={{ fontWeight: 'bold', fontSize: '0.9em', color: '#007bff' }}>Voucher Code</h5>
                <p className="card-text" style={{ fontSize: '0.8em', fontWeight: '500', color: '#343a40', letterSpacing: '1px' }}>{code}</p>
                <p className="card-subtitle mb-2 text-muted" style={{ fontSize: '0.8em', color: '#6c757d' }}>{subject}</p>
            </div>
        </div>
    );
};

export default Voucher;
