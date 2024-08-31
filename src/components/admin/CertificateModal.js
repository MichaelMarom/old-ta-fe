import React from 'react'
import CenteredModal from '../common/Modal'
import PDFViewer from '../tutor/Education/PDFViewer'

const CertificateModal = ({ open, onClose, docUrl }) => {
    console.log(docUrl)
    return (
        <CenteredModal show={open} handleClose={onClose} title={"Certificate"}>
            <div>
                {docUrl ?
                    <>
                        {docUrl.split('.')[1]!=="pdf" ? <img src={docUrl} alt='deoc' width={450} height={500} />:
                        <PDFViewer pdfUrl={docUrl} />}
                    </> :
                    <div className='text-danger'>"No Certificate by Tutor"</div>
                }
            </div>
        </CenteredModal>
    )
}

export default CertificateModal