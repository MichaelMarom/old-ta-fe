import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { add_to_shortlist, fetch_published_ads } from "../../../axios/student";
import TAButton from "../../../components/common/TAButton";
import { moment } from "../../../config/moment";
import { showDate } from "../../../utils/moment";
import Avatar from "../../../components/common/Avatar";
import Pill from "../../../components/common/Pill";
import Actions from "../../../components/common/Actions";
import Loading from "../../../components/common/Loading";
import Drawer from "../../../components/common/Drawer";

const Marketplace = () => {
  const [ad, setAds] = useState([]);
  const navigate = useNavigate();
  const { student } = useSelector((state) => state.student);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setFetching(true);
      const data = await fetch_published_ads();
      !!data?.length && setAds(data);
      setFetching(false);
    };
    fetch();
  }, []);

  const handleClick = async (item) => {
    await add_to_shortlist(item.Id, student.AcademyId);
    navigate("/student/market-place/bid");
  };

  return (
    <Layout>
      <div className="" style={{ height: "72vh", overflowY: "auto" }}>
        <div className="container">
          {fetching ? (
            <Loading />
          ) : (
            ad.map((item) => (
              <Drawer
                key={item.Id}
                header={item.AdHeader}
                date={showDate(moment(item.Published_At).toDate())}
                subject={item.Subject}
              >
                <div className="d-flex pb-3" style={{ gap: "50px" }}>
                  <div>
                    <Avatar
                      showOnlineStatus={false}
                      avatarSrc={item.Photo}
                      size="100px"
                    />
                    <div>
                      <TAButton
                        handleClick={() => handleClick(item)}
                        buttonText={"Select"}
                      />
                    </div>
                  </div>
                  <div>
                    <h5>{item.TutorScreenname}</h5>
                    <div className="d-flex flex-wrap align-items-center">
                      <h6 className="m-0">Languages:</h6>{" "}
                      <Pill label={JSON.parse(item.Languages).value} />
                    </div>
                    <div className="d-flex flex-wrap align-items-center">
                      <h6 className="m-0">Grades:</h6>
                      {JSON.parse(item.Grades).map((grade) => (
                        <Pill key={grade} label={grade} />
                      ))}
                    </div>
                    <div
                      className="border text-bg-light p-2"
                      dangerouslySetInnerHTML={{ __html: item.AdText }}
                      style={{ height: "70px", overflowY: "auto" }}
                    />
                  </div>
                </div>
              </Drawer>
            ))
          )}
          {!ad.length && <div className="text-danger">No Active Ads.</div>}
        </div>
      </div>
      <Actions saveDisabled />
    </Layout>
  );
};

export default Marketplace;
