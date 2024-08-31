import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Tabs = ({
  links,
  setActiveTab,
  activeTabIndex,
  setActiveTabIndex,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (index, component) => {
    if (links[index].link) return navigate(links[index].link);
    setActiveTab(component);
    setActiveTabIndex(index);
  };

  return (
    <div
      style={{
        height: "30px",
        cursor: "pointer",
        width: "100%",
        background: "#212F3D",
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
        marginTop: "5px",
      }}
    >
      <ul className="header">
        {links.map((tab, index) => (
          <li
            id={`${
              (
                tab.link
                  ? location.pathname === tab.link
                  : index === activeTabIndex
              )
                ? "tutor-tab-header-list-active1"
                : ""
            }`}
            key={index}
            onClick={() => handleTabClick(index, tab.component)}
            className={`navitem navitem-li ${location.pathname === tab.link ? "active" : ""}`}
          >
            <h6 className="m-0">
              {tab.label}
            </h6>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
