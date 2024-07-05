import React from 'react'
import { MandatoryFieldLabel } from '../tutor/TutorSetup'

const TextArea = ({ value,
    setValue,
    maxLength = 300,
    editMode = true,
    label,
    ...rest }) => {
    return (
        <div className='w-100'  >
            <div
                className="w-100 text-end"
                style={{
                    fontWeight: "900",
                    fontSize: "14px",
                    float: "right",
                }}
            >
                {value.length}/{maxLength}
            </div>
            <div className="input w-100">
                <textarea
                    className="form-control m-0 shadow input__field"
                    value={value}
                    maxLength={maxLength}
                    onInput={(e) => setValue(e.target.value)}
                    style={{ width: "100%", padding: "10px", height: rest.height }}
                    spellCheck="true"
                    disabled={!editMode}
                    {...rest} />
                <span
                    className="d-flex"
                    style={{
                        position: "absolute",
                        background: "transparent",
                        top: "-5px",
                        left: "10px",
                        padding: "2px",
                        fontSize: "12px",
                    }}
                >{label}
                </span>
            </div>
        </div>
    )
}

export default TextArea