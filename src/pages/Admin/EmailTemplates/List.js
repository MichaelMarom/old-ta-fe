import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { get_email_temp_list } from '../../../axios/admin'
import { useNavigate } from 'react-router-dom'
import { MdEdit } from 'react-icons/md'

const EmailTemplates = () => {
  const [list, setList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    get_email_temp_list().then(result => !result?.response?.data && setList(result))
  }, [])

  return (
    <Layout>
      <div className="" style={{ height: "95vh", overflowY: "auto" }}>
        <div className="container">
          {list.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                navigate(`/admin/email-templates/${item.id}`);
              }}
              className="click-effect-elem rounded shadow-sm p-2 border m-1 d-flex border-dark"
              style={{ gap: "20px" }}
            >

              <h5 className="click-elem m-0 text-decoration-underline d-inline-block">
                {item.name}
              </h5>
              <div
                  className="rounded-circle border shadow click-effect-elem d-flex justify-content-center align-items-center"
                  style={{ width: "30px", height: "30px" }}
                >
                  <MdEdit size={15} color="blue" />
                </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default EmailTemplates