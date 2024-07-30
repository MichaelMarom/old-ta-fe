import React, { useState } from "react";
import { BiSolidChevronsRight } from "react-icons/bi";

const SmallSideBar = ({ message = "", inMins }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ishovered, setIsHovered] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const visiblePartWidth = 35;
  const sidebarWidth = isOpen ? "25%" : `${visiblePartWidth}px`;
  const sidebarAnimation = isOpen ? "slideInRight" : "slideOutRight";

  return (
    <div className="shadow-lg ">
      <div
        style={{
          width: sidebarWidth,
          transition: "width 0.5s ease",
          position: "fixed",
          top: "50px",
          right: 0,
          zIndex: 1006,
          height: "90px",
          overflow: "hidden",
        }}
      >
        <div
          className={`animated ${sidebarAnimation}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div
            style={{ display: "flex", marginTop: "20px" }}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="d-flex justify-content-center align-items-center border p-2 rounded border-dark m-0 cursor-pointer "
              style={{
                transition: "all 0.3s ease-in",
                width: ishovered
                  ? `${visiblePartWidth + 10}px`
                  : `${visiblePartWidth}px`,
                height: ishovered
                  ? `${visiblePartWidth + 10}px`
                  : `${visiblePartWidth}px`,
                background: ishovered ? "black" : "#000000c9",
              }}
              onClick={toggleSidebar}
            >
              <BiSolidChevronsRight
                style={{
                  animation: inMins ? "blinking 1s infinite" : "none",
                  transition: "all 0.3s ease-in",
                }}
                color={inMins ? "limegreen" : ishovered ? "white" : "white"}
                size={ishovered ? 30 : 20}
              />
            </div>
            {
              <div className="p-2 text-bg-secondary w-100 h-100 rounded border">
                {message.length
                  ? message
                  : "No Upcoming Events for the next 24 hours!"}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallSideBar;
