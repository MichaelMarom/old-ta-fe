// Drawer.js
import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import Pill from "./Pill";
import TAButton from './TAButton'

const Drawer = ({ date, subject, header, children, childrenHeight = "200px", haveButtonHeader }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="collapsible-drawer rounded m-1 border" style={{ background: "lightgray" }}>
      <div
        onClick={toggleDrawer}
        className="drawer-header click-effect-elem shadow-sm p-2 d-flex justify-content-between align-items-center"
        style={{ gap: "20px", cursor: "pointer" }}
      >
        <div>
          <div className="d-flex align-items-center">
            {date && (
              <p className="m-0 ">{date}</p>
            )}
            {subject && (
              <Pill label={subject} color="success" />
            )}
          </div>
          {haveButtonHeader ? <div>
            <TAButton buttonText={header} style={{ width: "150px" }} />
          </div> :
            <h5 className="m-0">{header}</h5>}
        </div>
        <div className={`chevron ${isOpen ? "open" : ""}`}>
          <BiChevronDown size={25} />
        </div>
      </div>
      <div
        className={`drawer-content ${isOpen ? "open" : ""}`}
        style={{
          background: "white",
          maxHeight: isOpen ? childrenHeight : "0",
          overflow: "auto",
          transition: "max-height ease-in-out 0.5s, opacity 0.5s, visibility 0.5s",
          opacity: isOpen ? "1" : "0",
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        <div className="p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
