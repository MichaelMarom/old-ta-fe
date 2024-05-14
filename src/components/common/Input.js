import React from "react";
import Tooltip from "./ToolTip";

const Input = ({
  setValue,
  value,
  tooltipText="",
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
        type="text"
        required={required}
        style={{ background: editMode ? "white" : "#e1e1e1" }}
        disabled={!editMode}
        {...rest}
      />
     <span className="input__label" style={{ top: "2px" }}>
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
