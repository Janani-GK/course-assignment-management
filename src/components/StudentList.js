import { useEffect, useState } from "react";
import axios from "axios";

function StudentList({ setPage }) {

  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    getStudents();
  }, []);

  async function getStudents() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/students"
      );

      setStudentList(response.data);
    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend");
    }
  }

  return (
    <div className="container">

      <h1>Student Details</h1>

      <button onClick={() => setPage("student")}>
        Add Student
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
            <th>Courses</th>
          </tr>
        </thead>

        <tbody>
          {studentList.length === 0 ? (
            <tr>
              <td colSpan="3">
                No Students Added
              </td>
            </tr>
          ) : (
            studentList.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.id}</td>
                <td>{item.courses.join(", ")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default StudentList;