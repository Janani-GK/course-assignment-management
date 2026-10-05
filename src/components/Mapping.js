import { useEffect, useState } from "react";
import axios from "axios";

function Mapping({ setPage }) {

  const [studentList, setStudentList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [assignmentList, setAssignmentList] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [course, setCourse] = useState("");
  const [staffId, setStaffId] = useState("");
  const [batch, setBatch] = useState("");

  useEffect(() => {
    getStudents();
    getStaff();
    getAssignments();
  }, []);

  async function getStudents() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/students"
      );

      setStudentList(response.data);
    } catch (error) {
      console.log(error);
      alert("Cannot get students");
    }
  }

  async function getStaff() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/staff"
      );

      setStaffList(response.data);
    } catch (error) {
      console.log(error);
      alert("Cannot get staff");
    }
  }

  async function getAssignments() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/assignments"
      );

      setAssignmentList(response.data);
    } catch (error) {
      console.log(error);
      alert("Cannot get assignments");
    }
  }

  const selectedStudent = studentList.find(
    student => student.id === studentId
  );

  const matchingStaff = staffList.filter(
    staff => staff.skills.includes(course)
  );

  const selectedStaff = staffList.find(
    staff => staff.id === staffId
  );

  function isBatchAssigned(staffId, batch) {
    return assignmentList.some(
      item =>
        item.staffId === staffId &&
        item.batch === batch
    );
  }

  async function assignStaff() {

    if (
      studentId === "" ||
      course === "" ||
      staffId === "" ||
      batch === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    if (isBatchAssigned(staffId, batch)) {
      alert(
        "This staff member is already assigned to this batch."
      );
      return;
    }

    const assignment = {
      studentName: selectedStudent.name,
      studentId: selectedStudent.id,
      course: course,
      staffName: selectedStaff.name,
      staffId: selectedStaff.id,
      batch: batch
    };

    try {
      await axios.post(
        "http://localhost:5000/api/assignments",
        assignment
      );

      alert("Staff assigned successfully");

      setStudentId("");
      setCourse("");
      setStaffId("");
      setBatch("");

      getAssignments();

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Assignment failed"
        );
      } else {
        alert("Cannot connect to backend");
      }
    }
  }

  async function deleteAssignment(id) {

    const confirmDelete = window.confirm(
      "Delete this assignment?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/assignments/${id}`
      );

      alert("Assignment deleted");

      getAssignments();

    } catch (error) {
      console.log(error);
      alert("Error deleting assignment");
    }
  }

  return (
    <div className="container">

      <h1>Student Mapping</h1>

      <h3>Select Student</h3>

      <select
        value={studentId}
        onChange={(e) => {
          setStudentId(e.target.value);
          setCourse("");
          setStaffId("");
          setBatch("");
        }}
      >
        <option value="">
          Select Student
        </option>

        {studentList.map(student => (
          <option
            key={student._id}
            value={student.id}
          >
            {student.name} - {student.id}
          </option>
        ))}
      </select>

      <h3>Select Course</h3>

      <select
        value={course}
        disabled={!selectedStudent}
        onChange={(e) => {
          setCourse(e.target.value);
          setStaffId("");
          setBatch("");
        }}
      >
        <option value="">
          Select Course
        </option>

        {selectedStudent &&
          selectedStudent.courses.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
      </select>

      <h3>Select Staff</h3>

      <select
        value={staffId}
        disabled={!course}
        onChange={(e) => {
          setStaffId(e.target.value);
          setBatch("");
        }}
      >
        <option value="">
          Select Staff
        </option>

        {matchingStaff.map(staff => (
          <option
            key={staff._id}
            value={staff.id}
          >
            {staff.name} - {staff.id}
          </option>
        ))}
      </select>

      <h3>Select Batch</h3>

      <select
        value={batch}
        disabled={!selectedStaff}
        onChange={(e) => setBatch(e.target.value)}
      >
        <option value="">
          Select Batch
        </option>

        {selectedStaff &&
          selectedStaff.batches.map(item => {

            const assigned = isBatchAssigned(
              selectedStaff.id,
              item
            );

            return (
              <option
                key={item}
                value={item}
                disabled={assigned}
              >
                {item}{" "}
                {assigned
                  ? "(Assigned)"
                  : "(Available)"}
              </option>
            );
          })}
      </select>

      <br />

      <button onClick={assignStaff}>
        Assign Staff
      </button>

      <button
        onClick={() => setPage("home")}
        className="secondary-button"
      >
        Home
      </button>

      <hr />

      <h2>Assignment Details</h2>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Student ID</th>
            <th>Course</th>
            <th>Staff</th>
            <th>Staff ID</th>
            <th>Batch</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {assignmentList.length === 0 ? (
            <tr>
              <td colSpan="7">
                No Assignments
              </td>
            </tr>
          ) : (
            assignmentList.map(item => (
              <tr key={item._id}>
                <td>{item.studentName}</td>
                <td>{item.studentId}</td>
                <td>{item.course}</td>
                <td>{item.staffName}</td>
                <td>{item.staffId}</td>
                <td>{item.batch}</td>

                <td>
                  <button
                    onClick={() =>
                      deleteAssignment(item._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}

export default Mapping;