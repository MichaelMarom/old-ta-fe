import React from "react";
import Tooltip from "./ToolTip";

const Input = ({
  setValue = () => { },
  value,
  type = "text",
  tooltipText = "",
  editMode = true,
  label,
  required = true,
  ...rest
}) => {
  return (
    <label className="input w-100">
      <input
        className="input__field"
        onInput={(e) => setValue(e.target.value)}
        value={value}
        type={type}
        required={required}
        style={{ background: editMode ? "white" : "#e1e1e1" }}
        disabled={!editMode}
        {...rest}
      />
      <span className="input__label d-flex align-items-end" style={{ top: "2px",background:"transparent"  }} >
        {tooltipText && !!tooltipText.length && (
          <Tooltip
            width="200px"
            text={tooltipText}
          />
        )}
      {label}
      </span>
    </label>
  );
};

export default Input;
