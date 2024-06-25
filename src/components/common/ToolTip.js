import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";


const Tooltip = ({ text, children, iconSize = 16, direction = "top", width = "100px", color = "rgb(0, 150, 255)",
  style, customStyling = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStye] = useState({
    width,
    whiteSpace: "normal",
    zIndex: "9999999"
  })

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  useEffect(() => {
    if (customStyling) {
      if (style) setTooltipStye({ ...tooltipStyle, ...style })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customStyling, style])

  return (
    <div
      className="custom-tooltip-wrapper mx-2" style={{
        fontWeight: "bold",
        lineHeight: "1.2",
        fontSize: "14px",
        transform: "none"
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children ? children : <FaInfoCircle size={iconSize} color={color} />}
      {showTooltip && (
        <div className={`custom-tooltip ${direction}`}
          style={{ ...tooltipStyle, transform: "none" }}
        >{text}</div>
      )}
    </div>
  );
};

export default Tooltip;
