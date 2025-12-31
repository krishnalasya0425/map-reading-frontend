import React, { useEffect, useState } from "react";
import { classAPI } from "../../entities/class";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiArrowRight, FiPlus } from "react-icons/fi";
import Users from "../../entities/users";

const Classes = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id"); // current user id (Instructor or Student)

  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");

  const [addClassName, setAddClassName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editClassId, setEditClassId] = useState(null);
  const [editClassName, setEditClassName] = useState("");
  // 🔹 Admin Add Class Modal states
const [showAddModal, setShowAddModal] = useState(false);
const [className, setClassName] = useState("");
const [instructorId, setInstructorId] = useState("");
const [zipFile, setZip] = useState(null);


  // Load classes on mount AND when instructor filter changes
  useEffect(() => {
    loadClasses();
  }, [selectedInstructorId]);

  const loadClasses = async () => {
    try {
      let data;

      // ---------------------------------------
      // ADMIN → Fetch all OR filtered by instructor
      // ---------------------------------------
      if (role === "admin") {
        // Load instructor list once
        if (instructors.length === 0) {
          const inst = await Users.getByRole("Instructor");
          setInstructors(inst);
        }

        if (selectedInstructorId) {
          data = await classAPI.getAllClasses(selectedInstructorId);
        } else {
          data = await classAPI.getAllClasses();
        }
      }

      // ---------------------------------------
      // STUDENT → Fetch assigned classes
      // ---------------------------------------
      else if (role === "Student") {
        data = await classAPI.getAllClasses(id, "Student");
      }

      // ---------------------------------------
      // INSTRUCTOR → Fetch own created classes
      // ---------------------------------------
      else {
        data = await classAPI.getAllClasses(id);
      }

      setClasses(data);
    } catch (err) {
      console.error("Error loading classes", err);
    }
  };


  const submitAddClass = async () => {
  if (!className || !instructorId ) {
    alert("Please fill all fields");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("class_name", className);
    formData.append("instructor_id", instructorId);
   

    await classAPI.adminAddClass(formData);

    alert("Class created successfully");

    setShowAddModal(false);
    setClassName("");
    setInstructorId("");
    

    loadClasses();
  } catch (err) {
    console.error(err);
    alert("Failed to create class");
  }
};


  const handleAdd = async () => {
    await classAPI.addClass(addClassName, id);
    setAddClassName("");
    loadClasses();
  };

  const handleDelete = async (id) => {
    await classAPI.deleteClass(id);
    loadClasses();
  };

    const handleEdit = (id, name) => {
    setEditMode(true);
    setEditClassId(id);
    setEditClassName(name);
  };

  const handleUpdate = async () => {
    await classAPI.updateClass(editClassId, editClassName);
    setEditMode(false);
    setEditClassName("");
    setEditClassId(null);
    loadClasses();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h2 className="text-3xl font-bold mb-4">Class Management</h2>

      {/* ================================
         ADMIN → FILTER BY INSTRUCTOR
      ================================= */}
      {role === "admin" && (
        <div className="mb-5">
          <label className="block mb-2 font-semibold">Filter by Instructor</label>

          <select
            className="border px-3 py-2 rounded w-full text-black"
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

      {/* ================================
   ADMIN → ADD CLASS BUTTON & MODAL
================================ */}
{role === "admin" && (
  <>
    <button
      className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      onClick={() => setShowAddModal(true)}
    >
      + Add Class
    </button>

    {showAddModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded w-[400px]">
          <h3 className="text-xl font-bold mb-4">Add Class</h3>

          <input
            placeholder="Class Name"
            className="border w-full mb-3 px-3 py-2"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />

          <select
            className="border w-full mb-3 px-3 py-2"
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
          >
            <option value="">Select Instructor</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={submitAddClass}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)}

      {/* ================================
         CLASS LIST
      ================================= */}
      <div className="space-y-3">
        {classes.map((cls, idx) => (
          <div
            key={cls.id}
            className="p-4 shadow bg-white rounded flex justify-between items-center"
          >
            <h1>{idx + 1}.</h1>

            {/* CLASS NAME */}
            {editMode && editClassId === cls.id ? (
              <input
                value={editClassName}
                onChange={(e) => setEditClassName(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            ) : (
              <span className="text-lg font-medium">{cls.class_name}</span>
            )}

            <div className="flex gap-4">
              {/* OPEN SYLLABUS */}
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => navigate(`/${cls.id}/docs`)}
              >
                <FiArrowRight size={20} />
              </button>

              {/* Instructor/Admin → Edit/Delete */}
              {role !== "Student" && (
                <>
                  <button
                    onClick={() =>
                      editMode
                        ? handleUpdate()
                        : handleEdit(cls.id, cls.class_name)
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit size={20} />
                  </button>

                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* =========================
    ADMIN ADD CLASS MODAL
========================= */}
{showAddModal && role === "admin" && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded w-[400px]">
      <h3 className="text-xl font-bold mb-4">Add Class</h3>

      <input
        placeholder="Class Name"
        className="border w-full mb-3 px-3 py-2"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <select
        className="border w-full mb-3 px-3 py-2"
        value={instructorId}
        onChange={(e) => setInstructorId(e.target.value)}
      >
        <option value="">Select Instructor</option>
        {instructors.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name}
          </option>
        ))}
      </select>

      

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={() => setShowAddModal(false)}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={submitAddClass}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Classes;
