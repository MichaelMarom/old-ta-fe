import { useEffect, useState } from "react";
import {
  get_role_count_by_status,
  get_student_data,
  get_tutor_data,
  set_student_status,
} from "../../axios/admin";
import { convertGMTOffsetToLocalString } from "../../utils/moment";
import Loading from "../common/Loading";
import { statesColours } from "../../constants/constants";
import { toast } from "react-toastify";
import Avatar from "../common/Avatar";
import Tooltip from "../common/ToolTip";
import { IoChatbox } from "react-icons/io5";
import StatusReason from "./StatusReason";
import { updateTutorSetup } from "../../axios/tutor";
import {
  update_student_setup,
  upload_student_setup_by_fields,
} from "../../axios/student";

const StudentTable = () => {
  let [data, set_data] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [status, setStatus] = useState("pending");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusCount, setStatusCount] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [statusReason, setStatusReason] = useState("");

  const handleReasonStatus = (user, status) => {
    setModalOpen(true);
    setSelectedUser(user);
    console.log(user, status);
    setSelectedStatus(status);
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    setModalOpen(false);
    setSelectedUser({});
    setSelectedStatus("");
    setUpdatingStatus(true);

    selectedUser.AcademyId &&
      (await upload_student_setup_by_fields(selectedUser.AcademyId, {
        Status: selectedStatus,
        StatusReason: statusReason,
      }));
    setStatusReason("");

    // !!phone && !!phone.startsWith("+1") && await send_sms({
    //   message: `Your account is currently in "${status}" state.`,
    //   numbers: [phone.replace("+", "")],
    //   id
    // })

    setStatus(selectedStatus);
    const result = await get_student_data(status);
    get_role_count_by_status("student").then(
      (data) => !data?.response?.data && setStatusCount(data)
    );
    if (!result?.response?.data) {
      set_data(result);
      setUpdatingStatus(false);
    }
  };

  const COLUMNS = [
    {
      Header: "Status",
    },
    {
      Header: "Photo",
    },
    {
      Header: "Screen ID",
    },
    {
      Header: "Student Name",
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
      Header: "Tot. $ Paid",
    },
    {
      Header: "Last Active",
    },
    {
      Header: "Reason",
    },
  ];

  useEffect(() => {
    setLoading(true);
    get_student_data(status)
      .then((result) => {
        if (result && !result?.response?.data) {
          set_data(result);
        }
      })
      .finally(() => {
        setFetched(true);
        setLoading(false);
      });
  }, [status]);

  useEffect(() => {
    get_role_count_by_status("student").then(
      (data) => !data?.response?.data && setStatusCount(data)
    );
  }, []);

  let handleStatusChange = async (item, status, currentStatus) => {
    if (currentStatus === "closed")
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
    let response = await upload_student_setup_by_fields(item.AcademyId, {
      Status: status,
      StatusReason: null,
    });
    setStatus(status);
    get_student_data(status)
      .then((result) => {
        if (result && !result?.response?.data) {
          set_data(result);
          setUpdatingStatus(false);
        }
      })
      .finally(() => {
        setFetched(true);
        setLoading(false);
      });

    get_role_count_by_status("student").then(
      (data) => !data?.response?.data && setStatusCount(data)
    );
  };

  let redirect_to_student_setup = (student_id, screenName) => {
    window.localStorage.setItem("student_user_id", student_id);
    localStorage.setItem("student_screen_name", screenName);
    window.localStorage.setItem("user_role", "admin");
    window.open(`${process.env.REACT_APP_BASE_URL}/student/setup`, "_blank");
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          overflowY: "auto",
          height: "90vh",
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
            Pending{" "}
            {statusCount?.find((rec) => rec.Status === "pending")?.count && (
              <span
                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
                style={{
                  width: "20px",
                  fontSize: "12px",
                  height: "20px",
                  marginLeft: "8px",
                }}
              >
                {statusCount?.find((rec) => rec.Status === "pending")?.count}
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
            {statusCount?.find((rec) => rec.Status === "under-review")
              ?.count && (
              <span
                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
                style={{
                  width: "20px",
                  fontSize: "12px",
                  height: "20px",
                  marginLeft: "8px",
                }}
              >
                {
                  statusCount?.find((rec) => rec.Status === "under-review")
                    ?.count
                }
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
            {statusCount?.find((rec) => rec.Status === "active")?.count && (
              <span
                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center d-flex justify-content-center align-items-center"
                style={{
                  width: "20px",
                  fontSize: "12px",
                  height: "20px",
                  marginLeft: "8px",
                }}
              >
                {statusCount?.find((rec) => rec.Status === "active")?.count}
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
            {statusCount?.find((rec) => rec.Status === "suspended")?.count && (
              <span
                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
                style={{
                  width: "20px",
                  fontSize: "12px",
                  height: "20px",
                  marginLeft: "8px",
                }}
              >
                {statusCount?.find((rec) => rec.Status === "suspended")?.count}
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
            {statusCount?.find((rec) => rec.Status === "disapproved")
              ?.count && (
              <span
                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center border"
                style={{
                  width: "20px",
                  fontSize: "12px",
                  height: "20px",
                  marginLeft: "8px",
                }}
              >
                {
                  statusCount?.find((rec) => rec.Status === "disapproved")
                    ?.count
                }
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
            {statusCount?.find((rec) => rec.Status === "closed")?.count && (
              <span
                className="rounded-circle text-bg-danger p-1 d-flex justify-content-center align-items-center"
                style={{
                  width: "20px",
                  fontSize: "12px",
                  height: "20px",
                  marginLeft: "8px",
                }}
              >
                {statusCount?.find((rec) => rec.Status === "closed")?.count}
              </span>
            )}
          </div>
        </div>
        {!loading && !updatingStatus ? (
          fetched && !data.length ? (
            <p className="text-danger">No Students Found!</p>
          ) : (
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
                {data.map((item) => (
                  <tr
                    key={item.SID}
                    onDoubleClick={(e) =>
                      redirect_to_student_setup(item.AcademyId, item.ScreenName)
                    }
                  >
                    <td className="col-1">
                      <div className="col-10 m-auto">
                        <select
                          value={item.Status}
                          onChange={(e) =>
                            handleStatusChange(
                              item,
                              e.target.value,
                              item.Status
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

                    <td>
                      <Avatar showOnlineStatus={false} avatarSrc={item.Photo} />
                    </td>
                    <td>{item.ScreenName}</td>
                    <td>{item.FirstName + " " + item.LastName}</td>
                    <td className="col-1">{item.email}</td>
                    <td>{item.Cell}</td>
                    <td className="col-2">{convertGMTOffsetToLocalString(item.GMT)}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <Loading />
        )}
      </div>
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
    </>
  );
};

export default StudentTable;
