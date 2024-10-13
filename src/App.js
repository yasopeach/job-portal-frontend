import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import Favorites from './pages/Favorites';
import Logout from './pages/Logout';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import AdminJobs from './pages/AdminJobs';
import AdminUsers from './pages/AdminUsers';
import AdminApplications from './pages/AdminApplications';
import { AuthProvider } from './contexts/AuthContext';
import EmployerApplications from './pages/EmployerApplications';
import MyApplications from './pages/MyApplications';
import Register from './pages/Register';
import CreateJob from './pages/CreateJob';
import UpdateJob from './pages/UpdateJob';
import ChangePassword from './pages/ChangePassword';
import Notifications from './pages/Notifications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/login" element={<Login />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/EmployerApplications" element={<EmployerApplications />} />
            <Route path="/MyApplications" element={<MyApplications />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/update-job/:jobId" element={<UpdateJob />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/Notifications" element={<Notifications />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
