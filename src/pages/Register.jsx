import { useState } from "react";
import api from "../api/axios";
import "./Register.css"; // <-- import the CSS

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    regiment: "",
    batch_no: "",
    army_id: "",
    role: "student",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/register", form);
      setMsg("Registration submitted. Await approval.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <section className="register-page">
      <div className="register-card">
        <h2>Register</h2>
        <p>Create your account</p>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="col-span-2"
            required
          />
          <input
            name="regiment"
            placeholder="Regiment"
            onChange={handleChange}
            required
          />
          <input
            name="batch_no"
            placeholder="Batch No"
            onChange={handleChange}
            required
          />
          <input
            name="army_id"
            placeholder="Army ID"
            onChange={handleChange}
            required
          />
          <select name="role" onChange={handleChange} required>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="col-span-2">Register</button>
        </form>

        {msg && <p className="msg">{msg}</p>}

        <p className="footer-link">
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>
      </div>
    </section>
  );
}
