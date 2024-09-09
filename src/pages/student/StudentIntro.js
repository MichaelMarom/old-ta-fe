import React, { useEffect, useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout'
import Actions from '../../components/common/Actions'
import { useSelector } from 'react-redux'
import RichTextEditor from '../../components/common/RichTextEditor/RichTextEditor'
// import { get_adminConstants, post_termsOfUse } from '../../axios/admin'
import Loading from '../../components/common/Loading'
import { toast } from 'react-toastify'

const StudentIntro = () => {
  const { user } = useSelector(state => state.user)
  const [editMode, setEditMode] = useState(false)
  const [unSavedChanges, setUnSavedChanges] = useState(false)
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await get_adminConstants(2);
  //       if (!result?.response?.data) {
  //         setIntro(result.data[0].IntroContent);
  //         set_db_intro(result.data[0].IntroContent);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //     setFetching(false)
  //   };

  //   fetchData();
  // }, []);



  // useEffect(() => {
  //   setUnSavedChanges(intro !== undefined && db_intro !== undefined &&
  //     intro !== db_intro)
  // }, [intro, db_intro]);

  // const handleSave = async (e) => {
  //   e.preventDefault()
  //   setLoading(true)
  //   const response = await post_termsOfUse({ id: 2, IntroContent: intro });
  //   if (response.message) {
  //     toast.error(response.message)
  //   }
  //   else {
  //     toast.success('Successfully save the intro!')
  //     set_db_intro(response.data.IntroContent);
  //   }
  //   setEditMode(false);
  //   setLoading(false)
  // }

  const handleEditClick = () => setEditMode(true)

  // const handleEditorChange = (value) => { setIntro(value) }

  return (
    <div>
      <div className='px-4 mt-4 student-terms'>
        <div className='overflow-auto border shadow p-2' style={{ maxHeight: "calc(100vh - 290px)", height: "auto" }} >
          <div className='w-100 text-center p-1'>
            <img className='' src={`${process.env.REACT_APP_BASE_URL}/logo1.png`} width={350} height={100} alt="logo" />
          </div>
          <h6>Student Intro:
          </h6>
          <div>
            ................
          </div>
          <p className='text-success'>
            If you have any questions or concerns about these terms of use, please contact us at
            <span className='text-primary'>
              &nbsp;admin@tutoring-academy.com
            </span>

          </p>
        </div>
        {/* <RichTextEditor
                        value={terms}
                        onChange={handleEditorChange}
                        readOnly={!editMode || user.role !== 'admin' || !editMode}
                        placeholder="Enter Term Of Service here"
                        style={{ height: "calc(100vh - 310px)" }}
                    /> */}
      </div>

      {/* <div className='px-4 mt-4 student-intro'>
          <RichTextEditor
            value={intro}
            onChange={handleEditorChange}
            readOnly={!editMode}
            placeholder="Enter Intro here"
            style={{ height: "72vh" }}
          />
        </div> */}
      <Actions
        backDisabled={true}
        loading={loading}
        saveDisabled={!user.role || user.role !== 'admin'} // Disable save if user role is not admin
        editDisabled={!user.role || user.role !== 'admin'} // Disable edit if user role is not admin
        onEdit={handleEditClick}
        unSavedChanges={unSavedChanges}
      />
    </div>
  )
}

export default StudentIntro
