import React from "react";

const Input = ({
  setValue,
  value,
  editMode = true,
  label,
  required = true,
}) => {
  return (
    <label className="input w-100">
      <input
        className="input__field"
        onInput={(e) => setValue(e.target.value)}
        value={value}
        type="text"
        required={required}
        disabled={!editMode}
      />
      <span className="input__label"> {label}</span>
    </label>
  );
};

export default Input;
