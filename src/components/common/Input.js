import React from "react";
import Tooltip from "./ToolTip";
import { post_tutor_setup } from "../../axios/tutor";
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
  const { tutor } = useSelector(state => state.tutor)
  const dispatch = useDispatch()
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
      <span className="input__label d-flex align-items-end " style={{ top: "2px", background: "transparent", color: "black" }} >
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
