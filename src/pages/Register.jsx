import { useState } from "react";
import api from "../entities/axios";
import React from "react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl">

        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <circle cx="20" cy="20" r="20" fill="#074F06" />
            <path d="M20 10C16.134 10 13 13.134 13 17C13 22.25 20 30 20 30C20 30 27 22.25 27 17C27 13.134 23.866 10 20 10ZM20 19.5C18.619 19.5 17.5 18.381 17.5 17C17.5 15.619 18.619 14.5 20 14.5C21.381 14.5 22.5 15.619 22.5 17C22.5 18.381 21.381 19.5 20 19.5Z" fill="white" />
          </svg>
          <h1 className="text-xl font-bold" style={{ color: '#074F06' }}>Map Reading</h1>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2 text-gray-800">
          Create Account
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Fill the details below to register
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="col-span-2 w-full px-4 py-2 border rounded-lg outline-none"
            style={{ transition: 'box-shadow 0.2s' }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #074F06'}
            onBlur={(e) => e.target.style.boxShadow = ''}
            required
          />

          <input
            name="regiment"
            placeholder="Regiment"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg outline-none"
            style={{ transition: 'box-shadow 0.2s' }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #074F06'}
            onBlur={(e) => e.target.style.boxShadow = ''}
            required
          />

          <input
            name="batch_no"
            placeholder="Batch No"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg outline-none"
            style={{ transition: 'box-shadow 0.2s' }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #074F06'}
            onBlur={(e) => e.target.style.boxShadow = ''}
            required
          />

          <input
            name="army_id"
            placeholder="Army ID"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg outline-none"
            style={{ transition: 'box-shadow 0.2s' }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #074F06'}
            onBlur={(e) => e.target.style.boxShadow = ''}
            required
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg outline-none bg-white"
            style={{ transition: 'box-shadow 0.2s' }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #074F06'}
            onBlur={(e) => e.target.style.boxShadow = ''}
            required
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="col-span-2 w-full px-4 py-2 border rounded-lg outline-none"
            style={{ transition: 'box-shadow 0.2s' }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #074F06'}
            onBlur={(e) => e.target.style.boxShadow = ''}
            required
          />

          <button
            type="submit"
            className="col-span-2 w-full py-2 text-white rounded-lg font-semibold transition"
            style={{ backgroundColor: '#074F06' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#053d05'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#074F06'}
          >
            Register
          </button>
        </form>

        {/* Success/Error Message */}
        {msg && (
          <p className="text-green-600 text-center mt-3 font-medium">
            {msg}
          </p>
        )}

        {/* Link to Login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="hover:underline" style={{ color: '#074F06' }}>
            Login here
          </a>
        </p>

      </div>
    </div>
  );
}
