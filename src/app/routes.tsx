import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import RegisterStep1 from "./pages/Register/Step1";
import RegisterStep2 from "./pages/Register/Step2";
import RegisterStep3 from "./pages/Register/Step3";
import RegisterStep4 from "./pages/Register/Step4";
import RegisterStep5 from "./pages/Register/Step5";
import RegisterSuccess from "./pages/Register/Success";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Schedule from "./pages/Dashboard/Schedule";
import Grades from "./pages/Dashboard/Grades";
import ProfessorActivities from "./pages/Dashboard/Activities";
import Compositions from "./pages/Dashboard/Compositions";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register/step1", element: <RegisterStep1 /> },
  { path: "/register/step2", element: <RegisterStep2 /> },
  { path: "/register/step3", element: <RegisterStep3 /> },
  { path: "/register/step4", element: <RegisterStep4 /> },
  { path: "/register/step5", element: <RegisterStep5 /> },
  { path: "/register/success", element: <RegisterSuccess /> },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "schedule", element: <Schedule /> },
      { path: "grades", element: <Grades /> },
      { path: "activities", element: <ProfessorActivities /> },
      { path: "compositions", element: <Compositions /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
