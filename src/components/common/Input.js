import React from 'react'

const Input = ({ label, placeholder, vertical = true, inputGroup = false, inputGroupText, onChange, ...rest }) => {
    return (
        <div className={`d-flex align-items-center ${vertical ? 'flex-column' : 'flex-row'}`}>
            <label className={`text-center mr-2 p-1`} style={{ height: "fit-content", fontSize: "12px" }}>{label}</label>
            {inputGroup && <label style={{ height: "fit-content", fontSize: "12px" }} className={`p-1 text-center ${inputGroup ? "input-group-text" : ""}`} >
                {inputGroupText}</label>}
            <input
                style={{ height: "fit-content", fontSize: "12px" }}
                onChange={e => onChange(e.target.value)} className='form-control m-0' value={rest.value} type="text" placeholder={placeholder} {...rest} />
            {inputGroup && <span className="input-group-text p-1" style={{ height: "fit-content", fontSize: "12px" }}>.00</span>}
        </div>
    )
}

export default Input