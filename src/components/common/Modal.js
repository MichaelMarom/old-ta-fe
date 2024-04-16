import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const CenteredModal = ({ show, handleClose, title, children, ...rest }) => {
    const modalDisplay = show ? 'd-block' : 'd-none';

    return (
        <div className={`modal-overlay ${modalDisplay}`} onClick={handleClose}>
            <div className={`modal ${modalDisplay}`} tabIndex="-1" role="dialog"
                style={{ display: modalDisplay, background: '#00000059' }} >
                <div className=" modal-dialog modal-dialog-centered" role="document" >
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} {...rest}>
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="close" onClick={handleClose} aria-label="Close">
                                <AiOutlineClose />
                            </button>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CenteredModal;
