import { useEffect, useState } from "react";
import axios from "axios";

function StaffList({ setPage }) {

  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    getStaff();
  }, []);

  async function getStaff() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/staff"
      );

      setStaffList(response.data);
    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend");
    }
  }

  return (
    <div className="container">

      <h1>Staff Details</h1>

      <button onClick={() => setPage("staff")}>
        Add Staff
      </button>

      <button
        onClick={() => setPage("home")}
        className="secondary-button"
      >
        Home
      </button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Salary</th>
            <th>Skills</th>
            <th>Batch Timings</th>
          </tr>
        </thead>

        <tbody>
          {staffList.length === 0 ? (
            <tr>
              <td colSpan="5">
                No Staff Added
              </td>
            </tr>
          ) : (
            staffList.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.id}</td>
                <td>{item.salary}</td>
                <td>{item.skills.join(", ")}</td>
                <td>{item.batches.join(", ")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default StaffList;