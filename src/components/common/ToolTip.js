import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

const Tooltip = ({
  text,
  children,
  toggleOnHover=true,
  opened = false,
  iconSize = 16,
  direction = "top",
  width = "100px",
  color = "rgb(0, 150, 255)",
  style,
  customStyling = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStye] = useState({
    width,
    whiteSpace: "normal",
  });

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  useEffect(() => {
    if (customStyling) {
      if (style) setTooltipStye({ ...tooltipStyle, ...style });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customStyling, style]);

console.log(toggleOnHover, showTooltip, opened)
  return (
    <div className="p-0 position-relative">
      {(toggleOnHover ? showTooltip : opened) && (
      <div
        className={`"custom-tooltip-wrapper mx-2"`}
        style={{
          fontWeight: "bold",
          lineHeight: "1.2",
          fontSize: "14px",
          transform: "none",
        }}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
          <div
            className={`custom-tooltip ${direction}`}
            style={{
              ...tooltipStyle,
              bottom:opened ? "40px" : "20px",
              transform: "none",
              fontWeight: "400",
              height:"fit-content",
              fontSize: "12px",
              boxShadow: "2px 5px 8px rgba(0,0,0,.45)",
            }}
          >
            {text}
          </div>
      </div>
        )}
      <div
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
      >

      {children ? children : <FaInfoCircle size={iconSize} color={color} />}
      </div>
    </div>
  );
};

export default Tooltip;
