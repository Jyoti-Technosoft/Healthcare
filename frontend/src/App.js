import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Banner from './components/Banner';
import Login from './components/Login';
import Registration from './components/Registration';
import RegisterUsers from './components/Admin/RegisterUsers';
import RegisterPatient from './components/Admin/RegisterPatient';
import ReceptionistProfile from './components/Receptionist/ReceptionistProfile';
import RegisterReceptionist from './components/Admin/RegisterUsers';
import Doctors from './components/Doctors';
import CounterPage from './components/Counter';
import Dashboard from './components/Dashboard';
import './App.css';

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
    <>
      <Router>
        <Routes>
          <Route path="/counter" element={<CounterPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/findDoctors" element={<Doctors />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registerUsers" element={<RegisterUsers />} />
          <Route path="/registerPatient" element={<RegisterPatient />} />
          <Route path="/registerReceptionist" element={<RegisterReceptionist />} />
          <Route path="/receptionistProfile" element={<ReceptionistProfile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
