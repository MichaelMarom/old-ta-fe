import { useEffect, useState } from 'react';
import { get_tutor_students } from '../../axios/tutor';
import { wholeDateFormat } from '../../constants/constants';
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import Avatar from '../common/Avatar';
import Loading from '../common/Loading';
import Actions from '../common/Actions'

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      const AcademyId = localStorage.getItem('tutor_user_id');
      const response = await get_tutor_students(AcademyId);
      response?.length && setStudents(response);
      setFetching(false)
      setLoading(false)
    };

    fetchStudents();
  }, []);


  if (loading || fetching)
    return <Loading />
  return (
    <div className="mt-4">
      <h2>My Students</h2>
      {(!!students.length) ? < table className="">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Screen Name</th>
            <th>Subject</th>
            <th>Country</th>
            <th>GMT</th>
            <th>Grade</th>
            <th>Total Hours</th>
            <th>Date Start</th>
            <th>Date last</th>
            <th>Total $ Gros</th>
            <th>Total $ Net</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <Avatar avatarSrc={student.photo} online={0} />
              </td>
              <td>{student.screenName}</td>
              <td>{student.subject}</td>
              <td>{student.country}</td>
              <td>{student.gmt}</td>
              <td>{student.grade}</td>
              <td>{student.totalHours}</td>
              <td className='col-2'>{showDate(student.dateStart, wholeDateFormat)}</td>
              <td className='col-2'>{showDate(student.dateLast, wholeDateFormat)}</td>
              <td>{student.totalNet.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table> :
        <h5 className='text-danger'>No Students Found!</h5>
      }
      <Actions
        editDisabled={true}
        saveDisabled={true}
      />
    </div >
  )
};


export default MyStudents;