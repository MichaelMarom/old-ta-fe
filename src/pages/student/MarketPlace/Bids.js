import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { get_shortlist_ads } from "../../../axios/student";
import { useSelector } from "react-redux";
import ShortlistAdCard from "./ShortlistAdCard";
import { convertTutorIdToName } from "../../../utils/common";
import Actions from "../../../components/common/Actions";
import Loading from "../../../components/common/Loading";

const Bids = () => {
  const { student } = useSelector((state) => state.student);
  const [ads, setAds] = useState([]);
  const [adDeleted, setAdDeleted] = useState();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      setFetching(true);
      const data = await get_shortlist_ads(student.AcademyId);
      setFetching(false);
      data?.length && setAds(data);
    };
    student.AcademyId && fetchAds();
  }, [student, adDeleted]);

  return (
    <Layout>
      <div
        className="d-flex m-1 flex-wrap"
        style={{ height: "calc(100vh - 180px)", overflowY: "auto" }}
      >
        {fetching ? <div className="w-100">
          <Loading height="calc(100vh - 180px)" />
        </div>
          : ads.length ? ads.map((ad) => (
            <ShortlistAdCard
              key={ad.Id}
              photo={ad.Photo}
              adText={ad.AdText}
              name={ad.TutorScreenname}
              id={ad.Id}
              setAdDeleted={setAdDeleted}
              subject={ad.Subject}
              country={ad.Country}
              tutorId={ad.AcademyId}
              adHeader={ad.AdHeader}
              date={ad.Published_At}
            />
          )) : <div className="text-danger">No Shortlisted Ads.</div>}
      </div>
      <Actions saveDisabled />
    </Layout>
  );
};

export default Bids;
