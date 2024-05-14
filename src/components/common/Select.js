import React from "react";
import Tooltip from "./ToolTip";

const Select = ({
  setValue,
  value,
  editMode = true,
  options = null,
  children,
  label,
  TooltipText,
}) => {
  return (
    <label className="input w-100">
      <select
        className="input__field"
        style={{ height: "50px", background: editMode ? "white" : "#e1e1e1" }}
        onInput={(e) => setValue(e.target.value)}
        value={value}
        disabled={!editMode}
        required
      >
        {options ? options : children}
      </select>
      <span className="input__label" style={{ top: "2px" }}>
        {TooltipText && !!TooltipText.length && (
          <Tooltip
            width="200px"
            text={TooltipText}
          />
        )}{" "}
        {label}
      </span>
    </label>
  );
};

export default Select;
