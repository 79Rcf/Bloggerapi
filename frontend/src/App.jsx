import { useState } from "react";

function App() {
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json();
      setMessage("Register: " + JSON.stringify(data));
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      setMessage("Login: " + JSON.stringify(data));

      // Optional: save token for future requests
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegisterSubmit}>
        <input name="username" placeholder="Username" onChange={handleRegisterChange} />
        <br />
        <input name="email" type="email" placeholder="Email" onChange={handleRegisterChange} />
        <br />
        <input name="password" type="password" placeholder="Password" onChange={handleRegisterChange} />
        <br />
        <button type="submit">Register</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleLoginChange} />
        <br />
        <input name="password" type="password" placeholder="Password" onChange={handleLoginChange} />
        <br />
        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default App;
