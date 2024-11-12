import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  add_to_shortlist,
  fetch_students_published_ads,
} from "../../../axios/tutor";
import TAButton from "../../../components/common/TAButton";
import { moment } from "../../../config/moment";
import { showDate } from "../../../utils/moment";
import { BiChevronDown } from "react-icons/bi";
import Avatar from "../../../components/common/Avatar";
import Pill from "../../../components/common/Pill";
import { convertTutorIdToName } from "../../../utils/common";
import Actions from "../../../components/common/Actions";
import Loading from "../../../components/common/Loading";
import Drawer from "../../../components/common/Drawer";
import ReadMore from "../../../components/common/ReadMore";

const Classified = () => {
  const [ad, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState({});
  const navigate = useNavigate();
  const { tutor } = useSelector((state) => state.tutor);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setFetching(true);
      const data = await fetch_students_published_ads();
      setFetching(false);

      !!data?.length && setAds(data);
    };
    fetch();
  }, []);

  const handleClick = async (item) => {
    await add_to_shortlist(item.Id, tutor.AcademyId);
    navigate("/tutor/market-place/bid");
  };

  return (
    <Layout>
      <div className="" style={{ height: "72vh", overflowY: "auto" }}>
        <div className="container">
          {fetching ? (
            <Loading />
          ) : ad.length ? (
            ad.map((item) => (
              <Drawer
                key={item.Id}
                header={item.AdHeader}
                date={showDate(moment(item.Published_At).toDate())}
                subject={item.Subject}
                childrenHeight="300px"
              >
                {/* <div
                  onClick={() =>
                    selectedAd.Id === item.Id
                      ? setSelectedAd({})
                      : setSelectedAd(item)
                  }
                  className="ad  click-effect-elem  shadow-sm p-2  d-flex justify-content-between align-items-center"
                  style={{ gap: "20px" }}
                >
                  <div>
                    <div className="d-flex align-items-center">
                      {item.Published_At && (
                        <p className=" m-0 text-decoration-underline ">
                          {showDate(moment(item.Published_At).toDate())}
                        </p>
                      )}
                      <Pill label={item.Subject} color="success" />
                    </div>
                    <h5 className="click-elem m-0 text-decoration-underline">
                      {item.AdHeader}
                    </h5>
                  </div>
                  <div>
                    <BiChevronDown />
                  </div>
                </div> */}
                <div
                  className={`w-100  `}
                  style={{
                    background: "white",
                    // maxHeight: selectedAd.Id === item.Id ? "200px" : "0",
                    // overflow: "hidden",
                    transition:
                      "max-height ease-in-out 0.5s, opacity 0.5s, visibility 0.5s",
                  }}
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
                      <h5>{item.ScreenName}</h5>
                      {!!JSON.parse(item.TutorLanguages).length && (
                        <div className="d-flex">
                          <h6>Languages:</h6>
                          {JSON.parse(item.TutorLanguages).map((lan) => (
                            <Pill label={lan.value} />
                          ))}
                        </div>
                      )}
                      <div className="d-flex">
                        <h6>Grades:</h6>
                        <Pill label={item.Grade} />
                      </div>
                      <div>
                        <h6 className="text-start d-inline-block m-0">
                          Tutor Experience:
                        </h6>
                        <p className="d-inline-block m-1">
                          {item.TutorExperience}
                        </p> |
                        <h6 className="text-start d-inline-block m-1">
                          Tutor Degree:
                        </h6>
                        <p className="d-inline-block m-1">
                          {item.TutorEduLevel}
                        </p> |
                        <h6 className="text-start d-inline-block m-1">
                          Tutor Certificate:
                        </h6>
                        <p className="d-inline-block m-1">
                          {item.TutorCertificate}
                        </p> |
                        <h6 className="text-start d-inline-block m-1">
                          Tutor TimeZone:
                        </h6>
                        <p className="d-inline-block m-1">{item.TutorGMT}</p>

                        <ReadMore
                          isHtml
                          maxLength={200}
                          content={item.AdText}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Drawer>
            ))
          ) : (
            <div className="text-danger">You are all caught up!</div>
          )}
        </div>
      </div>
      <Actions saveDisabled />
    </Layout>
  );
};

export default Classified;
