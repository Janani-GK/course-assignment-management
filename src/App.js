import { useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Home from "./components/Home";
import AddStaff from "./components/AddStaff";
import StaffList from "./components/StaffList";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";
import Mapping from "./components/Mapping";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") !== null
  );

  const [page, setPage] = useState("home");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    setPage("home");
  }

  if (!isLoggedIn) {
    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  return (
    <>
      {page === "home" && (
        <Home
          setPage={setPage}
          logout={logout}
        />
      )}

      {page === "staff" && (
        <AddStaff setPage={setPage} />
      )}

      {page === "stafflist" && (
        <StaffList setPage={setPage} />
      )}

      {page === "student" && (
        <AddStudent setPage={setPage} />
      )}

      {page === "studentlist" && (
        <StudentList setPage={setPage} />
      )}

      {page === "mapping" && (
        <Mapping setPage={setPage} />
      )}
    </>
  );
}

export default App;