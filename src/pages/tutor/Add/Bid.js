import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { get_shortlist_ads } from '../../../axios/tutor'
import { useSelector } from 'react-redux'
import { convertTutorIdToName } from '../../../helperFunctions/generalHelperFunctions'
import Actions from '../../../components/common/Actions'
import ShortlistCard from '../../../components/tutor/Ads/ShortlistCard'

const Bid = () => {
    const { tutor } = useSelector(state => state.tutor)
    const [ads, setAds] = useState([]);
    const [adDeleted, setAdDeleted] = useState()

    useEffect(() => {
        const fetchAds = async () => {
            const data = await get_shortlist_ads(tutor.AcademyId)
            !!data?.length && setAds(data)
        }
        tutor.AcademyId && fetchAds()
    }, [tutor, adDeleted])

    return (
        <Layout>
            <div className='d-flex m-1 flex-wrap' style={{ height: "74vh", overflowY: "auto" }}>
                {ads.map(ad =>
                    <ShortlistCard photo={ad.Photo} adText={ad.AdText}
                        name={convertTutorIdToName(ad.AcademyId)} id={ad.Id} setAdDeleted={setAdDeleted} subject={ad.Subject}
                        country={ad.Country}
                        studentId={ad.AcademyId}
                    />
                )}
            </div>
            <Actions saveDisabled />
        </Layout>
    )
}

export default Bid