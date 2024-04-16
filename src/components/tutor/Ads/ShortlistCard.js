import React, { useEffect, useState } from 'react'
import Avatar from '../../../components/common/Avatar'
import TAButton from '../../../components/common/TAButton'
import { MdCancel } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { deleteAdFromShortlist } from '../../../axios/tutor'
import { Countries } from '../../../constants/constants'

const ShortlistCard = ({ photo, name, adText, id, setAdDeleted, studentId, subject, country }) => {
    const { tutor } = useSelector(state => state.tutor)
    const [code, setCode] = useState('')

    const handleDeleteAd = async () => {
        const data = await deleteAdFromShortlist(id, tutor.AcademyId);
        !data?.response?.data && setAdDeleted(data)
    }

    useEffect(() => {
        setCode(Countries.find(item => item.Country === country)?.Code?.toLocaleLowerCase())
    }, [country])

    return (
        <div className='  col-md-4 '>

            <div className='d-flex border p-2 align-items-center rounded-4  flex-column position-relative m-1 text-light' style={{ background: "gray" }}>

                <div className='position-absolute top-0 start-0 p-1 cursor-pointer' onClick={handleDeleteAd}>
                    <MdCancel size={40} color='limegreen' />
                </div>
                <Avatar avatarSrc={photo} size='100px' showOnlineStatus={false} />
                <div className='d-flex top-0 start-0 p-1 ' style={{ gap: "5px" }}>
                    <h6 className='mr-2'>{name}</h6>
                    <img
                        src={`https://flagcdn.com/w20/${code}.png`}
                        srcset={`https://flagcdn.com/w40/${code}.png 2x, https://flagcdn.com/48x36/${code}.png 3x`}
                        width="30"
                        height="20"
                        alt={country} />
                </div>
                <h5>{subject}</h5>

                <div className='border text-bg-dark p-2' dangerouslySetInnerHTML={{ __html: adText }} style={{ height: "200px", overflowY: "auto" }} />
                <div className='mt-2'>
                    <TAButton buttonText={'See Profile'} style={{ width: "150px" }}
                        handleClick={() => window.open(`${process.env.REACT_APP_BASE_URL}/tutor/student-profile/${studentId}`, '_blank')} />
                </div>
            </div>
        </div>
    )
}

export default ShortlistCard

