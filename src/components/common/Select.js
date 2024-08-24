import React from "react";
import Tooltip from "./ToolTip";

const Select = ({
  setValue,
  value,
  editMode = true,
  disabled = false,
  options = null,
  children,
  label,
  onChange = null,
  TooltipText,
  required = false,
  mandatory = false,
}) => {
  return (
    <label className="input w-100">
      <select
        className="input__field"
        style={{
          height: "50px",
          background: editMode ? "white" : "rgb(233 236 239)",
        }}
        onChange={(e) => {
          onChange ? onChange(e) : setValue(e.target.value);
        }}
        value={value}
        disabled={!editMode || disabled}
        required={required}
      >
        {options ? options : children}
      </select>
      <span
        className="input__label  d-flex align-items-end"
        style={{ background: "transparent", color: "#555555 " }}
      >
        {TooltipText && !!TooltipText.length && (
          <Tooltip width="200px" text={TooltipText} />
        )}
        {label}
      </span>
    </label>
  );
};

export default Select;
