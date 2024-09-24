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
        className="d-flex m-1 flex-wrap"
        style={{ height: "74vh", overflowY: "auto" }}
      >
        {fetching ? (
          <Loading />
        ) : !!ads.length ? (
          ads.map((ad) => (
            <ShortlistCard
              photo={ad.Photo}
              adText={ad.AdText}
              name={ad.ScreenName}
              id={ad.Id}
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
