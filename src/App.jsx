// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import SurveyFlow from './pages/SurveyFlow';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/survey" element={<SurveyFlow />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        
        {/* CONSOLE D'ADMINISTRATION CEO */}
        <Route path="/darkyelydb42" element={<AdminDashboard />} />
      </Routes>
      <ToastContainer position="top-center" theme="dark" />
    </Router>
  );
}

export default App;
