import React from 'react'

const Select = ({ onChange, value, setValue, options, placeholder }) => {
    return (
        <select className='form-select' onChange={onChange} placeholder={placeholder}>
            {options.map(option => {
                return <option value={option.value}>{option.text}</option>
            })}
        </select>
    )
}

export default Select