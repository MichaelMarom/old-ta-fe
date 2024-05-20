import React from 'react'

const MobileScreen = () => {
    return (
        <div className='fs-4 text-danger d-flex justify-content-center align-items-center'
            style={{ height: '100vh' }}
        >
            <p className='text-center' style={{width:"400px"}}>
                Your screen resolution is less than 1200 pixels.
                Please consider changing your PC to a higher resolution.</p>

        </div>
    )
}

export default MobileScreen