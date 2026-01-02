// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import testAPI from "../entities/test";
// import { FiDownload, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";

// const ClassWiseScore = () => {
//   const { testId } = useParams();
//   const [scoreData, setScoreData] = useState(null);

  // useEffect(() => {
  //   fetchData();
  // }, [testId]);

  // const fetchData = async () => {
  //   try {
  //     const data = await testAPI.getTestScoreInfo(testId);
  //     setScoreData(data);
  //   } catch (err) {
  //     console.error("Failed to load score data", err);
  //   }
  // };

//   if (!scoreData) {
//     return (
//       <p className="text-center mt-20 text-gray-500 text-lg">
//         Loading test scores…
//       </p>
//     );
//   }

//   const attemptedCount = scoreData.students.filter(
//     s => s.score !== null
//   ).length;

//   const pendingCount = scoreData.students.length - attemptedCount;

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">

//       {/* ================= HEADER CARD ================= */}
//       <div className="bg-white rounded-xl shadow p-6 text-center">
//         <h1 className="text-3xl font-bold text-indigo-700">
//           {scoreData.test_title}
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Class: {scoreData.class_name.trim()}
//         </p>

//         {/* Summary */}
//         <div className="flex justify-center gap-6 mt-4 text-sm">
//           <span className="flex items-center gap-2 text-blue-700">
//             <FiUsers /> Total: {scoreData.students.length}
//           </span>
//           <span className="flex items-center gap-2 text-green-700">
//             <FiCheckCircle /> Completed: {attemptedCount}
//           </span>
//           <span className="flex items-center gap-2 text-yellow-700">
//             <FiClock /> Pending: {pendingCount}
//           </span>
//         </div>
//       </div>

//       {/* ================= ACTION BUTTONS ================= */}
      // <div className="flex flex-wrap gap-3 justify-end">
      //   <button
      //     onClick={() =>
      //       window.open(
      //         `${import.meta.env.VITE_API_URL}/tests/download/${testId}`,
      //         "_blank"
      //       )
      //     }
      //     className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
      //   >
      //     <FiDownload /> Test PDF
      //   </button>

//         <button
//           onClick={() =>
//             window.open(
//               `${import.meta.env.VITE_API_URL}/tests/downloadscore/${testId}`,
//               "_blank"
//             )
//           }
//           className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
//         >
//           <FiDownload /> Score PDF
//         </button>
//       </div>

      // {/* ================= SCORE TABLE ================= */}
      // <div className="overflow-x-auto bg-white rounded-xl shadow">
      //   <table className="min-w-full text-sm">
      //     <thead className="bg-gray-100 sticky top-0 z-10">
      //       <tr className="text-gray-700">
      //         <th className="px-4 py-3 text-left">#</th>
      //         <th className="px-4 py-3 text-left">Name</th>
      //         <th className="px-4 py-3 text-left">Army ID</th>
      //         <th className="px-4 py-3 text-left">Regiment</th>
      //         <th className="px-4 py-3 text-left">Batch</th>
      //         <th className="px-4 py-3 text-center">Score</th>
      //         <th className="px-4 py-3 text-center">Status</th>
      //       </tr>
      //     </thead>

      //     <tbody>
      //       {scoreData.students.map((student, index) => {
      //         const attempted = student.score !== null;

      //         return (
      //           <tr
      //             key={student.student_id}
      //             className={`border-t ${
      //               index % 2 === 0 ? "bg-white" : "bg-gray-50"
      //             } hover:bg-indigo-50 transition`}
      //           >
      //             <td className="px-4 py-3">{index + 1}</td>
      //             <td className="px-4 py-3 font-medium">{student.name}</td>
      //             <td className="px-4 py-3">{student.army_id}</td>
      //             <td className="px-4 py-3">{student.regiment}</td>
      //             <td className="px-4 py-3">{student.batch_no}</td>

      //             <td className="px-4 py-3 text-center font-semibold">
      //               {attempted ? (
      //                 <span className="text-indigo-700">
      //                   {student.score} / {student.total_questions}
      //                 </span>
      //               ) : (
      //                 <span className="text-gray-400">—</span>
      //               )}
      //             </td>

      //             <td className="px-4 py-3 text-center">
      //               {attempted ? (
      //                 <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
      //                   Completed
      //                 </span>
      //               ) : (
      //                 <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
      //                   Not Attempted
      //                 </span>
      //               )}
      //             </td>
      //           </tr>
      //         );
      //       })}
      //     </tbody>
      //   </table>
      // </div>

//     </div>
//   );
// };

// export default ClassWiseScore;


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import testAPI from "../entities/test";
import setTestAPI from "../entities/settest"
import scoreAPI from "../entities/score";
import { useNavigate } from "react-router-dom";

import { FiDownload, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";
import CreateSubTestModal from "./CreateSubTestModal";


const ClassWiseScore = () => {
    const navigate = useNavigate();
  const { testId } = useParams();
  const [open, setOpen] = useState(false);
  const [testSetResults, setTestSetResults] = useState(null);

const [data, setData] = useState({
  test_id: null,
  total_sets: 0,
  sets: []
});

  
  
    useEffect(() => {
      fetchData();
    }, [testId]);
  
      const fetchData = async () => {
        try {
          const data1 = await setTestAPI.getSetTest(testId);
         setData(data1);
        } catch (err) {
          console.error("Failed to load score data", err);
        }
      };

      const handleTestData = async (testSetId) => {
        try {
          const data2 = await scoreAPI.getTestSetResults(testSetId); 
          setTestSetResults(data2);
          console.log("Test Set Results:", data2);
        } catch (err) {
          console.error("Failed to load test set results", err);
        }
      };

   



  return (
    <>
    
     <div className="max-w-5xl mx-auto p-6">

  {/* ===== SUMMARY ===== */}
  <div className="mb-6 text-center">
    <h1 className="text-2xl font-bold text-indigo-700">
      Total Sub Tests: {data.total_sets}
    </h1>

       <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Subtest
      </button>

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
  </div>

  {/* ===== SETS GRID ===== */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data.sets.map(
      ({ set_id, set_name, exam_type, total_questions }, index) => (
        <div
          key={set_id}
          className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition"
        >
          {/* Set Title */}
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {set_name}
          </h2>

          <button onClick={() => handleTestData(set_id)} className="mb-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            View Results
          </button>

          {/* Exam Type Badge */}
          <span
            className={`inline-block px-3 py-1 text-sm rounded-full mb-3
              ${
                exam_type === "TIMED"
                  ? "bg-blue-100 text-blue-700"
                  : exam_type === "FIXED_TIME"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
          >
            {exam_type.replace("_", " ")}
          </span>

          {/* Details */}
          <p className="text-gray-600">
            Total Questions:{" "}
            <span className="font-semibold">{total_questions}</span>
          </p>

          {/* Optional Action */}
          <button 
            onClick={() =>
            window.open(
              `${import.meta.env.VITE_API_URL}/subtest/download/${set_id}`,
              "_blank"
            )
          }
          
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            View Questions
          </button>
        </div>
      )
    )}
  </div>
</div>


<div className="overflow-x-auto bg-white rounded-xl shadow">
  <table className="min-w-full text-sm">
    <thead className="bg-gray-100 sticky top-0">
      <tr className="text-gray-700">
        <th className="px-4 py-3 text-left">#</th>
        <th className="px-4 py-3 text-left">Name</th>
        <th className="px-4 py-3 text-left">Army ID</th>
        <th className="px-4 py-3 text-left">Regiment</th>
        <th className="px-4 py-3 text-left">Batch</th>
        <th className="px-4 py-3 text-center">Score</th>
        <th className="px-4 py-3 text-center">Status</th>
        <th className="px-4 py-3 text-center">Action</th>
      </tr>
    </thead>

    <tbody>
      {testSetResults?.results?.map((student, index) => {
        const attempted = student.score !== null;
        const passed = attempted && student.score >= testSetResults.pass_threshold;

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

            {/* SCORE */}
            <td className="px-4 py-3 text-center font-semibold">
              {attempted ? (
                <span className="text-indigo-700">{student.score}</span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </td>

            {/* STATUS */}
            <td className="px-4 py-3 text-center">
              {!attempted && (
                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                  Not Attempted
                </span>
              )}

              {attempted && passed && (
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  PASS
                </span>
              )}

              {attempted && !passed && (
                <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                  FAIL
                </span>
              )}
            </td>

            {/* ACTION */}
            <td className="px-4 py-3 text-center">
              <button
                disabled={!attempted}
                onClick={() =>
                  navigate(`/${testSetResults.test_set_id}/${student.student_id}`)
                }
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition
                  ${
                    attempted
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                View Score
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


           
   
    

      {open && (
        <CreateSubTestModal
          testId={testId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
export default ClassWiseScore;


