import React, { useState } from "react";
import Tooltip from "./ToolTip";

const Input = ({
  setValue = () => {},
  value,
  validationFn = () => {},
  type = "text",
  tooltipText = "",
  editMode = true,
  disabled = false,
  label,
  required = true,
  mandatory = false,
  setErrors=()=>{},
  fieldName,
  errors={},
  ...rest
}) => {
  console.log(errors);
  return (
    <label className="input w-100">
      <input
        className="input__field"
        onInput={(e) => {
          setErrors({...errors, [fieldName]:validationFn(e.target.value)});
          setValue(e.target.value);
        }}
        value={value || ""}
        type={type}
        required={required}
        style={{ background: editMode ? "white" : "rgb(233 236 239)" }}
        disabled={!editMode || disabled}
        {...rest}
      />
      <p className="text-danger small">{errors[fieldName]}</p>
      <span
        className="input__label d-flex align-items-end "
        style={{ background: "transparent", color: "#555555",
         }}
      >
        {tooltipText && !!tooltipText.length && (
          <Tooltip width="200px" text={tooltipText} />
        )}
        {label}
      </span>
    </label>
  );
};

export default Input;
