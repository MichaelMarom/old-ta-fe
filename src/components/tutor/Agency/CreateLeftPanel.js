import React from 'react'
import LeftSideBar from '../../common/LeftSideBar'
import Input from '../../common/Input'
import TAButton from '../../common/TAButton'


const CreateLeftPanel = ({ isOpen, onClose }) => {
    return (
        <LeftSideBar
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className='bg-white h-100'>
                <div className="modal-header">
                    <h4 className="modal-title text-center" style={{ width: '100%' }}>Add Tutor</h4>
                </div>
                <div className='m-3'>
        
                <Input
                    setValue={() => { }}
                    label={"AcamydeId"}
                />
                </div>
                <div className='m-3'>

                <Input
                    setValue={() => { }}
                    label={"AcamydeId"}
                />
                </div>
                <TAButton buttonText={"Add"} />
            </div>
        </LeftSideBar>
    )
}

export default CreateLeftPanel