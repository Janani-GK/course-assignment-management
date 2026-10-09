import { useState } from "react";
import axios from "axios";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    if (username === "" || password === "") {
      alert("Please enter username and password");
      return;
    }

    try {
      const response = await axios.post(
        "https://course-assignment-backend.vercel.app/api/auth/login",
        {
          username: username,
          password: password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "username",
        response.data.username
      );

      alert("Login successful");

      setIsLoggedIn(true);

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Invalid username or password"
        );
      } else {
        alert("Cannot connect to backend");
      }
    }
  }

  return (
    <div className="login-container">

      <div className="login-box">

        <h1>Course Assignment</h1>

        <h2>Admin Login</h2>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;
