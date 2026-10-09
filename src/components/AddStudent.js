import { useEffect, useState } from "react";
import axios from "axios";

function AddStudent({ setPage }) {

  const courseList = [
    "Java",
    "Python",
    "React",
    "Angular",
    "SQL"
  ];

  const [studentList, setStudentList] = useState([]);

  const [student, setStudent] = useState({
    name: "",
    id: "",
    courses: []
  });

  const [editId, setEditId] = useState("");

  useEffect(() => {
    getStudents();
  }, []);

  async function getStudents() {
    try {
      const response = await axios.get(
        "https://course-assignment-backend.vercel.app/api/students"
      );

      setStudentList(response.data);
    } catch (error) {
      console.log(error);
      alert("Cannot connect to backend");
    }
  }

  function handleCourse(course) {
    if (student.courses.includes(course)) {
      setStudent({
        ...student,
        courses: student.courses.filter(
          item => item !== course
        )
      });
    } else {
      setStudent({
        ...student,
        courses: [...student.courses, course]
      });
    }
  }

  async function saveStudent() {
    if (
      student.name === "" ||
      student.id === "" ||
      student.courses.length === 0
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId === "") {
        await axios.post(
          "https://course-assignment-backend.vercel.app/api/students",
          student
        );

        alert("Student added successfully");
      } else {
        await axios.put(
          `https://course-assignment-backend.vercel.app/api/students/${editId}`,
          student
        );

        alert("Student updated successfully");
      }

      clearForm();
      getStudents();

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Error saving student"
        );
      } else {
        alert("Cannot connect to backend");
      }
    }
  }

  function editStudent(item) {
    setStudent({
      name: item.name,
      id: item.id,
      courses: item.courses
    });

    setEditId(item._id);
  }

  async function deleteStudent(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `https://course-assignment-backend.vercel.app/api/students/${id}`
      );

      alert("Student deleted successfully");

      getStudents();

    } catch (error) {
      console.log(error);
      alert("Error deleting student");
    }
  }

  function clearForm() {
    setStudent({
      name: "",
      id: "",
      courses: []
    });

    setEditId("");
  }

  return (
    <div className="container">

      <h1>
        {editId === "" ? "Add Student" : "Edit Student"}
      </h1>

      <input
        type="text"
        placeholder="Student Name"
        value={student.name}
        onChange={(e) =>
          setStudent({
            ...student,
            name: e.target.value
          })
        }
      />

      <input
        type="text"
        placeholder="Student ID"
        value={student.id}
        onChange={(e) =>
          setStudent({
            ...student,
            id: e.target.value
          })
        }
      />

      <h3>Courses</h3>

      <div className="checkbox-list">
        {courseList.map(course => (
          <label key={course}>
            <input
              type="checkbox"
              checked={student.courses.includes(course)}
              onChange={() => handleCourse(course)}
            />
            {course}
          </label>
        ))}
      </div>

      <button onClick={saveStudent}>
        {editId === ""
          ? "Save Student"
          : "Update Student"}
      </button>

      {editId !== "" && (
        <button
          onClick={clearForm}
          className="secondary-button"
        >
          Cancel
        </button>
      )}

      <button
        onClick={() => setPage("home")}
        className="secondary-button"
      >
        Home
      </button>

      <hr />

      <h2>Student Details</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Courses</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {studentList.length === 0 ? (
            <tr>
              <td colSpan="4">
                No Students Added
              </td>
            </tr>
          ) : (
            studentList.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.id}</td>
                <td>{item.courses.join(", ")}</td>

                <td>
                  <button
                    onClick={() => editStudent(item)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteStudent(item._id)
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

export default AddStudent;
