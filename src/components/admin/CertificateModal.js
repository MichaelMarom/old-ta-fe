import React from 'react'
import CenteredModal from '../common/Modal'
import PDFViewer from '../tutor/Education/PDFViewer'

const CertificateModal = ({ open, onClose, docUrl }) => {
    return (
        <CenteredModal minWidth='800px' style={{ minWidth: "800px" }} show={open} handleClose={onClose} title={"Certificate"}>
            <div>
                {docUrl ?
                    <>
                        {docUrl.split('.').pop() !== "pdf" ? <img src={docUrl} alt='deoc' width={770} height={770} /> :
                            <PDFViewer pdfUrl={docUrl} width={"770px"} height='auto' />
                        }
                    </> :
                    <div className='text-danger'>"No Certificate by Tutor"</div>
                }
            </div>
        </CenteredModal>
    )
}

export default CertificateModal