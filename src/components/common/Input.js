import React from "react";
import Tooltip from "./ToolTip";
import { post_tutor_setup } from "../../axios/tutor";
import { useDispatch, useSelector } from "react-redux";
import { setTutor } from "../../redux/tutor/tutorData";

const Input = ({
  setValue = () => { },
  value,
  type = "text",
  tooltipText = "",
  editMode = true,
  label,
  required = true,
  mandatory = false,
  ...rest
}) => {
  const { tutor } = useSelector(state => state.tutor)
  const dispatch = useDispatch()
  const udpateTutorStatusToUnderRevew = async (e) => {
    console.log(tutor.Status, mandatory)
    const value = e.taregt.value
    if (mandatory && tutor.Status === "active" && (!value || !value.length)) {
      await post_tutor_setup({
        fname: tutor.FirstName,
        lname: tutor.LastName,
        mname: tutor.MiddleName,
        userId: tutor.userId,
        AgreementDate: null
      })
      dispatch(setTutor({ ...tutor, Status: "under-review", AgreementDate: null }))
    }
  }
  return (
    <label className="input w-100">
      <input
        className="input__field"
        onInput={(e) => { udpateTutorStatusToUnderRevew(); setValue(e.target.value) }}
        value={value}
        type={type}
        required={required}
        style={{ background: editMode ? "white" : "#e1e1e1" }}
        disabled={!editMode}
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
