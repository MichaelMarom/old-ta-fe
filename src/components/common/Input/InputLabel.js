import Tooltip from "../ToolTip";

export const MandatoryFieldLabel = ({
    text,
    editMode = true,
    mandatoryFields = [],
    name,
    toolTipText = "",
    width = "200px",
    direction = "bottomleft",
  }) => {
    const blinkMe = () => {
      if (!name) return false;
      const filled = mandatoryFields.find((item) => item.name === name)?.filled;
      return !filled;
    };
  
    return (
      <div className="d-flex ">
        <span
          className="d-flex gap-2"
          style={{
            background: editMode ? "white" : "rgb(233 236 239)",
          }}
        >
          {!!toolTipText.length && (
            <Tooltip
              text={toolTipText}
              direction={direction}
              width={width}
              iconSize={13}
            />
          )}
          <span className={` ${blinkMe() ? "blink_me" : ""}`}> {text}</span>
        </span>
        <span className="text-danger" style={{ fontSize: "13px" }}>
          *
        </span>
      </div>
    );
  };
  
  export const OptionalFieldLabel = ({ label, editMode = true }) => (
    <p
      className=""
      style={{ background: editMode ? "white" : "rgb(233 236 239)" }}
    >
      {label}: <span className="text-sm">(optional)</span>
    </p>
  );
  
  export const GeneralFieldLabel = ({
    label,
    editMode = true,
    tooltipText = "",
    direction = "bottomleft",
    width = "200px",
  }) => {
    return (
      <div className="">
        <span
          className="d-flex gap-2"
          style={{
            background: editMode ? "white" : "rgb(233 236 239)",
          }}
        >
          {!!tooltipText.length && (
            <Tooltip
              text={tooltipText}
              direction={direction}
              width={width}
              iconSize={15}
            />
          )}
          <span> {label}</span>
        </span>
      </div>
    );
  };