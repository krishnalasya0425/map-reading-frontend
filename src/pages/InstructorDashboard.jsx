import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Instructor.css";

export default function InstructorDashboard() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    regiment: "",
    batch_no: "",
    army_id: "",
    role: "student",
    status: "Pending",
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Fetch all students
      const res = await api.get("/users/role/student");
      const allStudents = res.data;

      // Fetch OTPs for students
      const otpRes = await api.get("/otp/instructor-dashboard"); 
      const otpData = otpRes.data; // [{ student: {...}, otp, valid }, ...]

      // Merge OTP info if exists
      const studentsWithOtp = allStudents.map(student => {
        const otpEntry = otpData.find(o => o.student.id === student.id);
        return {
          ...student,
          otp: otpEntry?.otp || null,
          otpValid: otpEntry?.valid || false
        };
      });

      setStudents(studentsWithOtp);
    } catch (err) {
      console.error(err);
    }
  };

  const approveStudent = async (id) => {
    await updateStatus(id, "Approved");
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/users/${id}/status`, { status });
      setStudents(students.map(s => s.id === id ? { ...s, status } : s));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const startEdit = (student) => {
    setEditingStudent(student);
    setForm({ ...student });
    setShowModal(true);
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setForm({
      name: "",
      regiment: "",
      batch_no: "",
      army_id: "",
      role: "student",
      status: "Pending",
    });
    setShowModal(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/users/${editingStudent.id}`, form);
      }
      cancelEdit();
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to update student");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/users/${id}`);
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    }
  };

  // Generate OTP for a student (optional)
  const generateOtp = async (armyId) => {
    try {
      await api.post("/otp/request", { armyId });

      alert("OTP generated for student!");
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to generate OTP");
    }
  };

  return (
    <div className="instructor-page">
      {/* Sidebar */}
      <div className="instructor-sidebar">
        <h2>Instructor Dashboard</h2>
        <button className="active">All Students</button>
        <button className="logout-btn">Logout</button>
      </div>

      {/* Main content */}
      <div className="instructor-main">
        <h2>All Students</h2>
        <div className="instructor-card">
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Army ID</th>
                <th>Batch No</th>
                <th>Regiment</th>
                <th>Status</th>
                <th>OTP</th> {/* OTP column */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.army_id}</td>
                  <td>{s.batch_no}</td>
                  <td>{s.regiment}</td>
                  <td>{s.status || "Pending"}</td>
                  <td style={{ color: s.otpValid ? "green" : "red", fontWeight: "bold" }}>
                    {s.otp || "-"}
                  </td>
                  <td style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                    <button className="btn-edit" onClick={() => startEdit(s)}>Edit</button>
                    <button className="btn-delete" onClick={() => deleteStudent(s.id)}>Delete</button>
                    {s.status !== "Approved" && s.status !== "Rejected" && (
                      <button className="btn-approve" onClick={() => approveStudent(s.id)}>Approve</button>
                    )}
                    <button className="btn-otp" onClick={() => generateOtp(s.army_id)}>Generate OTP</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Edit Student</h3>
            <form onSubmit={submitForm}>
              <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
              <input name="regiment" placeholder="Regiment" value={form.regiment} onChange={handleChange} />
              <input name="batch_no" placeholder="Batch No" value={form.batch_no} onChange={handleChange} />
              <input name="army_id" placeholder="Army ID" value={form.army_id} onChange={handleChange} />
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                <button className="btn-add">{editingStudent ? "Update" : "Add"}</button>
                <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
