// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import "./Login.css"; // <-- import the CSS

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [armyId, setArmyId] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMsg("");

//     try {
//       const user = await login(armyId, password);

//       if (user.role === "admin") navigate("/admin");
//       else if (user.role === "instructor") navigate("/instructor");
//       else if (user.role === "student") navigate("/student");
//       else setMsg("Unknown role");
//     } catch (err) {
//       console.error(err);
//       setMsg(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <section className="login-page">
//       <div className="login-card">
//         <a href="#" className="login-logo">
//           <img
//             src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
//             alt="logo"
//           />
//           Map Reading
//         </a>

//         <h1>Login to your account</h1>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Army ID"
//             value={armyId}
//             onChange={(e) => setArmyId(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button type="submit">Login</button>
//         </form>

//         {msg && <p className="msg">{msg}</p>}

//         <p>
//           Don't have an account?{" "}
//           <a href="/register">Register here</a>
//         </p>
//       </div>
//     </section>
//   );
// }
// Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [armyId, setArmyId] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const user = await login(armyId, password);

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "instructor") navigate("/instructor");
      else if (user.role === "student") navigate("/student");
      else setMsg("Unknown role");
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <a href="#" className="login-logo">
          <img
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Map Reading
        </a>

        <h1>Login to your account</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Army ID"
            value={armyId}
            onChange={(e) => setArmyId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {msg && <p className="msg">{msg}</p>}

        <p>
          Forgot Password?{" "}
          <a href="/forgot-password">Click here</a>
        </p>

        <p>
          Don't have an account?{" "}
          <a href="/register">Register here</a>
        </p>
      </div>
    </section>
  );
}
