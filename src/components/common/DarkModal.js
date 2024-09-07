import React from 'react'

const DarkModal = ({ open, onClose, src }) => {
    return (
        open && (
            <div
                className="modal show d-block"
                tabIndex="-1"
                role="dialog"
                onClick={onClose}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 1050 }}
            >
                <div
                    className="modal-dialog modal-fullscreen modal-dialog-centered"
                    role="document"
                >
                    <div className="modal-content border-0 bg-transparent">
                        <div className="modal-header border-0">
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body d-flex justify-content-center align-items-center p-0">
                            <img
                                src={src}
                                alt="Full Preview"
                                className="img-fluid"
                                style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}

export default DarkModal