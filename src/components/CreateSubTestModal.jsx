
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import testAPI from "../entities/test";
import { FiDownload, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";


const CreateSubTestModal = ({ testId, onClose }) => {
  const [sets, setSets] = useState(1);
  const [questions, setQuestions] = useState(5);
  const [examType, setExamType] = useState("UNTIMED");
  const [duration, setDuration] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [passPercent, setPassPercent] = useState("");
  const [loading, setLoading] = useState(false);
  
  
 

  const submit = async () => {
    try {
        
      setLoading(true);

      

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/subtest/${testId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            numberOfSets: sets,
            questionsPerSet: questions,
            examType,
            durationMinutes: duration || null,
            startTime: examType === "FIXED_TIME" ? startTime : null,
            endTime: examType === "FIXED_TIME" ? endTime : null,
            passThreshold: passPercent
          })
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create subtests");
      }

      alert("✅ Subtests created successfully");
      onClose(); // 🔥 CLOSE MODAL HERE

    } catch (err) {
      console.error(err);
      alert("❌ Failed to create subtests");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Create Subtest</h2>

        {/* FORM */}
        <label>Number of Sets</label>
        <input
          type="number"
          value={sets}
          onChange={e => setSets(+e.target.value)}
          className="w-full border p-2 mb-2"
        />

        <label>Questions per Set</label>
        <input
          type="number"
          value={questions}
          onChange={e => setQuestions(+e.target.value)}
          className="w-full border p-2 mb-2"
        />

        <label>Exam Type</label>
        <select
          value={examType}
          onChange={e => setExamType(e.target.value)}
          className="w-full border p-2 mb-2"
        >
          <option value="UNTIMED">Untimed</option>
          <option value="TIMED">Timed</option>
          <option value="FIXED_TIME">Fixed Time</option>
        </select>

         <label>Pass Threshold</label>
        <input
          type="number"
          value={passPercent}
          onChange={e => setPassPercent(+e.target.value)}
          className="w-full border p-2 mb-2"
        />

        {examType === "TIMED" && (
          <>
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full border p-2 mb-2"
            />
          </>
        )}

        {examType === "FIXED_TIME" && (
          <>
            <label>Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full border p-2 mb-2"
            />

            <label>End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full border p-2 mb-2"
            />
          </>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};



export default CreateSubTestModal;