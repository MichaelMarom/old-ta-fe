// import React, { useEffect, useState } from 'react'
// import Layout from './Layout';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { fetch_tutor_ads } from '../../../axios/tutor';
// import { add_to_shortlist, fetch_published_ads } from '../../../axios/student';
// import TAButton from '../../../components/common/TAButton'
// import { moment } from '../../../config/moment'
// import { showDate } from '../../../helperFunctions/timeHelperFunctions';
// import { BiChevronDown } from 'react-icons/bi';
// import Avatar from '../../../components/common/Avatar';
// import Pill from '../../../components/common/Pill';
// import { convertTutorIdToName } from '../../../helperFunctions/generalHelperFunctions';
// import Actions from '../../../components/common/Actions';

// const Classified = () => {
//     const [ad, setAds] = useState([]);
//     const [selectedAd, setSelectedAd] = useState({})
//     const navigate = useNavigate()
//     const { student } = useSelector(state => state.student)

//     useEffect(() => {
//         const fetch = async () => {
//             const data = await fetch_published_ads()
//             setAds(data)
//         }
//         fetch()
//     }, [])

//     const handleClick = async (item) => {
//         const data = await add_to_shortlist(item.Id, student.AcademyId)
//         navigate('/student/market-place/bid')
//     }

//     return (
//         <Layout>
//             <div className='' style={{ height: "72vh", overflowY: "auto" }}>
//                 <div className='container'>
//                     {ad.map(item =>
//                         <div className=' rounded m-1 border' style={{ background: "lightgray" }}>
//                             <div onClick={() => selectedAd.Id == item.Id ? setSelectedAd({}) : setSelectedAd(item)}
//                                 className='ad  click-effect-elem  shadow-sm p-2  d-flex justify-content-between align-items-center'
//                                 style={{ gap: "20px" }} >
//                                 <div>
//                                     <div className='d-flex align-items-center'>
//                                         {item.Published_At &&
//                                             <p className=' m-0 text-decoration-underline ' >
//                                                 {showDate(moment(item.Published_At).toDate())}
//                                             </p>
//                                         }
//                                         <Pill label={item.Subject} width='200px' color='success' />
//                                     </div>
//                                     <h5 className='click-elem m-0 text-decoration-underline' >
//                                         {item.AdHeader}
//                                     </h5>
//                                 </div>
//                                 <div>
//                                     <BiChevronDown />
//                                 </div>
//                             </div>
//                             <div className={`w-100 ${selectedAd === item ? '' : 'opacity-0'} `}
//                                 style={{
//                                     background: 'white',
//                                     maxHeight: selectedAd.Id === item.Id ? '200px' : '0',
//                                     overflow: 'hidden',
//                                     transition: 'max-height ease-in-out 0.5s, opacity 0.5s, visibility 0.5s',
//                                 }}>
//                                 <div className='d-flex pb-3' style={{ gap: "50px" }}>
//                                     <div>
//                                         <Avatar showOnlineStatus={false} avatarSrc={item.Photo} size='100px' />
//                                         <div>
//                                             <TAButton handleClick={() => handleClick(item)} buttonText={'Select'} />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <h5>{convertTutorIdToName(item.AcademyId)}</h5>
//                                         <div className='d-flex'><h6>Lamnguages:</h6> <Pill label={JSON.parse(item.Languages).value} width='150px' />
//                                         </div>
//                                         <div className='d-flex'><h6>Grades:</h6>
//                                             {
//                                                 JSON.parse(item.Grades).map(grade =>
//                                                     <Pill label={grade} width='150px' />)
//                                             }
//                                         </div>
//                                         <div className='border text-bg-light p-2' dangerouslySetInnerHTML={{ __html: item.AdText }} style={{ height: "70px", overflowY: "auto" }} />

//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             <Actions saveDisabled />
//         </Layout>
//     )
// }

// export default Classified