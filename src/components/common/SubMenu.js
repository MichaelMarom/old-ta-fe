import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const SubMenu = ({ faculty, selectedFaculty, setSelectedFaculty }) => {
  let handle_scroll_right = () => {
    let div = document.querySelector(".tutor-tab-subject-data-tabs");
    let scroll_elem = div.children[1];
    let w = scroll_elem.offsetWidth;
    scroll_elem.scrollLeft = w;
  };

  let handle_scroll_left = () => {
    let div = document.querySelector(".tutor-tab-subject-data-tabs");
    let scroll_elem = div.children[1];
    let w = scroll_elem.offsetWidth;
    scroll_elem.scrollLeft = -w;
  };

  return (
    <div className="tutor-tab-subject-data-tabs m-1">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#efefef",
          opacity: ".7",
          height: "100%",
          width:"50px",
          transform: "skew(-0deg)",
        }}
        className="scroller-left"
        onClick={handle_scroll_left}
      >
        <div style={{ opacity: "1" }}>
        <FaChevronLeft />
        </div>
      </div>

      <ul style={{margin:"0 30px"}}>
        {faculty.map((item, index) => {
          return (
            <li
              key={index}
              className="tutor-tab-subject-data-menu"
              style={{
                background: item.Id === selectedFaculty ? "#2471A3" : "",
                color: item.Id === selectedFaculty ? " #F7F9F9" : "",
              }}
              onClick={() => setSelectedFaculty(item.Id)}
            >
              <h6 className="m-0" style={{ transform: "skew(44deg, 0deg)" }}>
                {item.Faculty}{" "}
              </h6>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          margin: "0 0 0 0",
          background: "#efefef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: ".7",
          height: "100%",
          transform: "skew(-0deg)",
        }}
        className="scroller-right"
        onClick={handle_scroll_right}
      >
        <FaChevronRight />
      </div>
    </div>
  );
};

export default SubMenu;
