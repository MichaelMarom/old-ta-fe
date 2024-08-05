import React, { useState } from "react";
import TutorLayout from "../../../layouts/TutorLayout";
import CreateLeftPanel from "../../../components/tutor/Agency/AddSubTutor";
import TAButton from "../../../components/common/TAButton";
import TableHeader from "../../../components/common/TableHeader";

const Agency = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subTutors, setSubTutors] = useState([]);
  const onClose = () => {
    setIsOpen(false);
  };

  const Header = [
    {
      width: "14%",
      title: "Sr",
    },
    {
      width: "14%",
      title: "Name",
    },
    {
      width: "14%",
      title: "Email",
    },
    {
      width: "14%",
      title: "Phone",
    },
    {
      width: "14%",
      title: "Subject",
    },
    {
      width: "14%",
      title: "Country",
    },

    {
      width: "14%",
      title: "Markup",
    },
  ];
  return (
    <TutorLayout>
      <div className="p-2">
        <div className=" mt-2 highlight">
          <p className="m-1">
            Tutoring Academy platform offers you with a unique 'Agency'
            opportunity that comes with specific prerequisitis. As a dedicated
            tutor, you are invited to expand your impact by maintaining an
            active account and completing at least 40 hours of tutoring. Your
            leadership skills will shine as you mentor a minimum of six
            sub-tutors, guiding them towards success.
          </p>
          <p className="m-1">
            To begin, simply list your sub-tutors in the designated table and
            assign a markup percentage for each. Your earnings will reflect the
            difference between your earning level, and that of your sub-tutors,
            rewarding you for your mentorship efforts. Once you have a team of
            six or more sub-tutors, the 'Code' button will be enabled. By
            clicking these buttons, you will activate your franchise.
          </p>
          <p className="m-1">
            Distribute the generated codes to your sub-tutors and, once they
            register and activate their accounts, your agency will be fully
            operational. We are excited to see you grow and succeed in this new
            venture
          </p>
        </div>
        <div className="container">
          <div className="d-flex w-100 justify-content-center mt-3">
            <TAButton
            style={{width:"200px"}}
              buttonText={"Add Sub-Tutor"}
              handleClick={() => setIsOpen(true)}
            />
          </div>
          <div className="mt-2">
            <TableHeader headers={Header} />
            <table>
              <tbody>
                {subTutors.map((tutor, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      {tutor.FirstName} {tutor.LastName}
                    </td>
                    <td>{tutor.Email}</td>
                    <td>{tutor.Phone}</td>
                    <td>{tutor.Country}</td>
                    <td>{tutor.Subject}</td>

                    <td>24%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CreateLeftPanel isOpen={isOpen} onClose={onClose} />
    </TutorLayout>
  );
};

export default Agency;
