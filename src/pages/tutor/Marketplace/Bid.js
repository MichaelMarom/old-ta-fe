import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { get_shortlist_ads } from "../../../axios/tutor";
import { useSelector } from "react-redux";
import { convertTutorIdToName } from "../../../utils/common";
import Actions from "../../../components/common/Actions";
import ShortlistCard from "../../../components/tutor/Ads/ShortlistCard";
import Loading from "../../../components/common/Loading";

const Bid = () => {
  const { tutor } = useSelector((state) => state.tutor);
  const [ads, setAds] = useState([]);
  const [adDeleted, setAdDeleted] = useState();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      setFetching(true);
      const data = await get_shortlist_ads(tutor.AcademyId);
      setFetching(false);
      !!data?.length && setAds(data);
    };
    tutor.AcademyId && fetchAds();
  }, [tutor, adDeleted]);

  return (
    <Layout>
      <div
        className="d-flex m-1 flex-wrap w-100"
        style={{ height: "calc(100vh - 180px)", overflowY: "auto" }}
      >
        {fetching ? (
       <div className="w-100 h-100">
           <Loading height="calc(100vh - 180px)" />
        </div>
        ) : !!ads.length ? (
          ads.map((ad) => (
            <ShortlistCard
              photo={ad.Photo}
              date={ad.Published_At}
              adText={ad.AdText}
              name={ad.ScreenName}
              id={ad.Id}
              adHeader={ad.AdHeader}
              setAdDeleted={setAdDeleted}
              subject={ad.Subject}
              country={ad.Country}
              studentId={ad.AcademyId}
            />
          ))
        ) : (
          <div className="text-danger"> No Favourite Ad!</div>
        )}
      </div>
      <Actions saveDisabled />
    </Layout>
  );
};

export default Bid;
