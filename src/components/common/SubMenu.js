import React, { useRef } from "react";
import { IoChevronBackCircle, IoChevronBackCircleOutline, IoChevronForwardCircle, IoChevronForwardCircleOutline } from "react-icons/io5";

const SubMenu = ({ faculty, selectedFaculty, setSelectedFaculty }) => {

  const scrollRef = useRef()
  const scrollStep = 500
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= scrollStep;
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollStep;
    }
  };

  return (
    <div className=" m-1 d-flex " style={{ background: "rgb(33 47 61)", color: "white", borderRadius: "10px", padding: "10px" }}>
      {/* <div
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
        onClick={handleScrollLeft}
      > */}
      <div
        onClick={handleScrollLeft}
        className="rounded-circle border d-flex justify-content-center align-items-center nav-circle"
      >
        <IoChevronBackCircle color="#47c176" size={30} />
      </div>
      {/* <div style={{ opacity: "1" }}>
        <FaChevronLeft />
        </div> */}
      {/* </div> */}

      <ul ref={scrollRef}>
        {faculty.map((item, index) => {
          return (
            <li
              id={item.Id === selectedFaculty ? 'tutor-tab-header-list-active1' : ''}
              className="navitem navitem-li"
              key={index}
              style={{
                // background: item.Id === selectedFaculty ? "#2471A3" : "",
                color: item.Id === selectedFaculty ? " #F7F9F9" : "",
              }}
              onClick={() => setSelectedFaculty(item.Id)}
            >
              <h6 className="m-0">
                {item.Faculty}{" "}
              </h6>
            </li>
          );
        })}
      </ul>
      <div
        onClick={handleScrollRight}
        className="rounded-circle border d-flex justify-content-center align-items-center nav-circle"
      >
        <IoChevronForwardCircle color="#47c176" size={30} />
      </div>
      {/* <div
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
        onClick={handleScrollRight}
      >
        <FaChevronRight />
      </div> */}

    </div>
  );
};

export default SubMenu;
