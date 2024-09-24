import { useEffect, useRef, useState } from "react";
import {
  get_tutor_data,
  get_user_list,
  send_sms,
  set_tutor_status,
} from "../../axios/admin";
import { convertGMTOffsetToLocalString } from "../../utils/moment";
import Loading from "../common/Loading";

import { toast } from "react-toastify";
import { statesColours } from "../../constants/constants";
import { get_role_count_by_status } from "../../axios/admin";
import Avatar from "../common/Avatar";
import CertificateModal from "./CertificateModal";
import DegreeModal from "./DegreeModal";
import { getDoc, updateTutorSetup } from "../../axios/tutor";
import StatusReason from "./StatusReason";
import Tooltip from "../common/ToolTip";
import { IoChatbox } from "react-icons/io5";
import { BsThreeDotsVertical, FaSortUp, FaSortDown } from "react-icons/bs";

const TutorTable = () => {
  let [data, set_data] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [status, setStatus] = useState("pending");
  const [openDegModal, setOpenDegModal] = useState(false);
  const [openCertModal, setOpenCertModal] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [statusCount, setStatusCount] = useState([]);
  const [statusReason, setStatusReason] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const handleDropdownClick = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleReasonStatus = (user, status) => {
    setModalOpen(true);
    setSelectedUser(user);
    console.log(user, status);
    setSelectedStatus(status);
  };

  const handleProceed = async (e) => {
    e.preventDefault();

    setUpdatingStatus(true);

    let response =
      selectedUser.AcademyId &&
      (await updateTutorSetup(selectedUser.AcademyId, {
        Status: selectedStatus,
        StatusReason: statusReason,
      }));
    setStatusReason("");

    !!selectedUser.CellPhone &&
      !!selectedUser.CellPhone.startsWith("+92") &&
      (await send_sms({
        message: `Your account is currently in "${status}" state.`,
        numbers: [selectedUser.CellPhone.replace("+", "")],
        id: selectedUser.AcademyId,
      }).then((result) => toast.success(`Status Code "${result.status}" `)));

    setStatus(selectedStatus);
    const result = await get_tutor_data(status);
    get_role_count_by_status().then(
      (data) => !data?.response?.data && setStatusCount(data)
    );
    if (!result?.response?.data) {
      set_data(result);
      setUpdatingStatus(false);
    }
    setModalOpen(false);
    setSelectedUser({});
    setSelectedStatus("");
  };

  const COLUMNS = [
    {
      Header: "Sr#",
    },
    {
      Header: "Status",
    },
    {
      Header: "Photo",
    },
    // {
    //   Header: "Screen Id",
    // },
    {
      Header: "Tutor Name",
    },
    {
      Header: "Email",
    },
    {
      Header: "Phone",
    },
    {
      Header: "Time",
    },
    {
      Header: "Tot. Hours",
    },
    {
      Header: "Earned",
    },
    {
      Header: "Last Active",
    },
    {
      Header: "Reason",
    },
    {
      Header: "Action",
    },
  ];

  useEffect(() => {
    get_role_count_by_status("tutor").then(
      (data) => !data?.response?.data && setStatusCount(data)
    );
  }, []);

  useEffect(() => {
    setFetching(true);
    get_tutor_data(status)
      .then((result) => {
        if (!result?.response?.data) {
          set_data(result);
          setFetching(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [status]);

  // useEffect(() => {
  //   // get_user_list().then(data => console.log(data))
  // }, [])

  let handleStatusChange = async (item, status, currentStatus, phone) => {
    if (currentStatus === "pending" || currentStatus === "closed")
      return toast.warning(
        `You cannot change status of "${currentStatus}" users!`
      );
    if (currentStatus === status)
      return toast.warning(`You already on "${status}" Status`);

    if (
      status === "suspended" ||
      status === "disapproved" ||
      status === "closed"
    ) {
      return handleReasonStatus(item, status);
    }

    setUpdatingStatus(true);
    await updateTutorSetup(item.AcademyId, {
      Status: status,
      StatusReason: "",
    });

    !!phone &&
      !!phone.startsWith("+1") &&
      (await send_sms({
        message: `Your account is currently in "${status}" state.`,
        numbers: [phone.replace("+", "")],
        id: item.Academy,
      }).then(({ status }) => toast.success(`Status Code "${status}" `)));

    setStatus(status);
    const result = await get_tutor_data(status);
    get_role_count_by_status().then(
      (data) => !data?.response?.data && setStatusCount(data)
    );
    if (!result?.response?.data) {
      set_data(result);
      setUpdatingStatus(false);
    }
  };

  let redirect_to_tutor_setup = (tutor_user_id, screenName) => {
    window.localStorage.setItem("tutor_user_id", tutor_user_id);
    window.localStorage.setItem("tutor_screen_name", screenName);
    window.localStorage.setItem("user_role", "admin");
    window.open(`${process.env.REACT_APP_BASE_URL}/tutor/setup`, "_blank");
  };

  const handleClickOutside = (event) => {
    console.log(dropdownRef.current , dropdownRef.current?.contains(event.target), event.target, dropdownOpen)
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(null);
    }
  };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <div
      className="tables"
      style={{
        height: "90vh",
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        padding: "5px",
      }}
    >
      <div className="d-flex justify-content-center mt-4">
        <div
          onClick={() => setStatus("pending")}
          className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
          style={{
            color: statesColours["pending"].color,
            background: statesColours["pending"].bg,
            border: status === "pending" ? "2px solid #268daf" : "none",
          }}
        >
          Pending
          {statusCount.find((rec) => rec.Status === "pending")?.count && (
            <span
              className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
              style={{
                width: "20px",
                fontSize: "12px",
                height: "20px",
                marginLeft: "8px",
              }}
            >
              {statusCount.find((rec) => rec.Status === "pending")?.count}
            </span>
          )}
        </div>
        <div
          onClick={() => setStatus("under-review")}
          className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
          style={{
            color: statesColours["under-review"].color,
            background: statesColours["under-review"].bg,
            border: status === "under-review" ? "2px solid #268daf" : "none",
          }}
        >
          under-review{" "}
          {statusCount.find((rec) => rec.Status === "under-review")?.count && (
            <span
              className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
              style={{
                width: "20px",
                fontSize: "12px",
                height: "20px",
                marginLeft: "8px",
              }}
            >
              {statusCount.find((rec) => rec.Status === "under-review")?.count}
            </span>
          )}
        </div>
        <div
          onClick={() => setStatus("active")}
          className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
          style={{
            color: statesColours["active"].color,
            background: statesColours["active"].bg,
            border: status === "active" ? "2px solid #268daf" : "none",
          }}
        >
          active{" "}
          {statusCount.find((rec) => rec.Status === "active")?.count && (
            <span
              className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center d-flex justify-content-center align-items-center"
              style={{
                width: "20px",
                fontSize: "12px",
                height: "20px",
                marginLeft: "8px",
              }}
            >
              {statusCount.find((rec) => rec.Status === "active")?.count}
            </span>
          )}
        </div>
        <div
          onClick={() => setStatus("suspended")}
          className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
          style={{
            color: statesColours["suspended"].color,
            background: statesColours["suspended"].bg,
            border: status === "suspended" ? "2px solid #268daf" : "none",
          }}
        >
          suspended{" "}
          {statusCount.find((rec) => rec.Status === "suspended")?.count && (
            <span
              className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
              style={{
                width: "20px",
                fontSize: "12px",
                height: "20px",
                marginLeft: "8px",
              }}
            >
              {statusCount.find((rec) => rec.Status === "suspended")?.count}
            </span>
          )}
        </div>
        <div
          onClick={() => setStatus("disapproved")}
          className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
          style={{
            color: statesColours["disapproved"].color,
            background: statesColours["disapproved"].bg,
            border: status === "disapproved" ? "2px solid #268daf" : "none",
          }}
        >
          disapproved{" "}
          {statusCount.find((rec) => rec.Status === "disapproved")?.count && (
            <span
              className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center border"
              style={{
                width: "20px",
                fontSize: "12px",
                height: "20px",
                marginLeft: "8px",
              }}
            >
              {statusCount.find((rec) => rec.Status === "disapproved")?.count}
            </span>
          )}
        </div>
        <div
          onClick={() => setStatus("closed")}
          className="p-2 rounded cursor-pointer m-1 d-flex justify-content-center align-items-center"
          style={{
            color: statesColours["closed"].color,
            background: statesColours["closed"].bg,
            border: status === "closed" ? "2px solid #268daf" : "none",
          }}
        >
          closed{" "}
          {statusCount.find((rec) => rec.Status === "closed")?.count && (
            <span
              className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
              style={{
                width: "20px",
                fontSize: "12px",
                height: "20px",
                marginLeft: "8px",
              }}
            >
              {statusCount.find((rec) => rec.Status === "closed")?.count}
            </span>
          )}
        </div>
      </div>
      {!!fetching || !!updatingStatus ? (
        <Loading height="60vh" />
      ) : !!data.length ? (
        <table style={{ position: "relative" }}>
          <thead>
            <tr>
              {COLUMNS.map((item) => (
                <th
                  style={{
                    background: statesColours[status].bg,
                    color: statesColours[status].color,
                  }}
                  key={item.Header}
                >
                  {item.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="col-1">
                  <div className="col-10 m-auto">
                    <select
                      value={item.Status}
                      onChange={(e) =>
                        handleStatusChange(
                          item,
                          e.target.value,
                          item.Status,
                          item.CellPhone
                        )
                      }
                      className="form-select"
                      style={{
                        fontSize: "12px",
                        padding: "5px",
                        height: "25px",
                      }}
                    >
                      <option value={"pending"} disabled>
                        Pending
                      </option>
                      <option value={"under-review"} disabled>
                        Under Review
                      </option>

                      <option value={"active"}>Active</option>
                      <option value={"suspended"}>Suspend</option>
                      <option value={"disapproved"}>Disapprove</option>
                      <option value={"closed"}>Close</option>
                    </select>
                  </div>
                </td>
                <td
                  className="col-1"
                  onDoubleClick={() => {
                    // item.Status === PROFILE_STATUS.CLOSED ?
                    //     toast.warning('You cannot view Closed tutor Profile!') :
                    redirect_to_tutor_setup(
                      item.AcademyId,
                      item.TutorScreenname
                    );
                  }}
                >
                  <Avatar avatarSrc={item.Photo} showOnlineStatus={false} />
                </td>
                {/* <td>{item.TutorScreenname}</td> */}
                <td>{item.FirstName + " " + item.LastName}</td>
                <td className="col-1">{item.Email}</td>
                <td className="col-1">{item.CellPhone}</td>
                <td className="col-2">
                  {convertGMTOffsetToLocalString(item.GMT)}
                </td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>
                  {!!item.StatusReason ? (
                    <Tooltip width="200px" text={item.StatusReason}>
                      <IoChatbox size={25} />
                    </Tooltip>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-1 " >
                  <div className="" ref={dropdownRef}>
                    <BsThreeDotsVertical
                      onClick={() => handleDropdownClick(index)}
                      style={{ cursor: "pointer" }}
                    />
                    <div
                      className=" list-group position-absolute shadow"
                      style={{
                        right: "0",
                        transition: "all 0.3s ease",
                        height: dropdownOpen === index ? "90px" : "0",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{ height: dropdownOpen === index ? "30px" : 0, padding:0 }}
                        className="list-group-item list-group-item-action text-start cursor-pointer"
                        onClick={() => {
                          console.log("Hello profile")
                          setDropdownOpen(null);
                          redirect_to_tutor_setup(
                            item.AcademyId,
                            item.TutorScreenname
                          );
                        }}
                      >
                        View Profile
                      </div>
                      <div
                        style={{ height: dropdownOpen === index ? "30px" : 0, padding:0  }}
                        className="list-group-item list-group-item-action text-start cursor-pointer"
                        onClick={() => {
                          console.log("hello1", index);
                          setOpenDegModal(true);
                          getDoc("degree", item.AcademyId).then((res) =>
                          setDocUrl(res?.[0]?.DegFileName)
                        );
                        setOpenDegModal(true);
                          setDropdownOpen(null);
                        }}
                      >
                        View Degree
                      </div>
                      <div
                        style={{ height: dropdownOpen === index ? "30px" : 0 , padding:0 }}
                        className="list-group-item list-group-item-action text-start cursor-pointer"
                        onClick={() => {
                          console.log("hello", index);
                          setOpenCertModal(true);
                          getDoc("certificate", item.AcademyId).then((res) =>
                          setDocUrl(res?.[0]?.CertFileName)
                        );
                          setDropdownOpen(null);
                        }}
                      >
                        View Certificate
                      </div>
                    </div>
                  </div>
                </td>
                {/* <td className="p-1 col-1">
                  <button
                    className="m-0 mb-1 w-100 btn btn-success"
                    onClick={() => {
                      getDoc("degree", item.AcademyId).then((res) =>
                        setDocUrl(res?.[0]?.DegFileName)
                      );
                      setOpenDegModal(true);
                    }}
                  >
                    View Degree
                  </button>
                  <button
                    className="btn m-0 btn-primary w-100"
                    onClick={() => {
                      getDoc("certificate", item.AcademyId).then((res) =>
                        setDocUrl(res?.[0]?.CertFileName)
                      );

                      setOpenCertModal(true);
                    }}
                  >
                    View Certificate
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-danger"> No record Found!</div>
      )}

      <StatusReason
        open={modalOpen}
        status={selectedStatus}
        user={selectedUser}
        handleProceed={handleProceed}
        onClose={() => {
          setModalOpen(false);
          setSelectedStatus("");
          setSelectedUser({});
          setStatusReason("");
        }}
        statusReason={statusReason}
        setStatusReason={setStatusReason}
      />
      <CertificateModal
        open={openCertModal}
        docUrl={docUrl}
        onClose={() => setOpenCertModal(false)}
      />
      <DegreeModal
        open={openDegModal}
        docUrl={docUrl}
        onClose={() => setOpenDegModal(false)}
      />
    </div>
  );
};

export default TutorTable;
