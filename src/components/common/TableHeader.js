import React from "react";

const TableHeader = ({ headers }) => {
  return (
    <div
      className="d-flex rounded justify-content-between align-items-center  p-2"
      style={{ color: "white", background: "#2471A3" }}
    >
      {headers.map((header) => {
        return (
          <div
            className="text-center d-flex flex-column"
            style={{ width: header.width }}
            key={header.title}
          >
            <p className="m-0" key={header.title}>
              {" "}
              {header.title}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TableHeader;
