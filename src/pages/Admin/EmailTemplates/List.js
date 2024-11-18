import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { delete_email_temp, get_email_temp_list } from '../../../axios/admin'; // Assume this is the delete API
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import CenteredModal from '../../../components/common/Modal';
import { FaTrash } from 'react-icons/fa';
import TAButton from '../../../components/common/TAButton'

const EmailTemplates = () => {
  const [list, setList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // For storing the template to delete
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const navigate = useNavigate();

  // Fetch email templates
  useEffect(() => {
    get_email_temp_list().then(result => !result?.response?.data && setList(result));
  }, []);

  // Function to handle delete confirmation
  const handleDelete = async () => {
    if (selectedTemplate) {
      try {
        const response = await delete_email_temp(selectedTemplate.id);
        if (response.deleted) {
          // Remove the deleted item from the list
          setList(prevList => prevList.filter(item => item.id !== selectedTemplate.id));
          setIsModalOpen(false); // Close the modal
        }
      } catch (error) {
        console.error('Error deleting email template:', error);
        // Optionally, handle errors (e.g., show an error message)
      }
    }
  };

  return (
    <Layout>
      <div className="" style={{ height: "95vh", overflowY: "auto" }}>
        <div className="container">
          {list.map((item) => (
            <div
              key={item.id}
              className="rounded shadow-sm p-2 border m-1 d-flex align-items-center border-dark"
              style={{ gap: "20px" }}
            >
              <h5 className="click-elem m-0 text-decoration-underline d-inline-block">
                {item.name}
              </h5>
              {/* Edit Button */}
              <div
                onClick={() => {
                  navigate(`/admin/email-templates/${item.id}`);
                }}
                className="rounded-circle border shadow click-effect-elem d-flex justify-content-center align-items-center"
                style={{ width: "30px", height: "30px" }}
              >
                <MdEdit size={15} color="blue" />
              </div>
              {/* Delete Button */}
              <div
                onClick={() => {
                  setSelectedTemplate(item); // Set the selected template
                  setIsModalOpen(true); // Open the modal
                }}
                className="rounded-circle border shadow click-effect-elem d-flex justify-content-center align-items-center"
                style={{ width: "30px", height: "30px" }}
              >
                <FaTrash size={15} color="red" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <CenteredModal
          title={'Are you sure you want to delete this template?'}
          show={isModalOpen}
          handleClose={() => setIsModalOpen(false)} // Close modal
        >
          <div>
            <div className="d-flex justify-content-end mt-3" style={{ gap: '10px' }}>
              <TAButton handleClick={() => setIsModalOpen(false)} buttonText={'Cancel'} />
              <TAButton handleClick={handleDelete} buttonText={'Delete'} />
            </div>
          </div>
        </CenteredModal>
      )}
    </Layout>
  );
};

export default EmailTemplates;
