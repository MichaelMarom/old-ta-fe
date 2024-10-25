import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Pill from "../../../components/common/Pill";
import { showDate } from "../../../utils/moment";
import { moment } from "../../../config/moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetch_student_ads } from "../../../axios/student";
import Loading from "../../../components/common/Loading";
import Actions from "../../../components/common/Actions";

const StudentAdList = () => {
  const [ads, setAds] = useState([]);
  const { student } = useSelector((state) => state.student);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (student.AcademyId) {
      const fetch = async () => {
        setLoading(true);
        const data = await fetch_student_ads(student.AcademyId);
        setLoading(false);

        !!data?.length && setAds(data);
      };
      fetch();
    }
  }, [student]);

  return (
    <Layout>
      <div className="" style={{ height: "calc(100vh - 180px)", overflowY: "auto" }}>
        <div className="container">
          {loading ? <div>
            <Loading height="calc(100vh - 180px)" />
          </div>
            : ads.length ? ads.map((item) => (
              <div
                key={item.Id}
                onClick={() => {
                  navigate(`/student/market-place/ad/${item.Id}`);
                }}
                className=" click-effect-elem rounded shadow-sm p-2 border m-1 d-flex "
                style={{ gap: "20px" }}
              >
                {item.Published_At && (
                  <p
                    className=" m-0 text-decoration-underline "
                    style={{ width: "100px" }}
                  >
                    {showDate(moment(item.Published_At).toDate())}
                  </p>
                )}
                <div className="" style={{ width: "100px" }}>
                  <Pill
                    label={item.Status}
                    color={item.Status === "published" ? "success" : "danger"}
                    hasIcon={false}
                  />
                </div>
                {item.Subject && (
                  <div className="">
                    <Pill
                      label={item.Subject}
                      hasIcon={false}
                      color="primary"
                      width="auto"
                    />
                  </div>
                )}
                <h5 className="click-elem m-0 text-decoration-underline d-inline-block">
                  {item.AdHeader}
                </h5>
              </div>
            )) :
              <div className="text-danger">
                No Saved Ads.
              </div>
          }
        </div>
      </div>
      <Actions saveDisabled />
    </Layout>
  );
};

export default StudentAdList;
