import React, { useEffect, useState } from "react";
import testAPI  from "../entities/test";
import Users from "../entities/users";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiArrowRight, FiPlus } from "react-icons/fi";
import GenerateTest from "./GenerateTest";

const TestManagement = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");       // admin | Instructor | Student
  const userId = localStorage.getItem("id");      // current user id

  const [tests, setTests] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");

  const [newTestName, setNewTestName] = useState("");
  const [editTestId, setEditTestId] = useState(null);
  const [editTestName, setEditTestName] = useState("");
  const [open, setOpen] = useState(false);



  // Load tests on mount and when instructor filter changes
  useEffect(() => {
    loadTests();
  }, [selectedInstructorId]);

  const loadTests = async () => {
    try {
      let data;

      // ================= ADMIN =================
      if (role === "admin") {
        if (instructors.length === 0) {
          const inst = await Users.getByRole("Instructor");
          setInstructors(inst);
        }

        data = selectedInstructorId
          ? await testAPI.getAllTests(selectedInstructorId)
          : await testAPI.getAllTests();
      }

      // ================= STUDENT =================
      else if (role === "Student") {
        data = await testAPI.getAllTests(userId, "Student");
      }

      // ================= INSTRUCTOR =================
      else {
        data = await testAPI.getAllTests(userId);
      }

      setTests(data);
    } catch (err) {
      console.error("Error loading tests", err);
    }
  };

  console.log(tests)

  // Add test (Instructor only)
  const handleAddTest = async () => {
    if (!newTestName.trim()) return;
    await testAPI.addTest(newTestName, userId);
    setNewTestName("");
    loadTests();
  };

  // Delete test
  const handleDelete = async (id) => {
    await testAPI.deleteTest(id);
    loadTests();
  };

  // Edit test
  const handleEdit = (id, name) => {
    setEditTestId(id);
    setEditTestName(name);
  };

  const handleUpdate = async () => {
    await testAPI.updateTest(editTestId, editTestName);
    setEditTestId(null);
    setEditTestName("");
    loadTests();
  };

  const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};


const now = new Date();





  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Test Management</h2>

      {/* ================= ADMIN FILTER ================= */}
      {role === "admin" && (
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            Filter by Instructor
          </label>
          <select
            className="border px-3 py-2 rounded w-full"
            value={selectedInstructorId}
            onChange={(e) => setSelectedInstructorId(e.target.value)}
          >
            <option value="">All Instructors</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ================= INSTRUCTOR ADD TEST ================= */}
      {role === "Instructor" && (
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter test name"
            value={newTestName}
            onChange={(e) => setNewTestName(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <FiPlus /> Generate Test
      </button>

      {open && <GenerateTest onClose={() => setOpen(false)} />}
        </div>
      )}

      {/* ================= TEST LIST ================= */}
      <div className="space-y-3">
        {tests.map((test, idx) => (
          <div
            key={test.id}
            className="p-4 bg-white shadow rounded flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold">{idx + 1}.</span>

              {editTestId === test.id ? (
                <input
                  value={editTestName}
                  onChange={(e) => setEditTestName(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
              ) : (
                <span className="text-lg text-black">{test.title}</span>
              )}
            </div>

            <div className="flex gap-4 items-center">
              {/* Open test */}

               {role !== "Student" && (
                <>
              <button
                onClick={()=> navigate(`/${test.id}/review`)}
                className="text-green-600 hover:text-green-800"
                title="Open Test"
              >
                <FiArrowRight size={20} />
              </button>
              </> )}

                
                
               {role === "Student" && (
  <div className=" rounded-lg p-4 bg-white shadow-sm space-y-3">


    {/* ================= TITLE ================= */}
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-800">
        {test.test_title} — {test.set_name}
      </h2>

       

      {/* ================= START / SCORE ================= */}
      {test.score === null ? (
        <button
          onClick={() => navigate(`/${test.test_set_id}/questions`)}
          className="flex items-center gap-2 text-green-600 hover:text-green-800"
          title="Start Exam"
        >
          <FiArrowRight size={18} />
          <span>Start Exam</span>
        </button>
      ) : (
           
        

        <span className="text-blue-700 font-semibold">
           <button
          onClick={() => navigate(`/${test.test_set_id}/${userId}`)}
          className="flex items-center gap-2 text-green-600 hover:text-green-800"
          title="Start Exam"
        >
          <FiArrowRight size={18} />
          <span>view Questions </span>
        </button>

          {test.score} / {test.total_questions}
        </span>

        
      )}
    </div>

    {/* ================= META INFO ================= */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">

      {/* Total Questions */}
      <div>
        <span className="font-medium">Questions</span>
        <p>{test.total_questions}</p>
      </div>

      {/* Exam Type */}
      <div>
        <span className="font-medium">Exam Type</span>
        <p>{test.exam_type}</p>
      </div>

      {/* TIMED */}
      {test.exam_type === "TIMED" && (
        <div>
          <span className="font-medium">Duration</span>
          <p>{test.duration_minutes} mins</p>
        </div>
      )}

      {/* FIXED TIME */}
      {test.exam_type === "FIXED_TIME" && (
        <>
          <div>
            <span className="font-medium">Start Time</span>
            <p>{formatDateTime(test.start_time)}</p>
          </div>
          <div>
            <span className="font-medium">End Time</span>
            <p>{formatDateTime(test.end_time)}</p>
          </div>
        </>
      )}

      {/* PASS THRESHOLD */}
      <div>
        <span className="font-medium">Pass Mark</span>
        <p>{test.pass_threshold}</p>
      </div>

    </div>
  </div>
)}



              {/* Admin / Instructor */}
              {role !== "Student" && (
                <>
                  <button
                    onClick={() =>
                      editTestId === test.id
                        ? handleUpdate()
                        : handleEdit(test.id, test.title)
                    }
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FiEdit size={20} />
                  </button>

                  <button
                    onClick={() => handleDelete(test.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestManagement;
