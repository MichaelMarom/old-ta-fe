import React from 'react'
import LeftSideBar from '../common/LeftSideBar'

const SendFileModal = ({name,file, isOpen, handleClose}) => {
  return (
    <LeftSideBar isOpen={isOpen} onClose={handleClose} >
        <div>
            {name}
        
        </div>
    </LeftSideBar>
  )
}

export default SendFileModal