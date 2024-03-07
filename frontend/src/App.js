import logo from './logo.svg';
import './App.css';
import AdminHeader from './components/Admin/Header';
import Header from './components/Header';
import Banner from './components/Banner';
import AdminSidebar from './components/Admin/Sidebar';
import Login from './components/Login';
import Registration from './components/Registration';
import RegisterUsers from './components/Admin/RegisterUsers';
import RegisterPatient from './components/Admin/RegisterPatient';
import ReceptionistProfile from './components/Receptionist/ReceptionistProfile';
import RegisterReceptionist from './components/Admin/RegisterUsers';
import Doctors from './components/Doctors';
import ReceptionistDashboard from './components/Receptionist/ReceptionistDashboard';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import CounterPage from './components/Counter';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function Home() {
  return (
    <>
      <Header />
      <Banner />
    </>
  );
}

// function Dash() {
  

//   const token = Cookies.get('authToken');
//   const navigate = useNavigate();
//   if (!token) {
//     console.log('User not authenticated. Redirecting to login...');
//     navigate('/login');
//     return;
//   }
  
  
//   return (
//     <>

//       <AdminHeader/>
//       <Dashboard/>
//       <AdminSidebar/>
//     </>
//   );
// }

function Counter() {
  return (
    <div>
      <CounterPage />
    </div>
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
