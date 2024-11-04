import React from 'react';

const Voucher = ({ code, subject }) => {
    return (
        <div className=" my-1" style={{ maxWidth: '300px',width:"48%" ,minWidth:"48%", border: '1px solid #ced4da', borderRadius: '8px' }}>
            <div className="p-2 text-center" >
                <h5 className="m-0" style={{ fontWeight: 'bold', fontSize: '0.9em', color: '#007bff' }}>Voucher Code</h5>
                <p className="card-text" style={{ fontSize: '0.8em', fontWeight: '500', color: '#343a40', letterSpacing: '1px' }}>{code}</p>
                <p className="card-subtitle mb-2 text-muted" style={{ fontSize: '0.8em', color: '#6c757d' }}>{subject}</p>
            </div>
        </div>
    );
};

export default Voucher;
