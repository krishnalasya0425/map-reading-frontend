import React, { useEffect, useState } from "react";
import userAPI from "../entities/users";
import classAPI from "../entities/class";
import testAPI from "../entities/test";
import { useParams } from "react-router-dom";


const UserFullDetails = () => {
  const {userId} = useParams();
  console.log(userId)

  const [userData, setUserData] = useState(null);
  const [classData, setClassData] = useState([]);
  const [testData, setTestData] = useState([]);

  const fetchData = async () => {
    try {
      const u = await userAPI.getUserDetails(userId);
      const c = await classAPI.getAllClasses(userId, "Student");
      const t = await testAPI.getAllTests(userId, "Student");
      console.log(u)
      setUserData(u);
      setClassData(c);
      setTestData(t);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!userData) return <p>Loading...</p>;

  const {
    name,
    army_id,
    regiment,
    batch_no,
    role,
    status,
  } = userData;

  return (
    <div className="p-6 space-y-10">

      {/* ================= USER DETAILS ================= */}
      <div>
        <h2 className="text-xl font-bold mb-3">User Details</h2>
      <button 
            onClick={() =>
            window.open(
              `${import.meta.env.VITE_API_URL}/users/download/${userId}`,
              "_blank"
            )
          }
          
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
            Download User Info PDF
          </button>
        <table className="min-w-full border">
          <tbody>
            <tr><td className="p-2 font-semibold">Name</td><td>{name}</td></tr>
            <tr><td className="p-2 font-semibold">Army ID</td><td>{army_id}</td></tr>
            <tr><td className="p-2 font-semibold">Regiment</td><td>{regiment}</td></tr>
            <tr><td className="p-2 font-semibold">Batch</td><td>{batch_no}</td></tr>
            <tr><td className="p-2 font-semibold">Role</td><td>{role}</td></tr>
            <tr><td className="p-2 font-semibold">Status</td><td>{status}</td></tr>
          </tbody>
        </table>
      </div>

      {/* ================= CLASS DETAILS ================= */}
      <div>
        <h2 className="text-xl font-bold mb-3">Assigned Classes</h2>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Class Name</th>
            </tr>
          </thead>
          <tbody>
            {classData.map(({ id, class_name }, index) => (
              <tr key={id}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{class_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= TEST DETAILS ================= */}
      <div>
        <h2 className="text-xl font-bold mb-3">Test Results</h2>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Test</th>
              <th className="p-2">Set</th>
               <th className="p-2">Exam Type</th>
              <th className="p-2">Score</th>
              <th className="p-2">Pass Threshold</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {testData.map(
              ({
                student_test_set_id,
                test_title,
                set_name,
                score,
                pass_threshold,
                total_questions,
                exam_type

              }) => {
                const attempted = score !== null;
                const passed = attempted && score >= pass_threshold;

                return (
                  <tr key={student_test_set_id} className="text-center">
                    <td className="p-2">{test_title}</td>
                    <td className="p-2">{set_name}</td>
                     <td className="p-2">{exam_type}</td>
                    <td className="p-2">
                      {attempted ? `${score} / ${total_questions}` : "—"}
                    </td>
                    <td className="p-2">{pass_threshold}</td>
                    <td className="p-2 font-semibold">
                      {!attempted && (
                        <span className="text-yellow-600">Not Attempted</span>
                      )}
                      {attempted && passed && (
                        <span className="text-green-600">PASS</span>
                      )}
                      {attempted && !passed && (
                        <span className="text-red-600">FAIL</span>
                      )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserFullDetails;
