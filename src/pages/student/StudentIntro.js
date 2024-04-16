import React, { useEffect, useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout'
import Actions from '../../components/common/Actions'
import { useSelector } from 'react-redux'
import RichTextEditor from '../../components/common/RichTextEditor/RichTextEditor'
import { get_adminConstants, post_termsOfUse } from '../../axios/admin'
import Loading from '../../components/common/Loading'
import { toast } from 'react-toastify'

const StudentIntro = () => {
  const { user } = useSelector(state => state.user)
  const [intro, setIntro] = useState('');
  const [editMode, setEditMode] = useState(false)
  const [unSavedChanges, setUnSavedChanges] = useState(false)
  const [loading, setLoading] = useState(false)
  const [db_intro, set_db_intro] = useState('');
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await get_adminConstants(2);
        if (!result?.response?.data) {
          setIntro(result.data[0].IntroContent);
          set_db_intro(result.data[0].IntroContent);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setFetching(false)
    };

    fetchData();
  }, []);



  useEffect(() => {
    setUnSavedChanges(intro !== undefined && db_intro !== undefined &&
      intro !== db_intro)
  }, [intro, db_intro]);

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    const response = await post_termsOfUse({ id: 2, IntroContent: intro });
    if (response.message) {
      toast.error(response.message)
    }
    else {
      toast.success('Successfully save the intro!')
      set_db_intro(response.data.IntroContent);
    }
    setEditMode(false);
    setLoading(false)
  }

  const handleEditClick = () => setEditMode(true)

  const handleEditorChange = (value) => { setIntro(value) }

  if (fetching)
    return <Loading />
  return (
    <StudentLayout  >
      <form onSubmit={handleSave}>
        <div className='px-4 mt-4 student-intro'>
          <RichTextEditor
            value={intro}
            onChange={handleEditorChange}
            readOnly={!editMode}
            placeholder="Enter Intro here"
            style={{ height: "72vh" }}
          />
        </div>
        <Actions
          backDisabled={true}
          loading={loading}
          saveDisabled={!user.role || user.role !== 'admin'} // Disable save if user role is not admin
          editDisabled={!user.role || user.role !== 'admin'} // Disable edit if user role is not admin
          onEdit={handleEditClick}
          unSavedChanges={unSavedChanges}
        />
      </form>
    </StudentLayout>
  )
}

export default StudentIntro
