import React from "react";
import Tooltip from "./ToolTip";
import { useDispatch, useSelector } from "react-redux";

const Input = ({
  setValue = () => { },
  value,
  type = "text",
  tooltipText = "",
  editMode = true,
  disabled = false,
  label,
  required = true,
  mandatory = false,
  ...rest
}) => {
  const udpateTutorStatusToUnderRevew = async (e) => {
  }
  return (
    <label className="input w-100">
      <input
        className="input__field"
        onInput={(e) => { udpateTutorStatusToUnderRevew(e); setValue(e.target.value) }}
        value={value}
        type={type}
        required={required}
        style={{ background: editMode ? "white" : "rgb(233 236 239)" }}
        disabled={!editMode || disabled}
        {...rest}
      />
      <span className="input__label roboto-medium d-flex align-items-end roboto-regular" style={{ background: "transparent", color: "black" }} >
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
