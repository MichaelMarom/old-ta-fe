import React from 'react'
import CenteredModal from '../common/Modal'
import PDFViewer from '../tutor/Education/PDFViewer'

const DegreeModal = ({ open, onClose, docUrl }) => {
    console.log(docUrl)
    return (
        <CenteredModal show={open} handleClose={onClose} title={"Degree"}>
            <div>
                {docUrl ?
                    <>
                        {docUrl.split('.').pop() !== "pdf" ? <img src={docUrl} alt='deoc' width={450} height={500} /> :
                            <PDFViewer pdfUrl={docUrl} />
                            // <object data={docUrl} type="application/pdf" width="100%" height="100%">
                            //     <p>Alternative text - include a link <a href={docUrl}>to the PDF!</a></p>
                            // </object>

                        //     <iframe
                        //     src={docUrl}
                        //     title="Degree PDF"
                        //     style={{ width: '100%', height: '500px', border: 'none' }}
                        //   />
                        // <object width="100%"  height="100%" data={docUrl}  type="application/pdf" />
                        }
                    </> :
                    <div className='text-danger'>"No Certificate by Tutor"</div>
                }
            </div>
        </CenteredModal>
    )
}

export default DegreeModal