import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Banner from "./components/Banner";
import Login from "./components/Login";
import Registration from "./components/Registration";
import RegisterUsers from "./components/Admin/RegisterUsers";
import RegisterPatient from "./components/Admin/RegisterPatient";
import ReceptionistProfile from "./components/Receptionist/ReceptionistProfile";
import RegisterReceptionist from "./components/Admin/RegisterUsers";
import Doctors from "./components/Doctors";
import CounterPage from "./components/Counter";
import Dashboard from "./components/Dashboard";

// 1. IMPORT THE NEW COMPONENT
import PageNotFound from "./components/PageNotFound";

import "./App.css";

function Home() {
  return (
    <>
      <Header />
      <Banner />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/findDoctors" element={<Doctors />} />
        <Route path="/counter" element={<CounterPage />} />

        {/* Unified Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin / Receptionist Utility Pages */}
        <Route path="/registerUsers" element={<RegisterUsers />} />
        <Route path="/registerPatient" element={<RegisterPatient />} />
        <Route
          path="/registerReceptionist"
          element={<RegisterReceptionist />}
        />
        <Route path="/receptionistProfile" element={<ReceptionistProfile />} />

        {/* 2. ADD THIS CATCH-ALL ROUTE AT THE VERY BOTTOM */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
