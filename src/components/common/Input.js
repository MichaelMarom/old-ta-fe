import React from "react";

const Input = ({
  setValue,
  value,
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
      <span className="input__label"> {label}</span>
    </label>
  );
};

export default Input;
