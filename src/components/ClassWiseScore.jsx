import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import testAPI from "../entities/test";
import { FiDownload, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";

const ClassWiseScore = () => {
  const { testId } = useParams();
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [testId]);

  const fetchData = async () => {
    try {
      const data = await testAPI.getTestScoreInfo(testId);
      setScoreData(data);
    } catch (err) {
      console.error("Failed to load score data", err);
    }
  };

  if (!scoreData) {
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Loading test scores…
      </p>
    );
  }

  const attemptedCount = scoreData.students.filter(
    s => s.score !== null
  ).length;

  const pendingCount = scoreData.students.length - attemptedCount;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* ================= HEADER CARD ================= */}
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h1 className="text-3xl font-bold text-indigo-700">
          {scoreData.test_title}
        </h1>
        <p className="text-gray-600 mt-1">
          Class: {scoreData.class_name.trim()}
        </p>

        {/* Summary */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <span className="flex items-center gap-2 text-blue-700">
            <FiUsers /> Total: {scoreData.students.length}
          </span>
          <span className="flex items-center gap-2 text-green-700">
            <FiCheckCircle /> Completed: {attemptedCount}
          </span>
          <span className="flex items-center gap-2 text-yellow-700">
            <FiClock /> Pending: {pendingCount}
          </span>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="flex flex-wrap gap-3 justify-end">
        <button
          onClick={() =>
            window.open(
              `${import.meta.env.VITE_API_URL}/tests/download/${testId}`,
              "_blank"
            )
          }
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <FiDownload /> Test PDF
        </button>

        <button
          onClick={() =>
            window.open(
              `${import.meta.env.VITE_API_URL}/tests/downloadscore/${testId}`,
              "_blank"
            )
          }
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
        >
          <FiDownload /> Score PDF
        </button>
      </div>

      {/* ================= SCORE TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-gray-700">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Army ID</th>
              <th className="px-4 py-3 text-left">Regiment</th>
              <th className="px-4 py-3 text-left">Batch</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {scoreData.students.map((student, index) => {
              const attempted = student.score !== null;

              return (
                <tr
                  key={student.student_id}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{student.name}</td>
                  <td className="px-4 py-3">{student.army_id}</td>
                  <td className="px-4 py-3">{student.regiment}</td>
                  <td className="px-4 py-3">{student.batch_no}</td>

                  <td className="px-4 py-3 text-center font-semibold">
                    {attempted ? (
                      <span className="text-indigo-700">
                        {student.score} / {student.total_questions}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {attempted ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Not Attempted
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ClassWiseScore;
