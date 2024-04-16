import React from 'react'
import StudentCalenderScheduling from '../../components/student/StudentCalenderScheduling'
import StudentLayout from '../../layouts/StudentLayout';
import '../../styles/common.css'

const StudentScheduling = () => {
  return (
    <StudentLayout   >
      <StudentCalenderScheduling />
    </StudentLayout>
  )
}

export default StudentScheduling
