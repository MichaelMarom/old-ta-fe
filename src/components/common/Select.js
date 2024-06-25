import React from "react";
import Tooltip from "./ToolTip";
import { useDispatch, useSelector } from "react-redux";
import { setTutor } from "../../redux/tutor/tutorData";
import { post_tutor_setup } from "../../axios/tutor";

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
  const { tutor } = useSelector(state => state.tutor)
  const dispatch = useDispatch()
  const udpateTutorStatusToUnderRevew = async (e) => {
    console.log(tutor.Status, mandatory)
    const value = e?.target?.value
    // if (mandatory && tutor.Status === "active" && (!value || !value?.length)) {
    //   await post_tutor_setup({
    //     fname: tutor.FirstName,
    //     lname: tutor.LastName,
    //     mname: tutor.MiddleName,
    //     userId: tutor.userId,
    //     Status: "under-review",
    //     AgreementDate: null,
    //     Country: value
    //   })
    //   dispatch(setTutor({ ...tutor, Status: "under-review", AgreementDate: null, Country: value }))
    // }
  }

  return (
    <label className="input w-100">
      <select
        className="input__field"
        style={{ height: "50px", background: editMode ? "white" : "rgb(233 236 239)" }}
        onChange={(e) => { udpateTutorStatusToUnderRevew(e); onChange ? onChange(e) : setValue(e.target.value) }}
        value={value}
        disabled={!editMode || disabled}
        required={required}
      >
        {options ? options : children}
      </select>
      <span className="input__label d-flex align-items-end"
        style={{ top: "2px", background: "transparent", color: "black" }}>
        {TooltipText && !!TooltipText.length && (
          <Tooltip
            width="200px"
            text={TooltipText}
          />
        )}
        {label}
      </span>
    </label>
  );
};

export default Select;
