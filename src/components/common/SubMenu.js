import React from "react";

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
          margin: "0 0 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#efefef",
          opacity: ".7",
          height: "100%",
          transform: "skew(-0deg)",
        }}
        className="scroller-left"
        onClick={handle_scroll_left}
      >
        <div style={{ opacity: "1" }}>
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <ul>
        {faculty.map((item, index) => {
          return (
            <li
              className="tutor-tab-subject-data-menu"
              style={{
                background: item.Id === selectedFaculty ? "#2471A3" : "",
                color: item.Id === selectedFaculty ? " #F7F9F9" : "",
              }}
              onClick={() => setSelectedFaculty(item.Id)}
            >
              <p className="m-0" style={{ transform: "skew(44deg, 0deg)" }}>
                {item.Faculty}{" "}
              </p>
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
        <svg
          width="30px"
          height="30px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          ``
          <path
            d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default SubMenu;
