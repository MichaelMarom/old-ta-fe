import React from 'react'
import Tooltip from '../common/ToolTip'
import _ from 'lodash'

const EducationCards = ({state, college, country ,year, name}) => {
  return (
    <div className=" shadow-lg rounded-4 edu-card">
    <div className=" text-center">
      <h6 className="m-0">{name} Degree</h6>
    </div>
    <div className="card-body">
      <div className="rounded" style={{ border: "1px solid #ccc" }}>
        {/* Row 1 */}
        <div
          className="d-flex justify-content-between align-items-center p-2 bg-light"
          style={{ borderBottom: "1px solid #e0e0e0" }}
        >
          <div className="d-flex align-items-center">
            <div className="mx-1">
            </div>
            <span className=" me-2" style={{ fontSize: "13px" }}>
              College
            </span>
          </div>
          <p style={{ fontWeight: "500", fontSize: "12px" }}>
            {_.capitalize(college)}
          </p>
        </div>
        {/* Row 2 */}
        <div
          className="d-flex justify-content-between align-items-center p-2 bg-white"
          style={{ borderBottom: "1px solid #e0e0e0" }}
        >
          <div className="d-flex align-items-center">
            <div className="mx-1">
           
            </div>
            <span className=" me-2" style={{ fontSize: "13px" }}>
            Country
            </span>
          </div>
          <p style={{ fontWeight: "500", fontSize: "12px" }}>
            {_.capitalize(country)}
          </p>
        </div>
        {/* Row 3 */}
        <div
          className="d-flex justify-content-between align-items-center p-2 bg-light"
          style={{ borderBottom: "1px solid #e0e0e0" }}
        >
          <div className="d-flex align-items-center">
            <div className="mx-1">
             
            </div>
            <span className=" me-2" style={{ fontSize: "13px" }}>
            State
            </span>
          </div>
          <p style={{ fontWeight: "500", fontSize: "12px" }}>
            {_.capitalize(state) || "-"}
          </p>
        </div>
        {/* Row 4 */}
        <div
          className="d-flex justify-content-between align-items-center p-2 bg-white"
          style={{ borderBottom: "1px solid #e0e0e0" }}
        >
          <div className="d-flex align-items-center">
            <div className="mx-1">
             
            </div>
            <span className=" me-2" style={{ fontSize: "13px" }}>
             Year
            </span>
          </div>
          <p style={{ fontWeight: "500", fontSize: "12px" }}>
            {_.capitalize(year) || "-"}
          </p>
        </div>
      </div>
    </div>
    {/* <div
      style={{ fontSize: "12px", color: "gray" }}
      className="card-footer text-muted text-center"
    >
      Updated Recently
    </div> */}
  </div>
  )
}

export default EducationCards