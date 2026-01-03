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
import Scoremodal from "../components/Scoremodal";
import ClassWiseScore from "../components/ClassWiseScore";
import TestReview from "../components/TestReview";
import UserFullDetails from "../components/UserFullDetails";






const routesConfig = [
  { path: '/forgotpassword', element: <ForgotPassword /> },
  { path: '/dashboard', element: <AdminDashboard />, roles: ['admin', 'Instructor'] },
  { path: '/testMakere', element: <TestMaker/>, roles: ['admin', 'Instructor'] },
  { path: '/:classId/docs', element: <Docs/>, roles: ['admin', 'Instructor','Student'] },
  { path: '/as', element: <StudentDashboard/>, roles: ['Student']},
   { path: '/classes', element: <Classes/>, roles: ['admin', 'Instructor', 'Student'] },
   { path: '/:testId/questions', element: <Test/>, roles: ['Student']},
   { path: '/:userId/details', element: <UserFullDetails/>, roles: ['admin', 'Instructor']},
  { path: '/Test', element: <Scoremodal/>, roles: ['admin', 'Instructor','Student']},
   { path: '/:classId/generatetest', element: <GenerateTest/>, roles: ['admin', 'Instructor']},
  {path : '/:testId/review', element :<ClassWiseScore/>, roles: ['admin', 'Instructor','Student']},
    {path : '/:test_set_id/:student_id', element :<TestReview/>, roles: ['admin', 'Instructor','Student']},

 
];
export default routesConfig;