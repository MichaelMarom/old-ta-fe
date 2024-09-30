import { COMMISSION_DATA } from "../../../constants/constants";

const AcadCommissionTable = () => {
  return (
    <>
      <div className="rate-table">
        <table>
          <thead>
          <tr>
            <th>Time range</th>
            <th>Percentage</th>
          </tr>
          </thead>
          <tbody>
            {COMMISSION_DATA.map((data) => (
              <tr key={data.percent}>
                <td>{data.time}</td>
                <td>{data.percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AcadCommissionTable;
