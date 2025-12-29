import React from "react";
import ForgotPassword from "../pages/ForgotPassword";
import AdminDashboard from "../pages/Admin/AdminDashboard";
// import InstructorDashboard from "../pages/Instructor/InstructorDashboard"
import Classes from "../pages/Instructor/Classes";
import Docs from "../pages/Instructor/Docs";
import Test from "../components/TestQuestions";
import TestMaker from "../components/ParseQuestions";
import StudentDashboard from "../pages/StudentDashboard";
import GenerateTest from "../components/GenerateTest";





const routesConfig = [
  { path: '/forgotpassword', element: <ForgotPassword /> },
  { path: '/dashboard', element: <AdminDashboard />, roles: ['admin', 'Instructor'], label: 'Dashboard' },
  { path: '/:classId/docs', element: <Docs />, roles: ['admin', 'Instructor', 'Student'] },
  { path: '/as', element: <StudentDashboard />, roles: ['Student'] },
  { path: '/classes', element: <Classes />, roles: ['admin', 'Instructor', 'Student'], label: 'Classes' },
  { path: '/test', element: <Test />, roles: ['Student'], label: 'Test' },
  { path: '/Test', element: <TestMaker />, roles: ['admin', 'Instructor'], label: 'Test' },
  { path: '/:classId/generatetest', element: <GenerateTest />, roles: ['admin', 'Instructor'] },
];

export default routesConfig;
