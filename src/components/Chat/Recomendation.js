import React, { useEffect, useState } from "react";
import { recomendation } from "../../axios/chat";
import { convertTutorIdToName } from "../../helperFunctions/generalHelperFunctions";

const Recomendation = ({ AcademyId }) => {
  const [recom, setRecom] = useState("");

  useEffect(() => {
    const fetch = async () => {
      if (AcademyId) {
        const data = await recomendation(AcademyId);
        !data?.response?.data && setRecom(data.recomendation);
      }
    };
    fetch();
  }, [AcademyId]);

  if (!AcademyId) return;
  return (
    <div
      className="border "
      style={{ width: "25%", height: "100%", overflowY: "auto" }}
    >
      <div className="p-2">
        <div className="highlight">
          <div
            className=""
            style={{ fontSize: "14px" }}
            dangerouslySetInnerHTML={{
              __html: ` <h6 style="margin:0; text-align:start">All students;</h6>
                        <p style="margin:0">Tutoring Academy recommend using a digital pen for the collaboration tab whiteboard.
                         Made by WACOM. Basic models are CTL-4100, 6100. You can find more information on their official website <a className="product-link" href="https://www.wacom.com" target="_blank">www.wacom.com</a>.</p>
                        <h6 style="margin:0; text-align:start">Digital Pen Models: <span className="product-link">CTL-4100</span>, <span className="product-link">6100</span></h6>
                        <p style="margin:0" className="product-info">Cost: $50 or less</p>`,
            }}
          />
        </div>
        {recom && (
          <>
            <h6 className="m-0 text-start text-decoration-underline">
              {" "}
              Below are recomendation by {convertTutorIdToName(AcademyId)}{" "}
            </h6>
            <div className="border p-1 m-1 shadow">
              <div
                className=""
                style={{ fontSize: "14px" }}
                dangerouslySetInnerHTML={{
                  __html: recom,
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recomendation;
