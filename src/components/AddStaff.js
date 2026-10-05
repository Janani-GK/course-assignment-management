import { useEffect, useState } from "react";
import axios from "axios";

function AddStaff({ setPage }) {

  const skillList = [
    "Java",
    "Python",
    "React",
    "Angular",
    "SQL"
  ];

  const batchList = [
    "7.30-9",
    "9-10.30",
    "10.30-12",
    "12-1.30",
    "2-3.30",
    "3.30-5",
    "5-6.30",
    "6.30-8"
  ];

  const [staffList, setStaffList] = useState([]);

  const [staff, setStaff] = useState({
    name: "",
    id: "",
    salary: "",
    skills: [],
    batches: []
  });

  const [editId, setEditId] = useState("");

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

  function handleSkill(skill) {
    if (staff.skills.includes(skill)) {
      setStaff({
        ...staff,
        skills: staff.skills.filter(
          item => item !== skill
        )
      });
    } else {
      setStaff({
        ...staff,
        skills: [...staff.skills, skill]
      });
    }
  }

  function handleBatch(batch) {
    if (staff.batches.includes(batch)) {
      setStaff({
        ...staff,
        batches: staff.batches.filter(
          item => item !== batch
        )
      });
    } else {
      setStaff({
        ...staff,
        batches: [...staff.batches, batch]
      });
    }
  }

  async function saveStaff() {
    if (
      staff.name === "" ||
      staff.id === "" ||
      staff.salary === "" ||
      staff.skills.length === 0 ||
      staff.batches.length === 0
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId === "") {
        await axios.post(
          "http://localhost:5000/api/staff",
          staff
        );

        alert("Staff added successfully");
      } else {
        await axios.put(
          `http://localhost:5000/api/staff/${editId}`,
          staff
        );

        alert("Staff updated successfully");
      }

      clearForm();
      getStaff();

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Error saving staff"
        );
      } else {
        alert("Cannot connect to backend");
      }
    }
  }

  function editStaff(item) {
    setStaff({
      name: item.name,
      id: item.id,
      salary: item.salary,
      skills: item.skills,
      batches: item.batches
    });

    setEditId(item._id);
  }

  async function deleteStaff(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/staff/${id}`
      );

      alert("Staff deleted successfully");

      getStaff();

    } catch (error) {
      console.log(error);
      alert("Error deleting staff");
    }
  }

  function clearForm() {
    setStaff({
      name: "",
      id: "",
      salary: "",
      skills: [],
      batches: []
    });

    setEditId("");
  }

  return (
    <div className="container">

      <h1>
        {editId === "" ? "Add Staff" : "Edit Staff"}
      </h1>

      <input
        type="text"
        placeholder="Staff Name"
        value={staff.name}
        onChange={(e) =>
          setStaff({
            ...staff,
            name: e.target.value
          })
        }
      />

      <input
        type="text"
        placeholder="Staff ID"
        value={staff.id}
        onChange={(e) =>
          setStaff({
            ...staff,
            id: e.target.value
          })
        }
      />

      <input
        type="number"
        placeholder="Salary"
        value={staff.salary}
        onChange={(e) =>
          setStaff({
            ...staff,
            salary: e.target.value
          })
        }
      />

      <h3>Skills</h3>

      <div className="checkbox-list">
        {skillList.map(skill => (
          <label key={skill}>
            <input
              type="checkbox"
              checked={staff.skills.includes(skill)}
              onChange={() => handleSkill(skill)}
            />
            {skill}
          </label>
        ))}
      </div>

      <h3>Batch Timings</h3>

      <div className="checkbox-list">
        {batchList.map(batch => (
          <label key={batch}>
            <input
              type="checkbox"
              checked={staff.batches.includes(batch)}
              onChange={() => handleBatch(batch)}
            />
            {batch}
          </label>
        ))}
      </div>

      <button onClick={saveStaff}>
        {editId === "" ? "Save Staff" : "Update Staff"}
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

      <h2>Staff Details</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Salary</th>
            <th>Skills</th>
            <th>Batch Timings</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {staffList.length === 0 ? (
            <tr>
              <td colSpan="6">No Staff Added</td>
            </tr>
          ) : (
            staffList.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.id}</td>
                <td>{item.salary}</td>
                <td>{item.skills.join(", ")}</td>
                <td>{item.batches.join(", ")}</td>

                <td>
                  <button
                    onClick={() => editStaff(item)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteStaff(item._id)}
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

export default AddStaff;