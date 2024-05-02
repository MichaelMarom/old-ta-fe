import { useEffect, useState } from "react";
import { get_tutor_data, set_tutor_status } from "../../axios/admin";
import { convertGMTOffsetToLocalString } from "../../helperFunctions/timeHelperFunctions";
import Loading from "../common/Loading";
import ToolTip from "../common/ToolTip";
import Pill from "../common/Pill";
import { FcApprove } from "react-icons/fc";
import { FcDisapprove } from "react-icons/fc";
import { toast } from "react-toastify";
import { statesColours } from "../../constants/constants";
import { get_tutor_count_by_status } from "../../axios/admin";

const TutorTable = () => {
  let [data, set_data] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [status, setStatus] = useState("pending");
  const [statusCount, setStatusCount] = useState([]);
  const COLUMNS = [
    {
      Header: "Status",
      accessor: "Status",
    },
    {
      Header: "Photo",
      accessor: "Photo",
    },
    {
      Header: "Screen Id",
      accessor: "Screen Id",
    },
    {
      Header: "Tutor Name",
      accessor: "Tutor Name",
    },
    {
      Header: "Email",
      accessor: "Email",
    },
    {
      Header: "Phone",
      accessor: "Phone",
    },
    {
      Header: "GMT",
      accessor: "GMT",
    },
    {
      Header: "Tot. Hours",
      accessor: "Tot. Hours",
    },
    {
      Header: "Earned",
      accessor: "Earned",
    },
    {
      Header: "Last Active",
      accessor: "Last Active",
    },
    {
      Header: "ID Verified",
      accessor: "ID Verified",
    },
    {
      Header: "BG Verified",
      accessor: "BG Verified",
    },
    {
      Header: "Action",
      accessor: "Action",
    },
  ];

  useEffect(() => {
    get_tutor_count_by_status().then(
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

  let handleStatusChange = async (id, status, currentStatus) => {
    if (currentStatus === "pending")
      return toast.warning(
        'You can only change  Status of "Under-Review" Tutors!'
      );
    if (currentStatus === status)
      return toast.warning(`You already on "${status}" Status`);
    setUpdatingStatus(true);
    let response = await set_tutor_status(id, status);

    if (response.bool) {
      const result = await get_tutor_data();
      if (!result?.response?.data) {
        set_data(result);
        setUpdatingStatus(false);
      }
    } else {
      toast.error(response.mssg);
      setUpdatingStatus(false);
    }
  };

  let redirect_to_tutor_setup = (tutor_user_id, screenName) => {
    window.localStorage.setItem("tutor_user_id", tutor_user_id);
    window.localStorage.setItem("tutor_screen_name", screenName);
    window.localStorage.setItem("user_role", "admin");
    window.open(`${process.env.REACT_APP_BASE_URL}/tutor/setup`, "_blank");
  };

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
          Pending{" "}
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
            color: statesColours["under-review"].color,
            background: statesColours["under-review"].bg,
            border: status === "under-review" ? "2px solid #268daf" : "none",
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
      ) : data.length > 0 ? (
        <table style={{ position: "relative" }}>
          <thead>
            <tr>
              {COLUMNS.map((item) => (
                <th key={item.Header}>{item.Header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.SID}>
                <td data-src={null} className="col-1">
                  <div className="col-10 m-auto">
                    <Pill
                      customColor={true}
                      label={item.Status}
                      fontColor={statesColours[item.Status].color}
                      color={statesColours[item.Status].bg}
                      hasIcon={false}
                    />
                  </div>
                </td>

                <td
                  data-src={null}
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
                  <img
                    src={item.Photo}
                    alt="profile=pic"
                    style={{ height: "80px", width: "100px" }}
                  />
                </td>
                <td data-src={item.TutorScreenname}>{item.TutorScreenname}</td>
                <td data-src={item.FirstName + " " + item.LastName}>
                  {item.FirstName + " " + item.LastName}
                </td>
                <td data-src={item.Email}>{item.Email}</td>
                <td data-src={item.CellPhone} className="col-1">
                  {item.CellPhone}
                </td>
                <td data-src={item.GMT} className="col-1">
                  {convertGMTOffsetToLocalString(item.GMT)}
                </td>
                <td data-src={item.ResponseHrs}>{item.ResponseHrs}</td>
                <td data-src={null}>{null}</td>
                <td data-src={null}>{null}</td>
                <td data-src={item.IdVerified}>{item.IdVerified}</td>
                <td data-src={item.BackgroundVerified}>
                  {item.BackgroundVerified}
                </td>
                <td>
                  <div>
                    <ToolTip text="Mark Inactive">
                      <FcDisapprove
                        size={40}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleStatusChange(
                            item.AcademyId,
                            "disapproved",
                            item.Status
                          )
                        }
                      />
                    </ToolTip>
                    <ToolTip text="Mark Active" direction="bottomleft">
                      <FcApprove
                        size={40}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleStatusChange(
                            item.AcademyId,
                            "active",
                            item.Status
                          )
                        }
                      />
                    </ToolTip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-danger"> No record Found!</div>
      )}
    </div>
  );
};

export default TutorTable;
