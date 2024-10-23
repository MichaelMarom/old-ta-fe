import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const CenteredModal = ({
  show,
  showHeader = true,
  handleClose,
  title,
  isTitleReactNode = false,
  children,
  minHeight = "400px",
  minWidth = "430px",
  ...rest
}) => {
  const modalDisplay = show ? "d-block" : "d-none";

  return (
    <div className={`modal-overlay ${modalDisplay}`} onClick={handleClose}>
      <div
        className={`modal ${modalDisplay}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: modalDisplay, background: "#00000059" }}
      >
        <div
          className=" modal-dialog modal-dialog-centered"
          role="document"
          {...rest}
        >
          <div
            className="modal-content"
            style={{ minHeight, minWidth, borderRadius:"20px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`modal-header ${showHeader ? "" : "d-none"}`}>
              {isTitleReactNode ? (
                title
              ) : (
                <h5
                  className="modal-title"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              <button
                type="button"
                className="close"
                onClick={handleClose}
                aria-label="Close"
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenteredModal;
