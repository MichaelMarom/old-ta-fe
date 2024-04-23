import { COMMISSION_DATA } from "../../../constants/constants";

const Acad_Commission = () => {
  return (
    <>
      <div className="rate-table">
        <table>
          <tr>
            <th>Time range</th>
            <th>Percentage</th>
          </tr>
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

export default Acad_Commission;
