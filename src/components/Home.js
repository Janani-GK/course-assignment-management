function Home({ setPage, logout }) {
  const username = localStorage.getItem("username");

  return (
    <div className="container">

      <div className="top-bar">
        <div>
          <h1>Course Assignment Management</h1>
          <p>Admin Dashboard</p>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <h3>Welcome, {username}</h3>

      <div className="menu">

        <button onClick={() => setPage("staff")}>
          Add Staff
        </button>

        <button onClick={() => setPage("stafflist")}>
          Staff Details
        </button>

        <button onClick={() => setPage("student")}>
          Add Student
        </button>

        <button onClick={() => setPage("studentlist")}>
          Student Details
        </button>

        <button onClick={() => setPage("mapping")}>
          Student Mapping
        </button>

      </div>

    </div>
  );
}

export default Home;