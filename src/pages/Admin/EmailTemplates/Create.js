import React, { useState } from 'react'
import Layout from './Layout'
import Input from '../../../components/common/Input'
import { useSelector } from 'react-redux';

const Create = () => {
  const [subject, setSubject]=useState();
  const {user}=useSelector(state=>state.user)
  return (
    <Layout>
      <div className='container'>
<div>
  <form>
    <Input value={subject} setValue={setSubject} label={"Enter Subject"}/>

  </form>
</div>
      </div>
    </Layout>
  )
}

export default Create 