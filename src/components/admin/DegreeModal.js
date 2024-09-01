import React from 'react'
import CenteredModal from '../common/Modal'
import PDFViewer from '../tutor/Education/PDFViewer'

const DegreeModal = ({ open, onClose, docUrl }) => {
    console.log(docUrl)
    return (
        <CenteredModal minWidth='800px' style={{minWidth:"800px"}} show={open} handleClose={onClose} title={"Degree"}>
            <div>
                {docUrl ?
                    <>
                        {docUrl.split('.').pop() !== "pdf" ? <img src={docUrl} alt='deoc' width={450} height={500} /> :
                            <PDFViewer pdfUrl={docUrl} width={"770px"} height='auto' />
                        }
                    </> :
                    <div className='text-danger'>"No Certificate by Tutor"</div>
                }
            </div>
        </CenteredModal>
    )
}

export default DegreeModal